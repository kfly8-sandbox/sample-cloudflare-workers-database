import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';

export default {
  async fetch(request, env, ctx): Promise<Response> {

    const prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    })
    .$extends(withAccelerate());

    const url = new URL(request.url);

    if (
      request.method === 'GET' &&
      url.pathname === '/api/todos'
    ) {
      const todos = await prisma.todo.findMany({
        //cacheStrategy: { ttl: 60 },
      });

      return Response.json(todos);
    }

    if (
      request.method === 'GET' &&
      url.pathname === '/api/todos/with-cache'
    ) {
      const todos = await prisma.todo.findMany({
        cacheStrategy: { ttl: 60 },
      });

      return Response.json(todos);
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

      await prisma.todo.create({ data: todo })
      return Response.json(todo, { status: 201 });
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
