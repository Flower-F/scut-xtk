import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { adminProcedure, createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const courseRouter = createTRPCRouter({
  getCourseList: protectedProcedure.input(z.object({ collegeSlug: z.string() })).query(async ({ ctx, input }) => {
    try {
      const { collegeSlug } = input;

      if (!collegeSlug) {
        return [];
      }

      const college = await ctx.prisma.college.findFirst({
        where: {
          slug: collegeSlug,
        },
      });

      if (!college || !college.id) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: '不存在该学院标识对应的学院',
        });
      }

      const result = await ctx.prisma.course.findMany({
        where: {
          collegeId: college.id,
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

  createCourse: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty('课程姓名不得为空'),
        collegeSlug: z.string().nonempty('学院标识不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, collegeSlug } = input;

      const college = await ctx.prisma.college.findFirst({
        where: {
          slug: collegeSlug,
        },
      });

      if (!college || !college.id) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: '不存在该学院标识对应的学院',
        });
      }

      try {
        await ctx.prisma.course.create({
          data: {
            name,
            college: {
              connect: {
                id: college?.id,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  updateCourse: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty('课程id不得为空'),
        name: z.string().nonempty('课程姓名不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, id } = input;

      try {
        await ctx.prisma.course.update({
          data: {
            name,
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

  deleteCourse: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id } = input;
    await ctx.prisma.course.delete({
      where: {
        id,
      },
    });
  }),
});
