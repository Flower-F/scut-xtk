import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { type NavItemWithChildren } from '~/types/nav';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const knowledgePointRouter = createTRPCRouter({
  getSidebarNavItems: protectedProcedure
    .input(z.object({ collegeSlug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { collegeSlug } = input;

      if (!collegeSlug) {
        return [];
      }

      const college = await ctx.prisma.college.findFirst({
        where: {
          slug: collegeSlug,
        },
      });

      if (!college) {
        return [];
      }

      const result: NavItemWithChildren[] = [
        {
          ...college,
          items: [],
        },
      ];

      const courseList = await ctx.prisma.course.findMany({
        where: {
          collegeId: college.id,
        },
      });

      for (const course of courseList) {
        const knowledgePointList = await ctx.prisma.knowledgePoint.findMany({
          where: {
            courseId: course.id,
          },
          select: {
            id: true,
            name: true,
            label: true,
          },
        });

        result[0]?.items.push({
          ...course,
          items: knowledgePointList.map((knowledgePoint) => {
            return {
              ...knowledgePoint,
              items: [],
            };
          }),
        });
      }

      return result;
    }),

  createKnowledgePoint: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty('知识点名称不得为空'),
        label: z.string().optional(),
        courseId: z.string().nonempty('课程id不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, label, courseId } = input;

      try {
        const course = await ctx.prisma.course.findFirst({
          where: {
            id: courseId,
          },
        });

        if (!course) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: '不存在对应id的课程',
          });
        }

        await ctx.prisma.knowledgePoint.create({
          data: {
            label,
            name,
            course: {
              connect: {
                id: course.id,
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

  updateKnowledgePoint: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty('知识点名称不得为空'),
        label: z.string().optional(),
        knowledgePointId: z.string().nonempty('知识点id不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, label, knowledgePointId } = input;

        await ctx.prisma.knowledgePoint.update({
          data: {
            name,
            label,
          },
          where: {
            id: knowledgePointId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  deleteKnowledgePoint: protectedProcedure
    .input(z.object({ knowledgePointId: z.string().nonempty('知识点id不得为空') }))
    .mutation(async ({ ctx, input }) => {
      const { knowledgePointId } = input;

      try {
        await ctx.prisma.knowledgePoint.delete({
          where: {
            id: knowledgePointId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  getKnowledgePointById: protectedProcedure
    .input(z.object({ knowledgePointId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { knowledgePointId } = input;

      if (!knowledgePointId) {
        return null;
      }

      try {
        const result = await ctx.prisma.knowledgePoint.findFirst({
          where: {
            id: knowledgePointId,
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
