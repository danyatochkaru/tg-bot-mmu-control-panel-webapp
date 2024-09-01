import {NextResponse} from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)

        if (!url.searchParams.has('token')) {
            return NextResponse.json({message: 'Отсутствует ключ'}, {status: 400})
        }


        const existingRequest = await db.invite.findFirst({where: {token: url.searchParams.get('token')!}})
        if (!existingRequest) {
            return NextResponse.json({message: 'Запрос не найден'}, {status: 404})
        }

        if (existingRequest.expiresAt < new Date()) {
            await db.invite.delete({where: {id: existingRequest.id}})
            return NextResponse.json({message: 'Запрос устарел'}, {status: 410})
        }


        return NextResponse.json({status: "OK"}, {status: 200})
    } catch (e: any | Error) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так'}, {status: 500})
    }
}