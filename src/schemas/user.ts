import { z } from 'zod';

export const registerInputSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  name: z.string().min(1, '姓名不能为空'),
  password: z.string().min(8, '密码长度最少为8位'),
  password2: z.string().min(8, '确认密码长度最少为8位'),
});

export type RegisterInput = z.TypeOf<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码长度最少为8位'),
});

export type LoginInput = z.TypeOf<typeof loginInputSchema>;
