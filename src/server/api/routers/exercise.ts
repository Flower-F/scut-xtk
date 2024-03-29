import { DifficultyType, ExerciseType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const exerciseRouter = createTRPCRouter({
  createExercise: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(ExerciseType, {
          invalid_type_error: '题目类型只能为填空、选择和大题',
        }),
        difficulty: z.nativeEnum(DifficultyType, {
          invalid_type_error: '题目难度只能为简单、中等和困难',
        }),
        question: z.string().nonempty('题目内容不得为空'),
        answer: z.string().nonempty('题目答案不得为空'),
        analysis: z.string().optional(),
        knowledgePointId: z.string().nonempty('知识点id不得为空'),
        options: z.array(z.object({ content: z.string().nonempty('选项内容不得为空') })).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { type, difficulty, question, answer, knowledgePointId, analysis, options } = input;
      const user = ctx.session.user;

      if (type === 'ALL_QUESTION') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: '题目类型只能为填空、选择和大题',
        });
      }

      if (difficulty === 'ANY') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: '题目难度只能为简单、中等和困难',
        });
      }

      try {
        const exercise = await ctx.prisma.exercise.create({
          data: {
            type,
            difficulty,
            question,
            answer,
            analysis,
            knowledgePoints: {
              connect: {
                id: knowledgePointId,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        if (options && options.length > 0) {
          const createOptions = options.map((option) => {
            return ctx.prisma.option.create({
              data: {
                content: option.content,
                exercise: {
                  connect: {
                    id: exercise.id,
                  },
                },
              },
            });
          });

          await ctx.prisma.$transaction(createOptions);
        }
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
          invalid_type_error: '题目类型只能为填空、选择和大题',
        }),
        difficulty: z.nativeEnum(DifficultyType, {
          invalid_type_error: '题目难度只能为简单、中等和困难',
        }),
        question: z.string().nonempty('题目内容不得为空'),
        answer: z.string().nonempty('题目答案不得为空'),
        analysis: z.string().optional(),
        exerciseId: z.string().nonempty('习题id不得为空'),
        options: z.array(z.object({ content: z.string().nonempty('选项内容不得为空') })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { type, difficulty, question, answer, exerciseId, analysis, options } = input;
        await ctx.prisma.exercise.update({
          data: {
            type,
            difficulty,
            question,
            answer,
            analysis,
          },
          where: {
            id: exerciseId,
          },
        });

        await ctx.prisma.option.deleteMany({
          where: {
            exerciseId,
          },
        });

        if (options.length > 0) {
          const createOptions = options.map((option) => {
            return ctx.prisma.option.create({
              data: {
                content: option.content,
                exercise: {
                  connect: {
                    id: exerciseId,
                  },
                },
              },
            });
          });

          await ctx.prisma.$transaction(createOptions);
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  deleteExercise: protectedProcedure
    .input(z.object({ exerciseId: z.string().nonempty('习题id不能为空') }))
    .mutation(async ({ ctx, input }) => {
      const { exerciseId } = input;

      try {
        await ctx.prisma.exercise.delete({
          where: {
            id: exerciseId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  getExerciseList: protectedProcedure
    .input(
      z.object({
        knowledgePointId: z.string().nonempty('知识点id不得为空'),
        cursor: z.string().nullish(),
        limit: z.number().int('分页数据大小必须是整数'),
        type: z
          .nativeEnum(ExerciseType, {
            invalid_type_error: '题目类型只能为填空、选择和大题',
          })
          .optional(),
        difficulty: z
          .nativeEnum(DifficultyType, {
            invalid_type_error: '题目难度只能为简单、中等和困难',
          })
          .optional(),
        keyword: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { knowledgePointId, cursor, limit, type = 'ALL_QUESTION', difficulty = 'ANY', keyword } = input;

      try {
        const exerciseList = await ctx.prisma.exercise.findMany({
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
          orderBy: {
            createdAt: 'desc',
          },
          take: limit + 1,
          where: {
            knowledgePoints: {
              some: {
                id: {
                  equals: knowledgePointId,
                },
              },
            },
            type: type !== 'ALL_QUESTION' ? type : undefined,
            difficulty: difficulty !== 'ANY' ? difficulty : undefined,
            OR: [
              {
                question: {
                  contains: keyword ? keyword : '',
                },
              },
              {
                answer: {
                  contains: keyword ? keyword : '',
                },
              },
            ],
          },
          cursor: cursor ? { id: cursor } : undefined,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (exerciseList.length > limit) {
          const nextItem = exerciseList.pop();
          if (nextItem) nextCursor = nextItem.id;
        }

        return { exerciseList, nextCursor };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  getExercise: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string().nonempty('知识点id不得为空'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { exerciseId } = input;

      try {
        const result = await ctx.prisma.exercise.findFirst({
          where: {
            id: exerciseId,
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                college: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            id: true,
            question: true,
            answer: true,
            analysis: true,
            options: {
              select: {
                id: true,
                content: true,
              },
            },
            type: true,
            difficulty: true,
            createdAt: true,
            updatedAt: true,
            knowledgePoints: {
              select: {
                id: true,
                name: true,
              },
            },
            bookmarks: {
              select: {
                id: true,
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

  bookmarkExercise: protectedProcedure.input(z.object({ exerciseId: z.string() })).mutation(async ({ ctx, input }) => {
    const { exerciseId } = input;

    try {
      await ctx.prisma.bookmark.create({
        data: {
          exerciseId,
          userId: ctx.session.user.id,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务器出现未知错误',
      });
    }
  }),

  removeBookmarkExercise: protectedProcedure
    .input(z.object({ exerciseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { exerciseId } = input;

      try {
        await ctx.prisma.bookmark.delete({
          where: {
            userId_exerciseId: {
              exerciseId,
              userId: ctx.session.user.id,
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

  getUserBookmarkList: protectedProcedure
    .input(
      z.object({
        keyword: z.string().nullish(),
        type: z
          .nativeEnum(ExerciseType, {
            invalid_type_error: '题目类型只能为填空、选择和大题',
          })
          .optional(),
        difficulty: z
          .nativeEnum(DifficultyType, {
            invalid_type_error: '题目难度只能为简单、中等和困难',
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { type = 'ALL_QUESTION', difficulty = 'ANY', keyword } = input;

      try {
        const result = await ctx.prisma.exercise.findMany({
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
          where: {
            bookmarks: {
              some: {
                userId: {
                  equals: ctx.session.user.id,
                },
              },
            },
            type: type !== 'ALL_QUESTION' ? type : undefined,
            difficulty: difficulty !== 'ANY' ? difficulty : undefined,
            OR: [
              {
                question: {
                  contains: keyword ? keyword : '',
                },
              },
              {
                answer: {
                  contains: keyword ? keyword : '',
                },
              },
            ],
          },
          orderBy: {
            createdAt: 'desc',
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

  addNewKnowledgePoint: protectedProcedure
    .input(
      z.object({
        knowledgePointId: z.string().nonempty('知识点id不得为空'),
        exerciseId: z.string().nonempty('习题id不得为空'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { knowledgePointId, exerciseId } = input;

      await ctx.prisma.exercise.update({
        where: {
          id: exerciseId,
        },
        data: {
          knowledgePoints: {
            connect: {
              id: knowledgePointId,
            },
          },
        },
      });
    }),
});
