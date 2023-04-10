import { DifficultyType, ExerciseType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const exerciseRouter = createTRPCRouter({
  createExercise: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(ExerciseType),
        difficulty: z.nativeEnum(DifficultyType),
        question: z.string().nonempty('题目内容不得为空'),
        answer: z.string(),
        knowledgePointId: z.string().nonempty('知识点id不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { type, difficulty, question, answer, knowledgePointId } = input;

      try {
        await ctx.prisma.exercise.create({
          data: {
            type,
            difficulty,
            question,
            answer,
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
        type: z.enum(['CHOICE_QUESTION', 'COMPLETION_QUESTION', 'BIG_QUESTION']),
        difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
        question: z.string().nonempty('题目内容不得为空'),
        answer: z.string(),
        id: z.string().nonempty('习题id不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { type, difficulty, question, answer, id } = input;

        await ctx.prisma.exercise.update({
          data: {
            type,
            difficulty,
            question,
            answer,
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

  deleteExercise: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id } = input;
    await ctx.prisma.exercise.delete({
      where: {
        id,
      },
    });
  }),
});
