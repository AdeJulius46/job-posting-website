import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@/app/generated/prisma/client"


const prisma = new PrismaClient()
export const { auth, handlers, signIn, signOut } = NextAuth({
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    },
    adapter: PrismaAdapter(prisma),
    providers: [GitHub,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string | undefined
                const password = credentials?.password as string | undefined

                if (!email || !password) return null

                const user = await prisma.user.findUnique({ where: { email } })
                if (!user || !user.password) return null

                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) return null

                return user
            },
        }),


    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string
            }
            return session;
        }
    }


})