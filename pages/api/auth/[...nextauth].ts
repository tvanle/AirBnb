import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Nếu có access_token từ provider, dùng luôn
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      // Nếu có user (login credentials), tạo accessToken
      if (user) {
        token.id = user.id;
        if (!token.accessToken) {
          token.accessToken = jwt.sign(
            {
              id: user.id,
              email: user.email,
              role: (user as any).role || "USER"
            },
            process.env.NEXTAUTH_SECRET!,
            { expiresIn: "7d" }
          );
        }
      }
      // Nếu vẫn chưa có accessToken (social login, refresh, ...), tạo từ token có sẵn
      if (!token.accessToken) {
        token.accessToken = jwt.sign(
          {
            id: token.id || token.sub,
            email: token.email,
            role: (token as any).role || "USER"
          },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "7d" }
        );
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      if ((session as any).user) {
        (session as any).user.id = token.id;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
