//@ts-ignore
import NextAuth from 'next-auth'
import {Role} from "@prisma/client";

declare module "next-auth" {
    interface User {
        role: Role,
        error?: string
    }

    interface Session {
        user: User & {
            sub: string,
            role: Role,
        }
        token: {
            sub: string,
            role: Role,
        }
    }
}