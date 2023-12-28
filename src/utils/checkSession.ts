import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import db from "@/lib/db";

export default async function checkSession(onlyAdmin?: boolean) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return {error: 'Недостаточно прав', status: 401}
    }

    if (onlyAdmin) {
        const initiator = await db.profile.findUnique({where: {id: session.user.sub}})

        if (!initiator || initiator.Role !== 'ADMIN') {
            return {error: 'Недостаточно прав', status: 403}
        }
    }

    return {data: session}
}