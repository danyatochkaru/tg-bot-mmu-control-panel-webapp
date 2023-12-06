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

        if (!session || !session.user) {
            return NextResponse.json({message: 'Недостаточно прав'}, {status: 401})
        }

        const initiator = await db.profile.findUnique({where: {id: session.user.sub}})

        if (!initiator || initiator.Role !== 'ADMIN') {
            return NextResponse.json({message: 'Недостаточно прав'}, {status: 403})
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
            html: render(EmailInvite(token))
        })

        const now = new Date()
        await db.invite.create({
            data: {
                email, token, expiresAt: new Date(now.setDate(now.getDate() + 7)), initiatorId: initiator.id
            }
        })

        return NextResponse.json({message: 'Запрос отправлен'}, {status: 201})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}