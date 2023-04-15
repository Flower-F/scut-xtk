import { DifficultyType, ExerciseType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const paperRouter = createTRPCRouter({
  createRules: protectedProcedure
    .input(
      z.object({
        rules: z.array(
          z.object({
            type: z.nativeEnum(ExerciseType, {
              invalid_type_error: '题目类型只能为填空、选择和大题',
            }),
            difficulty: z.nativeEnum(DifficultyType, {
              invalid_type_error: '题目难度只能为简单、中等和困难',
            }),
            amount: z.number().int('题目数量必须为整数'),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rules } = input;

      try {
        for (const rule of rules) {
          await ctx.prisma.exerciseRule.create({
            data: {
              type: rule.type,
              difficulty: rule.difficulty,
              amount: rule.amount,
            },
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  updateRules: protectedProcedure
    .input(
      z.object({
        rules: z.array(
          z.object({
            type: z.nativeEnum(ExerciseType, {
              invalid_type_error: '题目类型只能为填空、选择和大题',
            }),
            difficulty: z.nativeEnum(DifficultyType, {
              invalid_type_error: '题目难度只能为简单、中等和困难',
            }),
            amount: z.number().int('题目数量必须为整数'),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rules } = input;

      try {
        await ctx.prisma.paper.deleteMany({
          where: {
            userId: ctx.session.user.id,
          },
        });

        for (const rule of rules) {
          await ctx.prisma.exerciseRule.create({
            data: {
              type: rule.type,
              difficulty: rule.difficulty,
              amount: rule.amount,
            },
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  getPaperExerciseList: protectedProcedure
    .input(z.object({ limit: z.number().int('题目数量必须为整数').optional() }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;

      try {
        const result = await ctx.prisma.paper.findFirst({
          where: {
            userId: ctx.session.user.id,
          },
          take: limit,
          select: {
            exercises: {
              select: {
                id: true,
                type: true,
                difficulty: true,
                question: true,
                answer: true,
                analysis: true,
                options: {
                  select: {
                    id: true,
                    content: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                updatedAt: true,
                bookmarks: {
                  select: {
                    id: true,
                  },
                  where: {
                    userId: ctx.session.user.id,
                  },
                },
              },
            },
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

  createPaper: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await ctx.prisma.paper.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
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

  addExerciseToPaper: protectedProcedure
    .input(
      z.object({
        paperId: z.string().nonempty('试卷id不得为空'),
        exerciseId: z.string().nonempty('题目id不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { exerciseId, paperId } = input;

      try {
        await ctx.prisma.paper.update({
          data: {
            exercises: {
              connect: {
                id: exerciseId,
              },
            },
          },
          where: {
            id: paperId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  removeExerciseFromPaper: protectedProcedure
    .input(
      z.object({ paperId: z.string().nonempty('试卷id不得为空'), exerciseId: z.string().nonempty('题目id不得为空') })
    )
    .mutation(async ({ ctx, input }) => {
      const { paperId, exerciseId } = input;

      try {
        await ctx.prisma.paper.update({
          where: {
            id: paperId,
          },
          data: {
            exercises: {
              disconnect: {
                id: exerciseId,
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
});
