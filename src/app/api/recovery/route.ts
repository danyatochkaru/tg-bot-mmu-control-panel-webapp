import * as z from "zod";
import {ZodError} from "zod";
import {NextResponse} from "next/server";
import db from "@/lib/db";
import {hashPassword} from "@/utils/hashPassword";
import {sendEmail} from "@/lib/email";
import {render} from "@react-email/render";
import EmailRecovery from "../../../../emails/EmailRecovery";

const recoveryPostSchema = z.object({
    email: z.string().email()
})

const recoveryPatchSchema = z.object({
    token: z.string(),
    password: z.string().min(5)
})

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)

        if (!url.searchParams.has('token')) {
            return NextResponse.json({message: 'Отсутствует ключ'}, {status: 400})
        }


        const existingRecovery = await db.recovery.findFirst({
            where: {token: url.searchParams.get('token')!},
            select: {id: true, expiresAt: true, profile: true}
        })
        if (!existingRecovery) {
            return NextResponse.json({message: 'Запрос не найден'}, {status: 404})
        }

        if (existingRecovery.expiresAt < new Date()) {
            await db.recovery.delete({where: {id: existingRecovery.id}})
            return NextResponse.json({message: 'Запрос устарел'}, {status: 410})
        }


        return NextResponse.json({status: 'OK', email: existingRecovery.profile.email}, {status: 200})
    } catch (e) {
        if (e instanceof ZodError) {
            const message = e.errors.map(e => e.message).join(', ')
            return NextResponse.json({message}, {status: 400})
        }
        return NextResponse.json({message: 'Что-то пошло не так', errors: (e as ZodError)?.errors}, {status: 500})
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {email} = recoveryPostSchema.parse(body)

        const existingProfile = await db.profile.findFirst({
            where: {email}
        })
        if (!existingProfile) {
            return NextResponse.json({message: 'Пользователь не найден'}, {status: 404})
        }

        const token = hashPassword(`${email}-${Date.now()}-recovery`, process.env.HASH_SALT!)

        await sendEmail({
            to: email,
            subject: 'Восстановление пароля в системе отправки рассылки бота ММУ',
            html: render(EmailRecovery(token))
        })

        const now = new Date()
        await db.recovery.create({
            data: {
                profileId: existingProfile.id,
                token,
                expiresAt: new Date(now.setDate(now.getDate() + 1)),
            }
        })

        return NextResponse.json({message: 'Запрос отправлен'}, {status: 201})
    } catch (e) {
        if (e instanceof ZodError) {
            const message = e.errors.map(e => e.message).join(', ')
            return NextResponse.json({message}, {status: 400})
        }
        return NextResponse.json({message: 'Что-то пошло не так', errors: (e as ZodError)?.errors}, {status: 500})
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const {token, password} = recoveryPatchSchema.parse(body)

        const existingRecovery = await db.recovery.findFirst({
            where: {token},
            select: {id: true, expiresAt: true, profile: true}
        })
        if (!existingRecovery) {
            return NextResponse.json({message: 'Запрос не найден'}, {status: 404})
        }

        if (existingRecovery.expiresAt < new Date()) {
            await db.recovery.delete({where: {id: existingRecovery.id}})
            return NextResponse.json({message: 'Запрос устарел'}, {status: 410})
        }

        const hashedPassword = hashPassword(password, process.env.HASH_SALT!)
        await db.profile.update({
            where: {id: existingRecovery.profile.id},
            data: {
                password: hashedPassword
            }
        })
        
        await db.recovery.delete({where: {id: existingRecovery.id}})
        return NextResponse.json({message: 'Пароль успешно изменен'}, {status: 200})
    } catch (e) {
        if (e instanceof ZodError) {
            const message = e.errors.map(e => e.message).join(', ')
            return NextResponse.json({message}, {status: 400})
        }
        return NextResponse.json({message: 'Что-то пошло не так', errors: (e as ZodError)?.errors}, {status: 500})
    }
}