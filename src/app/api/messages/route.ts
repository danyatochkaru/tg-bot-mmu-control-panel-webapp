import {NextResponse} from "next/server";
import db from "@/lib/db";
import * as z from 'zod'
import {Mailing, Prisma} from "@prisma/client";
import dayjs from "dayjs";
import checkSession from "@/utils/checkSession";
import MailingWhereInput = Prisma.MailingWhereInput;

const newMessageSchema = z.object({
    message: z.string(),
    recipients: z.number().array().nonempty(),
})

export async function GET(req: Request) {
    try {
        const session = await checkSession()
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }

        const url = new URL(req.url)

        const orderBy: keyof Mailing = url.searchParams.has('orderBy') ? url.searchParams.get('orderBy') as keyof Mailing : 'createdAt'
        const orderDir: 'asc' | 'desc' = url.searchParams.has('orderDir') ? url.searchParams.get('orderDir') as 'asc' | 'desc' : 'desc'

        if (orderDir !== 'asc' && orderDir !== 'desc') {
            return NextResponse.json({message: 'Неверные данные'}, {status: 400})
        }

        const where: MailingWhereInput = {}

        if (url.searchParams.has('date')) {
            const [start, end] = url.searchParams.getAll('date')?.toSorted()

            if (!start || !end) {
                return NextResponse.json({message: 'Неверные данные'}, {status: 400})
            }

            if (!where.AND) where.AND = []
            where.AND = [
                ...where.AND as MailingWhereInput[],
                {
                    createdAt: {
                        gte: dayjs(start).startOf('day').toDate()
                    },
                }, {
                    createdAt: {
                        lte: dayjs(end).endOf('day').toDate()
                    }
                }
            ]
        }


        const messages = await db.mailing.findMany({
            where,
            skip: url.searchParams.has('skip') ? parseInt(url.searchParams.get('skip')!) : 0,
            take: url.searchParams.has('take') ? parseInt(url.searchParams.get('take')!) : 12,
            orderBy: {
                [orderBy]: orderDir,
            },
            include: {
                sender: {
                    select: {
                        email: true, id: true, tgId: true
                    }
                },
            },
        })
        const count = await db.mailing.count({where})

        return NextResponse.json({messages, count}, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}

export async function POST(req: Request) {
    try {
        const session = await checkSession()
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }

        const body = await req.json()

        const {message, recipients} = newMessageSchema.parse(body)

        const initiator = await db.profile.findFirstOrThrow({where: {email: session.data.user!.email as string}})

        const res = await fetch(`${process.env.BOT_API_HOST}/notifications`, {
            method: 'POST',
            body: JSON.stringify({
                groups: recipients,
                text: message,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
            }
        }).catch(err => {
            console.error(err)
            return err
        })

        if (!res?.ok) {
            console.log(res)
            console.log(await res.json())
            return NextResponse.json({message: 'Что-то пошло не так...'}, {status: res?.status || 500})
        }

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