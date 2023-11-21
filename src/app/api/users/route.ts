import {NextResponse} from "next/server";
import * as z from 'zod'
import {sendEmail} from "@/lib/email";
import {render} from "@react-email/render";
import EmailInvite from "../../../../emails/EmailInvite";
import {hashPassword} from "@/utils/hashPassword";
import db from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

const newUserSchema = z.object({
    email: z.string().email(),
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({message: 'Недостаточно прав'}, {status: 401})
        }

        const body = await req.json()

        const {email} = newUserSchema.parse(body)

        const existingProfile = await db.profile.findFirst({
            where: {
                email
            }
        })
        if (existingProfile) {
            return NextResponse.json({message: 'Приглашение уже отправлено или профиль уже существует'}, {status: 400})
        }

        const token = hashPassword(email, process.env.HASH_SALT!)

        await sendEmail({
            to: email,
            subject: 'Вас пригласили в систему отправки рассылки бота ММУ',
            html: render(EmailInvite(token))
        })

        await db.profile.create({
            data: {
                email, requestToken: token
            }
        })

        return NextResponse.json({message: 'Запрос отправлен'}, {status: 201})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}