import {NextResponse} from "next/server";
import checkSession from "@/utils/checkSession";

export async function GET(req: Request) {
    try {
        const session = await checkSession()
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }


        const url = new URL(req.url)


        if (!url.searchParams.has('groups') || url.searchParams.get('groups')?.split(',').length === 0) {
            return NextResponse.json({message: 'Неверные данные'}, {status: 400})
        }

        const groupList: string[] = url.searchParams.get('groups')?.split(',') ?? []
        const sp = new URLSearchParams()
        for (const groupId of groupList) {
            sp.append('groupsList', groupId)
        }

        const res = await fetch(`${process.env.BOT_API_HOST}/users/count?${sp.toString()}`, {
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