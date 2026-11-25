// Flow diagrams ([data-flow]): the CSS animation (flow.css) runs only while the diagram is on screen,
// and starts again from step 1 each time it comes back into view.
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.target.classList.toggle('is-playing', e.isIntersecting)),
  { threshold: 0.5 },
);
document.querySelectorAll('[data-flow]').forEach((el) => observer.observe(el));
