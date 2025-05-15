import { neon } from '@neondatabase/serverless';

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
      request.method === 'POST' &&
      url.pathname === '/api/todos'
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
