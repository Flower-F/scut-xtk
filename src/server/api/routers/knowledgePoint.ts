import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { type NavItemWithChildren } from '~/types/nav';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const knowledgePointRouter = createTRPCRouter({
  getSidebarNavItems: protectedProcedure
    .input(z.object({ collegeSlug: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      // const result: NavItemWithChildren[] = [
      //   {
      //     id: '1',
      //     name: '软件学院',
      //     slug: 'sse',
      //     items: [
      //       {
      //         id: '1',
      //         name: '编译原理',
      //         items: [
      //           {
      //             id: '1',
      //             name: 'Token',
      //             label: '重点',
      //             items: [],
      //           },
      //           {
      //             id: '2',
      //             name: 'NFA',
      //             items: [],
      //           },
      //         ],
      //       },
      //       {
      //         id: '2',
      //         name: '数据结构与算法',
      //         items: [
      //           {
      //             id: '1',
      //             name: 'DFS',
      //             items: [],
      //           },
      //           {
      //             id: '2',
      //             name: 'BFS',
      //             items: [],
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ];

      const { collegeSlug } = input;

      if (!collegeSlug) {
        return [];
      }

      const result: NavItemWithChildren[] = [];
      const college = await ctx.prisma.college.findFirst({
        where: {
          slug: collegeSlug,
        },
      });

      if (!college) {
        return [];
      }

      const courseList = await ctx.prisma.course.findMany({
        where: {
          collegeId: college.id,
        },
      });

      for await (const course of courseList) {
        const knowledgePointList = await ctx.prisma.knowledgePoint.findMany({
          where: {
            courseId: course.id,
          },
        });

        result.push({
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

      //   try {
      //     const { slug } = input;

      //     if (!slug) {
      //       return [];
      //     }

      //     const college = await ctx.prisma.college.findFirst({
      //       where: {
      //         slug,
      //       },
      //     });

      //     if (!college || !college.id) {
      //       throw new TRPCError({
      //         code: 'PRECONDITION_FAILED',
      //         message: '不存在该学院标识对应的学院',
      //       });
      //     }

      //     const result = await ctx.prisma.course.findMany({
      //       where: {
      //         collegeId: college.id,
      //       },
      //     });

      //     return result;
      //   } catch (error) {
      //     throw new TRPCError({
      //       code: 'INTERNAL_SERVER_ERROR',
      //       message: '服务器出现未知错误',
      //     });
      //   }
    }),

  createKnowledgePoint: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        label: z.string().nullish(),
        courseId: z.string(),
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
          code: 'PRECONDITION_FAILED',
          message: '不存在对应id的课程',
        });
      }
    }),

  updateKnowledgePoint: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        label: z.string().nullish(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, label, id } = input;

        await ctx.prisma.knowledgePoint.update({
          data: {
            name,
            label,
          },
          where: {
            id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: '不存在对应id的课程',
        });
      }
    }),
});
