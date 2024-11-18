import checkSession from "@/utils/checkSession";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        for (const [key, value] of Array.from(req.headers.entries())) {
            console.log(key, value)
        }

        const session = await checkSession()
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }

        return NextResponse.json({ok: 'ok'})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}
