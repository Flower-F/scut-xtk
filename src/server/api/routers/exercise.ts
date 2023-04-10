import { DifficultyType, ExerciseType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const exerciseRouter = createTRPCRouter({
  createExercise: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(ExerciseType, {
          invalid_type_error: '题目类型只能选择填空、选择和大题',
        }),
        difficulty: z.nativeEnum(DifficultyType, {
          invalid_type_error: '题目类型只能选择简单、中等和困难',
        }),
        question: z.string().nonempty('题目内容不得为空'),
        answer: z.string().nonempty('题目答案不得为空'),
        analysis: z.string().optional(),
        knowledgePointId: z.string().nonempty('知识点id不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { type, difficulty, question, answer, knowledgePointId, analysis } = input;

      try {
        await ctx.prisma.exercise.create({
          data: {
            type,
            difficulty,
            question,
            answer,
            analysis,
            knowledgePoint: {
              connect: {
                id: knowledgePointId,
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

  updateExercise: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(ExerciseType, {
          invalid_type_error: '题目类型只能选择填空、选择和大题',
        }),
        difficulty: z.nativeEnum(DifficultyType, {
          invalid_type_error: '题目类型只能选择简单、中等和困难',
        }),
        question: z.string().nonempty('题目内容不得为空'),
        answer: z.string().nonempty('题目答案不得为空'),
        analysis: z.string().optional(),
        id: z.string().nonempty('习题id不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { type, difficulty, question, answer, id, analysis } = input;

        await ctx.prisma.exercise.update({
          data: {
            type,
            difficulty,
            question,
            answer,
            analysis,
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

  deleteExercise: protectedProcedure
    .input(z.object({ id: z.string().nonempty('习题id不能为空') }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.exercise.delete({
        where: {
          id,
        },
      });
    }),
});
