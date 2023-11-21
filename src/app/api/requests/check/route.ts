import {NextResponse} from "next/server";
import db from "@/lib/db";


export async function GET(req: Request) {
    try {
        const url = new URL(req.url)

        if (!url.searchParams.has('token')) {
            return NextResponse.json({message: 'Отсутствует ключ'}, {status: 400})
        }

        const existingRequest = await db.profile.findFirst({
            where: {
                requestToken: url.searchParams.get('token')
            }
        })
        if (!existingRequest) {
            return NextResponse.json({message: 'Запрос не найден'}, {status: 404})
        }


        return NextResponse.json({message: 'Пароль успешно установлен'}, {status: 200})
    } catch (e: any | Error) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так'}, {status: 500})
    }
}