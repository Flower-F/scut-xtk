import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
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
        name: z.string().nonempty('学院名称不得为空'),
        collegeSlug: z.string().nonempty('学院标识不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, collegeSlug } = input;

      try {
        await ctx.prisma.college.create({
          data: {
            name,
            slug: collegeSlug,
          },
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '该slug已存在对应的学院',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  updateCollege: adminProcedure
    .input(
      z.object({
        collegeId: z.string().nonempty('学院id不得为空'),
        name: z.string().nonempty('学院名称不得为空'),
        collegeSlug: z.string().nonempty('学院标识不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, collegeSlug, collegeId } = input;

      try {
        await ctx.prisma.college.update({
          data: {
            name,
            slug: collegeSlug,
          },
          where: {
            id: collegeId,
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
    .input(z.object({ collegeId: z.string().nonempty('学院id不得为空') }))
    .mutation(async ({ ctx, input }) => {
      const { collegeId } = input;

      try {
        await ctx.prisma.college.delete({
          where: {
            id: collegeId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  getCollegeById: publicProcedure
    .input(z.object({ collegeId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { collegeId } = input;

      if (!collegeId) {
        return null;
      }

      try {
        const result = await ctx.prisma.college.findFirst({
          where: {
            id: collegeId,
          },
          select: {
            name: true,
            slug: true,
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

  getCollegeBySlug: publicProcedure
    .input(z.object({ collegeSlug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { collegeSlug } = input;

      if (!collegeSlug) {
        return null;
      }

      try {
        const result = await ctx.prisma.college.findFirst({
          where: {
            slug: collegeSlug,
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
