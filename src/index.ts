import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';

export default {
  async fetch(request, env, ctx): Promise<Response> {

    const prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    })
    .$extends(withAccelerate());

    const url = new URL(request.url);

    if (url.pathname === '/api/posts') {
      const allPosts = await prisma.post.findMany({
        where: { published: true },
        cacheStrategy: { ttl: 60 },
      });

      return Response.json(allPosts);
    }

    if (url.pathname === '/api/posts/create') {
      await prisma.post.create({
        data: {
          content: 'Hello World',
          title: 'Hello World',
          published: true,
          authorId: 5,
        }
      })
      return Response.json({ message: 'Post created' });
    }

    return new Response('Hello World!');
  },
} satisfies ExportedHandler<Env>;
