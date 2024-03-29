import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';
import { z } from 'zod';
import { env } from '~/env.mjs';

import { adminProcedure, createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('邮箱格式不正确'),
        name: z.string().nonempty('姓名不能为空'),
        collegeId: z.string().optional(),
        password: z.string().min(8, '密码长度最少为8位'),
        password2: z.string().min(8, '确认密码长度最少为8位'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, password2, name, collegeId } = input;

      if (password !== password2) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '两次输入的密码不一致',
        });
      }

      try {
        const passwordHash = await hash(password);

        await ctx.prisma.user.create({
          data: {
            email,
            name,
            role: password === env.ADMIN_PASSWORD && email === env.ADMIN_EMAIL ? Role.ADMIN : Role.USER,
            password: passwordHash,
            verified: password === env.ADMIN_PASSWORD && email === env.ADMIN_EMAIL ? true : false,
            college: {
              connect: {
                id: collegeId,
              },
            },
          },
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: '该邮箱已注册',
            });
          }
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '服务器出现未知错误',
        });
      }
    }),

  getUserList: adminProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.user.findMany({
      select: {
        id: true,
        verified: true,
        role: true,
        name: true,
        email: true,
        college: {
          select: {
            name: true,
          },
        },
      },
      where: {
        NOT: {
          id: ctx.session.user.id,
        },
      },
    });

    return result;
  }),

  verifyUser: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id } = input;

    try {
      await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          verified: true,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务器出现未知错误',
      });
    }
  }),

  banUser: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id } = input;

    try {
      await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          verified: false,
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
