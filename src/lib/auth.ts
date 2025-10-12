import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../lib/prisma';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<{ id: string; email: string | null; name?: string } | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales requeridas');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        const bcrypt = await import('bcryptjs');
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password as string
        );

        if (!isPasswordValid) {
          throw new Error('Contraseña incorrecta');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      if (user && typeof (user as { id?: unknown }).id === 'string') {
        (token as JWT & { id?: string }).id = (user as { id?: string }).id!;
      }
      return token as JWT;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as { id?: string }).id = (token as JWT & { id?: string }).id;
      }
      return session;
    },
  },
} as const;
