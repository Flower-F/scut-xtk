import { z } from 'zod';

export const registerInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(0, '名字不能为空'),
  password: z.string(),
  password2: z.string(),
});

export type RegisterInput = z.TypeOf<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginInput = z.TypeOf<typeof loginInputSchema>;
