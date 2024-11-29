import checkSession from "@/utils/checkSession";
import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import {Prisma} from "@prisma/client";
import MailingGroupsCreateManyInput = Prisma.MailingGroupsCreateManyInput;

export async function POST(req: Request) {
    try {
        const session = await checkSession()
        if (!session.data && req.headers.get('host') !== process.env.ALLOWED_WEBHOOK_HOST!) {
            for (const [key, value] of Array.from(req.headers.entries())) {
                console.log(key, value)
            }
            return NextResponse.json(session.error, {status: session.status})
        }

        type Payload = {
            allOk: boolean;
            rejected: {
                response: any;
                chat_id: number;
            }[];
            totalUsers: number;
            studentsCountByGroup: Record<string, number>;
        };
        type Arguments = {
            id: string;
            groupList: number[];
            text: string;
            options?: {
                doLinkPreview?: boolean;
            };
        }

        const body: { args: Arguments, data: Payload } = await req.json()
            .then(data => {
                // console.log(data)
                return data
            }).catch(err => {
                console.error(err)
                return {
                    args: {id: '', text: '', groupList: [], options: {}},
                    data: {studentsCountByGroup: {}, rejected: [], totalUsers: 0, allOk: false}
                }
            })

        await prisma.mailing.update({
            data: {
                failed: body.data.rejected?.length || 0,
                status: 'COMPLETED',
                statusChangedAt: new Date()
            },
            where: {
                id: body.args.id
            }
        })

        const createManyMailingGroupsData: MailingGroupsCreateManyInput[] = []

        new Map(Object.entries(body.data.studentsCountByGroup))
            .forEach((recipients, groupId) => {
                createManyMailingGroupsData.push({recipients, groupId, mailingId: body.args.id})
            })

        await prisma.mailingGroups.createMany({
            data: createManyMailingGroupsData,
        })

        return NextResponse.json({ok: 'ok'})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: 'Что-то пошло не так...'}, {status: 500})
    }
}