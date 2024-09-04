import {NextResponse} from "next/server";
import * as z from 'zod'
import {sendEmail} from "@/lib/email";
import {render} from "@react-email/render";
import EmailInvite from "../../../../emails/EmailInvite";
import {hashPassword} from "@/utils/hashPassword";
import db from "@/lib/db";
import checkSession from "@/utils/checkSession";

const newUserSchema = z.object({
    email: z.string().email(),
})

export async function POST(req: Request) {
    try {
        const session = await checkSession(true)
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status!})
        }

        const body = await req.json()

        const {email} = newUserSchema.parse(body)

        const [existingProfile, existingInvite] = await Promise.all([
            db.profile.findFirst({where: {email}}),
            db.invite.findFirst({where: {email}})
        ])

        if (existingProfile) {
            return NextResponse.json({message: 'Пользователь уже зарегистирован'}, {status: 400})
        }
        if (existingInvite) {
            return NextResponse.json({message: 'Приглашение уже отправлено'}, {status: 400})
        }

        const token = hashPassword(email, process.env.HASH_SALT!)

        await sendEmail({
            to: email,
            subject: 'Вас пригласили в систему отправки рассылки бота ММУ',
            html: await render(EmailInvite(token))
        })

        const now = new Date()
        await db.invite.create({
            data: {
                email,
                token,
                expiresAt: new Date(now.setDate(now.getDate() + 7)),
                initiatorId: session.data.user.id,
            }
        })

        return NextResponse.json({message: 'Запрос отправлен'}, {status: 201})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}