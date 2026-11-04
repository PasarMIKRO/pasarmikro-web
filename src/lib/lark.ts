import { env } from 'cloudflare:workers';

const API = 'https://open.larksuite.com/open-apis';

export type Table = 'contact' | 'eudr' | 'applications';

/**
 * Saves a form submission as a row in the team's Lark Base, with the CV attached for job applications.
 * The Base is the only copy, so this returns false on any failure and the form then asks
 * the visitor to try again or email us, instead of losing the submission.
 */
export async function saveToBase(table: Table, fields: Record<string, string>, cv?: File): Promise<boolean> {
  if (!env.LARK_APP_SECRET) {
    if (import.meta.env.DEV) {
      console.info(`[lark] LARK_APP_SECRET is empty; ${table} row not saved:\n` + JSON.stringify({ ...fields, CV: cv?.name }, null, 2));
      return true;
    }
    console.error('[lark] LARK_APP_SECRET is not set');
    return false;
  }

  const tableId = { contact: env.LARK_TABLE_CONTACT, eudr: env.LARK_TABLE_EUDR, applications: env.LARK_TABLE_APPLICATIONS }[table];
  try {
    // shortcut: one new tenant token per submission (an extra request); cache it in KV if form traffic grows.
    const { tenant_access_token: token } = await lark<{ tenant_access_token: string }>(
      '/auth/v3/tenant_access_token/internal',
      JSON.stringify({ app_id: env.LARK_APP_ID, app_secret: env.LARK_APP_SECRET }),
    );

    const record: Record<string, unknown> = { ...fields };
    if (cv) {
      const upload = new FormData();
      upload.append('file_name', cv.name.slice(-100));
      upload.append('parent_type', 'bitable_file');
      upload.append('parent_node', env.LARK_BASE_TOKEN);
      upload.append('size', String(cv.size));
      upload.append('file', cv);
      const { data } = await lark<{ data: { file_token: string } }>('/drive/v1/medias/upload_all', upload, token);
      record.CV = [{ file_token: data.file_token }];
    }

    await lark(`/bitable/v1/apps/${env.LARK_BASE_TOKEN}/tables/${tableId}/records`, JSON.stringify({ fields: record }), token);
    return true;
  } catch (err) {
    console.error('[lark]', err);
    return false;
  }
}

async function lark<T>(path: string, body: string | FormData, token?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (typeof body === 'string') headers['content-type'] = 'application/json; charset=utf-8';
  const res = await fetch(API + path, { method: 'POST', headers, body });
  // Lark reports failures in the body; success is code 0.
  const data = (await res.json().catch(() => ({}))) as { code?: number; msg?: string };
  if (data.code !== 0) throw new Error(`${path}: HTTP ${res.status}, code ${data.code}, ${data.msg}`);
  return data as T;
}
