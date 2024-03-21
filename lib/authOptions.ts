import {PrismaAdapter} from "@next-auth/prisma-adapter"
import type {NextAuthOptions} from "next-auth"
import prisma from "@/lib/prisma";
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'example@gmail.com',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Password',
                },
            },
            async authorize(credentials) {
                const {email, password} = credentials!;
                const user = await prisma.user.findFirst({
                    where: {
                        email,
                    },
                });
                if (user && password === user.password) {
                    return user;
                }
                throw new Error("账号或密码错误")
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({token, account, user, trigger, session}) {
            const profile = await prisma.user.findUnique({where: {id: token.sub!}})
            return {
                ...token,
                userId: token.sub,
                username: profile!.username,
                email: profile!.email,
                role: profile!.role,
            };
        },
        async session({session, token, trigger}) {
            return {
                ...session,
                user: {
                    userId: token.sub,
                    username: token.username,
                    email: token.email,
                    role: token.role,
                },
            };
        }
    }
}

