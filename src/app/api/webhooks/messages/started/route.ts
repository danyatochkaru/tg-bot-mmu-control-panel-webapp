import checkSession from "@/utils/checkSession";
import {NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        for (const [key, value] of Array.from(req.headers.entries())) {
            console.log(key, value)
        }

        const session = await checkSession()
        if (!session.data && req.headers.get('host') !== process.env.ALLOWED_WEBHOOK_HOST!) {
            return NextResponse.json(session.error, {status: session.status})
        }

        type Payload = { current: number, total: number, rejected: number }
        type Arguments = {
            id: string;
            groupList: number[];
            text: string;
            options?: {
                doLinkPreview?: boolean;
            };
        }

        const data: { args: Arguments, data: Payload } = await req.json()
            .then(data => {
                // console.log(data)
                return data
            }).catch(err => {
                console.error(err)
                return {current: 0, total: 0, rejected: 0}
            })


        await prisma.mailing.update({
            data: {
                progress: data.data.current,
                failed: data.data.rejected,
                total: data.data.total,
                status: 'PROCESSING',
                statusChangedAt: new Date()
            },
            where: {
                id: data.args.id
            }
        })

        return NextResponse.json({ok: 'ok'})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}