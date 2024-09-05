import checkSession from "@/utils/checkSession";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const session = await checkSession()
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }

        const res = await fetch(`${process.env.BOT_API_HOST}/faq?lang=ru`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
            }
        })


        if (!res?.ok) {
            console.error(res)
            return NextResponse.json({message: 'Что-то пошло не так...'}, {status: res?.status || 500})
        }

        const data = await res.json()

        return NextResponse.json(data, {status: 200})
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

        const res = await fetch(`${process.env.BOT_API_HOST}/faq`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
            },
            method: 'POST',
            body: JSON.stringify({
                value: body.value,
                lang: 'ru',
            })
        })


        if (!res?.ok) {
            console.error(res)
            return NextResponse.json({message: 'Что-то пошло не так...'}, {status: res?.status || 500})
        }


        const data = res.headers.get('content-length') == '0' ? {message: 'removed'} : await res.json()

        return NextResponse.json({message: 'Текст FAQ сохранён', data}, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}