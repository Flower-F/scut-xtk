import { type GetServerSidePropsContext } from 'next';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type Role } from '@prisma/client';
import { verify } from 'argon2';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';

import { prisma } from '~/server/db';

const loginInputSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码长度需要大于8位'),
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      collegeId: string;
      name: string;
      image?: string | null;
      email: string;
      role: Role;
      verified: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    collegeId: string;
    image?: string | null;
    email: string;
    role: Role;
    verified: boolean;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    collegeId: string;
    name: string;
    image?: string | null;
    email: string;
    role: Role;
    verified: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.image = user.image;
        token.name = user.name;
        token.collegeId = user.collegeId;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = await loginInputSchema.parseAsync(credentials);

        if (email === '' || password === '') {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            return null;
          }

          const passwordCorrect = await verify(user.password, password);
          if (!passwordCorrect) {
            return null;
          }

          return {
            id: user.id,
            image: user.image,
            email: user.email,
            name: user.name,
            collegeId: user.collegeId,
            verified: user.verified,
            role: user.role,
          };
        } catch (e) {
          return null;
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
