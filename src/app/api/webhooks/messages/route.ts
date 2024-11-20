import checkSession from "@/utils/checkSession";
import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import {MailingStatus} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const session = await checkSession()
        if (!session.data && !req.headers.get('host')?.startsWith('192.168')) {
            return NextResponse.json(session.error, {status: session.status})
        }

        await prisma.mailing.updateMany({
            data: {
                status: MailingStatus.COMPLETED
            },
            where: {
                status: MailingStatus.PROCESSING
            }
        })

        return NextResponse.json({ok: 'ok'})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}
