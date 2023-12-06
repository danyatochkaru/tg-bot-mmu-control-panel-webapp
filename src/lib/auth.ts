import {NextAuthOptions} from "next-auth";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import db from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import {comparePassword} from "@/utils/hashPassword";
import {PAGES_LINK} from "@/constants/PAGES_LINK";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 2 * 60 * 60 /* 2 часа */,
    },
    pages: {
        signIn: PAGES_LINK.LOGIN
    },
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const existingProfile = await db.profile.findFirst({
                    where: {
                        email: credentials.email
                    },
                })
                if (!existingProfile || !existingProfile.password) {
                    return null
                }

                if (existingProfile.banned) {
                    return {
                        error: 'Ваш аккаунт заблокирован',
                        id: existingProfile.id,
                        email: existingProfile.email,
                        role: existingProfile.Role,
                    }
                }

                const passwordMatch = comparePassword(existingProfile.password, credentials.password, process.env.HASH_SALT!)

                if (!passwordMatch) {
                    return null
                }

                return {
                    id: existingProfile.id,
                    email: existingProfile.email,
                    role: existingProfile.Role,
                }
            }
        })
    ],
    callbacks: {
        signIn({user}) {
            if (user?.error) {
                throw new Error(user.error)
            }

            return true
        },
        jwt({token, user, trigger, session}) {
            if (trigger === 'update') {
                return {...token, ...session.user}
            }
            return {...token, ...user}
        },
        async session({session, token}) {
            return {...session, user: token}
        }
    }
}