import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {NextResponse} from "next/server";
import db from "@/lib/db";
import * as z from 'zod'

const newMessageSchema = z.object({
    message: z.string(),
    recipients: z.number().array().nonempty(),
})

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({message: 'Недостаточно прав'}, {status: 401})
        }

        const url = new URL(req.url)


        const messages = await db.mailing.findMany({
            skip: url.searchParams.has('skip') ? parseInt(url.searchParams.get('skip')!) : 0,
            take: url.searchParams.has('take') ? parseInt(url.searchParams.get('take')!) : 12,
            include: {
                sender: {
                    select: {
                        email: true, id: true, tgId: true
                    }
                },
            },
        })
        const count = await db.mailing.count()

        return NextResponse.json({messages, count}, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({message: 'Недостаточно прав'}, {status: 401})
        }

        const body = await req.json()

        const {message, recipients} = newMessageSchema.parse(body)

        const initiator = await db.profile.findFirstOrThrow({where: {email: session.user!.email as string}})

        // TODO: сделать отправку запроса к боту

        const newMessage = await db.mailing.create({
            data: {
                message,
                recipients,
                senderId: initiator.id,
            }
        })

        return NextResponse.json({data: newMessage, message: 'Сообщение отправлено'}, {status: 201})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}