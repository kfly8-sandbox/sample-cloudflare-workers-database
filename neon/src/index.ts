import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

const sqlWithKV = async (nq: NeonQueryFunction<false,false>, kv: KVNamespace<string>, query: string) => {
  const cacheKey = `sql:${query}`;
  const cachedValue = await kv.get(cacheKey);
  if (cachedValue) {
    const parsedValue = JSON.parse(cachedValue);
    return parsedValue;
  }
  else {
    const rows = await nq.query(query);
    const stringifiedValue = JSON.stringify(rows);
    await kv.put(cacheKey, stringifiedValue, { expirationTtl: 60 });
    return rows;
  }
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const sql = neon(env.DATABASE_URL);
    const url = new URL(request.url);

    if (
      request.method === 'GET' &&
      url.pathname === '/api/todos'
    ) {
      const rows = await sql`SELECT * FROM todos`;
      return Response.json(rows);
    }

    if (
      request.method === 'GET' &&
      url.pathname === '/api/todos/with-kv'
    ) {
      const kv = env.sample_cloudflare_workers_database_neon_cache
      const rows = await sqlWithKV(sql, kv, 'SELECT * FROM todos');
      return Response.json(rows);
    }

    if (
      request.method === 'POST' &&
      url.pathname === '/api/todos/with-cache'
    ) {
      const todo = {
        title: 'Hello World',
        description: 'This is a test',
        done: false,
      }

      await sql`INSERT INTO todos (title, description, done) VALUES (${todo.title}, ${todo.description}, ${todo.done})`;
      return Response.json(todo, { status: 201 });
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
