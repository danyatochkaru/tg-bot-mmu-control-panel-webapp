import {NextResponse} from "next/server";
import * as z from 'zod'
import {ZodError} from 'zod'
import db from "@/lib/db";
import {hashPassword} from "@/utils/hashPassword";

const confirmSchema = z.object({
    token: z.string(),
    password: z.string()
        .min(5, 'Пароль должент состоять минимум из 5 символов')
        .max(32, 'Пароль может состоять максимум из 32 символов')
})

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const {token, password} = confirmSchema.parse(body)

        const existingRequest = await db.invite.findFirst({where: {token}})
        if (!existingRequest) {
            return NextResponse.json({message: 'Запрос не найден'}, {status: 404})
        }

        if (existingRequest.expiresAt < new Date()) {
            return NextResponse.json({message: 'Запрос устарел'}, {status: 410})
        }

        const hashedPassword = hashPassword(password, process.env.HASH_SALT!)
        const newProfile = await db.profile.create({
            data: {
                email: existingRequest.email,
                password: hashedPassword,

            }
        })
        await db.invite.update({
            data: {expiresAt: new Date()},
            where: {token},
        })

        const {password: _, ...profile} = newProfile

        return NextResponse.json({profile, message: 'Пароль успешно установлен'}, {status: 200})
    } catch (e: any | Error | ZodError) {
        if (e instanceof ZodError) {
            const message = e.errors.map(e => e.message).join(', ')
            return NextResponse.json({message}, {status: 400})
        }
        return NextResponse.json({message: 'Что-то пошло не так', errors: (e as ZodError)?.errors}, {status: 500})
    }
}