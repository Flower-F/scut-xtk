import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const courseRouter = createTRPCRouter({
  getCourseList: protectedProcedure
    .input(z.object({ collegeSlug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
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
          select: {
            id: true,
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

  getCourseListOfUserCollege: protectedProcedure.query(async ({ ctx }) => {
    try {
      const college = await ctx.prisma.college.findFirst({
        where: {
          id: ctx.session.user.collegeId,
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
        select: {
          id: true,
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

  createCourse: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty('课程名称不得为空'),
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
        courseId: z.string().nonempty('课程id不得为空'),
        name: z.string().nonempty('课程名称不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, courseId } = input;

      try {
        await ctx.prisma.course.update({
          data: {
            name,
          },
          where: {
            id: courseId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  deleteCourse: protectedProcedure
    .input(z.object({ courseId: z.string().nonempty('课程id不得为空') }))
    .mutation(async ({ ctx, input }) => {
      const { courseId } = input;

      try {
        await ctx.prisma.course.delete({
          where: {
            id: courseId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),
});
