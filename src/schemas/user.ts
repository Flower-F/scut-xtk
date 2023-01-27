import { z } from 'zod';

export const registerInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, '姓名不能为空'),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      '密码长度至少为8，且至少含有一个字母和一个数字和一个特殊字符'
    ),
  password2: z.string(),
});

export type RegisterInput = z.TypeOf<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginInput = z.TypeOf<typeof loginInputSchema>;
