import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { adminProcedure, createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const collegeRouter = createTRPCRouter({
  getCollegeList: publicProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.prisma.college.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
        },
      });

      return result;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务器出现未知错误',
      });
    }
  }),

  createCollege: adminProcedure
    .input(
      z.object({
        name: z.string().nonempty('学院姓名不得为空'),
        slug: z.string().nonempty('学院标识不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, slug } = input;

      const college = await ctx.prisma.college.findFirst({
        where: {
          slug,
        },
      });

      if (college) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: '该标识符已存在',
        });
      }

      try {
        await ctx.prisma.college.create({
          data: {
            name,
            slug,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  updateCollege: adminProcedure
    .input(
      z.object({
        id: z.string().nonempty('学院id不得为空'),
        name: z.string().nonempty('学院姓名不得为空'),
        slug: z.string().nonempty('学院标识不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, slug, id } = input;

      try {
        await ctx.prisma.college.update({
          data: {
            name,
            slug,
          },
          where: {
            id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  deleteCollege: adminProcedure
    .input(z.object({ id: z.string().nonempty('学院id不得为空') }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        await ctx.prisma.college.delete({
          where: {
            id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  getCollegeName: publicProcedure.input(z.object({ slug: z.string().nullish() })).query(async ({ ctx, input }) => {
    const { slug } = input;

    if (!slug) {
      return null;
    }

    try {
      const result = await ctx.prisma.college.findFirst({
        where: {
          slug,
        },
        select: {
          name: true,
        },
      });

      return result;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务器出现未知错误',
      });
    }
  }),
});
