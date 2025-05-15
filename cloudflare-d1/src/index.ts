import { drizzle } from 'drizzle-orm/d1';
import { todos } from './schema';

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const db = drizzle(env.DB)
    const url = new URL(request.url);

    if (
      request.method === 'GET' &&
      url.pathname === '/api/todos'
    ) {
      const rows = await db.select().from(todos).all();
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

      await db.insert(todos).values(todo).run();
      return Response.json(todo, { status: 201 });
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
