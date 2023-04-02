import { z } from 'zod';

import { type NavItemWithChildren } from '~/types/nav';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const collegeRouter = createTRPCRouter({
  getSidebarNavItems: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const { slug } = input;

    // check whether the slug exist

    const result: NavItemWithChildren[] = [
      {
        title: '软件学院',
        items: [
          {
            title: '编译原理',
            items: [
              {
                title: 'Token',
                href: '/dashboard/college/sse?major=12345',
                label: '重点',
                items: [],
              },
              {
                title: 'NFA',
                href: '/dashboard/college/sse?major=45678',
                items: [],
              },
            ],
          },
          {
            title: '数据结构与算法',
            items: [
              {
                title: 'DFS',
                items: [],
              },
              {
                title: 'BFS',
                items: [],
              },
            ],
          },
        ],
      },
    ];

    return result;

    // await ctx.prisma.post.create({
    //   data: {
    //     title,
    //     description,
    //     body,
    //     slug: slugify(title),
    //     user: {
    //       connect: {
    //         id: ctx.session.user.id,
    //       },
    //     },
    //   },
    // });
  }),
});
