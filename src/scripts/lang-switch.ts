// Language switch: swaps this page's text to the other language in place, with a short fade,
// keeping the URL, the scroll position and everything scripts set up (menus, slider, forms).
// It reads the other language's build of the same page; when the two differ in structure
// (e.g. an article that only exists in one language), it reloads instead. Base.astro then
// restores the scroll position and src/worker.ts serves the chosen language at the same URL.

declare global {
  interface Window {
    pmLocalize?: () => void; // defined inline in Base.astro
  }
}
export {};

// A DOM text node (the Workers types shadow the DOM's own `Text`).
type TextNode = ChildNode & { data: string };

const SKIP = '.cf-turnstile, script, style, template, iframe, svg';
const INTERACTIVE = 'input, select, textarea, button, form, details, [data-menu]';
const ATTRS = ['href', 'alt', 'title', 'placeholder', 'aria-label', 'aria-current', 'lang', 'hreflang', 'content', 'datetime'];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/** Elements in document order, leaving out widgets that build their own DOM at runtime. */
function elements(root: Element, leaf = SKIP): Element[] {
  const out: Element[] = [];
  const walk = (el: Element) => {
    for (const child of el.children) {
      if (child.tagName.includes('-')) continue; // custom elements such as Astro's dev toolbar
      out.push(child);
      if (!child.matches(leaf)) walk(child);
    }
  };
  walk(root);
  return out;
}

const texts = (el: Element) => [...el.childNodes].filter((n): n is TextNode => n.nodeType === Node.TEXT_NODE);

const fade = (els: Element[], from: number, to: number, duration: number, fill: FillMode = 'none') =>
  els.map((el) => el.animate([{ opacity: from }, { opacity: to }], { duration, easing: 'ease-out', fill }));
// A timer, not the animations' end: a background tab draws no frames, so animations would never end.
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Copies the other page's text and attributes onto this one. False when their structure differs. */
async function swap(next: Document): Promise<boolean> {
  const same = (a: Element[], b: Element[]) => a.length === b.length && a.every((el, i) => el.tagName === b[i].tagName);
  let here = [document.body, ...elements(document.body)];
  let there = [next.body, ...elements(next.body)];
  const replaced: [Element, string][] = [];
  if (!same(here, there)) {
    // Translations of long text (articles, legal pages) rarely match element for element. Swap the
    // whole <main> when it holds nothing interactive, and the header and footer text around it.
    const main = document.querySelector('main');
    const nextMain = next.querySelector('main');
    if (!main || !nextMain || main.querySelector(INTERACTIVE)) return false;
    here = [document.body, ...elements(document.body, `${SKIP}, main`)];
    there = [next.body, ...elements(next.body, `${SKIP}, main`)];
    if (!same(here, there)) return false;
    replaced.push([main, nextMain.innerHTML]);
  }

  const textChanges: [TextNode, string][] = [];
  const attrChanges: [Element, string, string | null][] = [];
  for (const [i, el] of here.entries()) {
    const a = texts(el);
    const b = texts(there[i]);
    if (a.length !== b.length) {
      // Sentences ordered differently around a link or bold word: replace that element's content,
      // which is safe as long as nothing in it is interactive.
      if (el === document.body || el.querySelector(INTERACTIVE)) return false;
      replaced.push([el, there[i].innerHTML]);
      continue;
    }
    a.forEach((node, j) => node.data !== b[j].data && textChanges.push([node, b[j].data]));

    const names = el.matches('input[type=hidden], option') ? [...ATTRS, 'value'] : ATTRS;
    for (const name of names) {
      const value = there[i].getAttribute(name);
      if (el.getAttribute(name) !== value) attrChanges.push([el, name, value]);
    }
  }

  // Fade only the changed text that is on screen; the rest swaps unseen.
  const visible = [...new Set([...textChanges.map(([node]) => node.parentElement!), ...replaced.map(([el]) => el)])].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.width > 0;
  });
  const animate = !reducedMotion.matches;
  const out = animate ? fade(visible, 1, 0, 120, 'forwards') : [];
  if (animate) await wait(120);

  for (const [node, data] of textChanges) node.data = data;
  for (const [el, name, value] of attrChanges) value === null ? el.removeAttribute(name) : el.setAttribute(name, value);
  for (const [el, html] of replaced) el.innerHTML = html;
  document.documentElement.lang = next.documentElement.lang;
  document.title = next.title;
  window.pmLocalize?.();

  for (const a of out) a.cancel();
  if (animate) fade(visible, 0, 1, 220);
  return true;
}

function reload() {
  const max = document.documentElement.scrollHeight - innerHeight;
  try {
    sessionStorage.setItem('pm-lang-scroll', String(max > 0 ? scrollY / max : 0));
  } catch {}
  location.reload();
}

const group = document.querySelector<HTMLElement>('[data-lang-switch]');
let busy = false;

group?.addEventListener('click', async (e) => {
  const link = (e.target as Element).closest<HTMLAnchorElement>('a[hreflang]');
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  const lang = link.hreflang;
  if (busy || lang === document.documentElement.lang) return;
  busy = true;
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;

  // A page that only exists in one language: go to the switch target, at its plain URL.
  if (!('samePage' in group.dataset)) {
    const href = link.getAttribute('href')!;
    location.href = href.startsWith(`/${lang}/`) ? href.slice(lang.length + 1) : href;
    return;
  }

  try {
    // The prefixed build of this page (the plain URL would follow the cookie just set).
    const res = await fetch(link.href, { headers: { accept: 'text/html' } });
    if (!res.ok || !(await swap(new DOMParser().parseFromString(await res.text(), 'text/html')))) reload();
  } catch {
    reload();
  }
  busy = false;
});
