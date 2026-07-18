import { DurableObject } from 'cloudflare:workers';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export class VisitorCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS visitors (visitor_id TEXT PRIMARY KEY, first_seen INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS totals (name TEXT PRIMARY KEY, value INTEGER NOT NULL);
      INSERT OR IGNORE INTO totals (name, value) VALUES ('visitors', (SELECT COUNT(*) FROM visitors));
    `);
  }

  async fetch(request) {
    let payload;

    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Invalid request' }, 400);
    }

    if (typeof payload.visitorId !== 'string' || !uuidPattern.test(payload.visitorId)) {
      return json({ error: 'Invalid visitor' }, 400);
    }

    const count = this.ctx.storage.transactionSync(() => {
      const insertion = this.sql.exec(
        'INSERT OR IGNORE INTO visitors (visitor_id, first_seen) VALUES (?, ?)',
        payload.visitorId,
        Date.now(),
      );

      if (insertion.rowsWritten > 0) {
        this.sql.exec("UPDATE totals SET value = value + 1 WHERE name = 'visitors'");
      }

      const total = this.sql.exec("SELECT value FROM totals WHERE name = 'visitors'").one();
      return Number(total.value);
    });

    return json({ count });
  }
}

function getCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (origin !== env.ALLOWED_ORIGIN) return json({ error: 'Forbidden' }, 403);

    const corsHeaders = getCorsHeaders(origin);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

    const url = new URL(request.url);
    if (url.pathname !== '/visit') return json({ error: 'Not found' }, 404);
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

    const id = env.VISITOR_COUNTER.idFromName('portfolio');
    const response = await env.VISITOR_COUNTER.get(id).fetch(request);
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([name, value]) => headers.set(name, value));
    return new Response(response.body, { status: response.status, headers });
  },
};
