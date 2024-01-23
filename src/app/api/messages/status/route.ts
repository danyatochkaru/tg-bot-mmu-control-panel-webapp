import {NextResponse} from "next/server";
import checkSession from "@/utils/checkSession";

export async function GET() {
    try {
        const session = await checkSession()
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }

        const res = await fetch(`${process.env.BOT_API_HOST}/notifications/status`, {
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