import {NextResponse} from "next/server";
import * as z from "zod";
import checkSession from "@/utils/checkSession";
import db from "@/lib/db";

const searchUserSchema = z.object({
    email: z.string().email().optional(),
})

export async function GET(req: Request) {
    try {
        const session = await checkSession(true)
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }

        const url = new URL(req.url)
        const email = url.searchParams.get('q')

        if (!email) {
            return NextResponse.json({message: 'Не была передана строка поиска'}, {status: 400})
        }

        const users = await db.profile.findMany({
            where: {
                email: {
                    contains: email
                }
            }
        })

        return NextResponse.json({data: users}, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}