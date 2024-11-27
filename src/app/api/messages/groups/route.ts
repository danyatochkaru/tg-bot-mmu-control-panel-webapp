import {NextResponse} from "next/server";
import checkSession from "@/utils/checkSession";
import prisma from "@/lib/db";

export async function GET(req: Request) {
    try {
        const session = await checkSession()
        if (!session.data) {
            return NextResponse.json(session.error, {status: session.status})
        }

        const url = new URL(req.url)

        if (!url.searchParams.has('id')) {
            return NextResponse.json({message: 'Не был передан идентификатор'}, {status: 400})
        }

        const groups = await prisma.mailingGroups.findMany({
            where: {
                mailingId: url.searchParams.get('id')!
            }
        })

        return NextResponse.json({groups}, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}