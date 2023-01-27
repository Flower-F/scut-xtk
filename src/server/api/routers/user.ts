import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { TRPCError } from '@trpc/server';
import { hash } from 'bcryptjs';
import { registerInputSchema } from '../../../schemas/user';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  register: publicProcedure.input(registerInputSchema).mutation(async ({ ctx, input }) => {
    const { email, password, password2, name } = input;

    if (password !== password2) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'The passwords entered are inconsistent',
      });
    }

    try {
      const passwordHash = await hash(password, 12);
      await ctx.prisma.user.create({
        data: {
          email,
          name,
          password: passwordHash,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '用户已存在',
          });
        }
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务器出现未知错误',
      });
    }
  }),
});
