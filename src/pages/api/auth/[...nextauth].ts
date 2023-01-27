import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { prisma } from '../../../server/db';
import { loginSchema } from '../../../schemas/user';

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (token) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        session.user = token.user as any;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = await loginSchema.parseAsync(credentials);

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

          const passwordCorrect = await compare(password, user.password);
          if (!passwordCorrect) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            verified: user.verified,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
};

export default NextAuth(authOptions);
