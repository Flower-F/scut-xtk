import { zodResolver } from '@hookform/resolvers/zod';
import md5 from 'md5';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.string().email('请输入正确的邮箱格式'),
  password: z.string().min(8, '密码长度最少为8位'),
});

type LoginInput = z.TypeOf<typeof loginInputSchema>;

export default function LoginPage() {
  const { handleSubmit, register } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
  });

  async function onSubmit(input: LoginInput) {
    await signIn('credentials', {
      ...input,
      password: md5(input.password),
      callbackUrl: '/',
    });
  }

  return <div>LoginPage</div>;
}
