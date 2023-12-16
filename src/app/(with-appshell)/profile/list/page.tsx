import {Container, Table, TableData, TableScrollContainer} from "@mantine/core";
import db from "@/lib/db";
import {Role} from "@prisma/client";
import {PAGE_LINKS} from "@/constants/page-links";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {ProfileName} from "@/components/ProfileName";


const rolesName: Record<Role, string> = {
    ADMIN: 'Администратор',
    USER: 'Пользователь',
}

export default async function ProfilesListPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    if (session.user.role !== 'ADMIN') {
        const message = encodeURIComponent('Недостаточно прав')
        return redirect(PAGE_LINKS.HOME + `?message=${message}&messageColor=red`)
    }

    const profileList = await db.profile.findMany({
        include: {
            Mailing: true
        }
    })

    const tableData: TableData = {
        head: ['Почта', 'Роль', 'Кол-во рассылок'],
        body: profileList.map(profile => ([
            <ProfileName key={profile.email} id={profile.id} email={profile.email}
                         isMe={profile.id === session.user.sub}/>,
            rolesName[profile.Role],
            profile.Mailing.length
        ]))
    }

    return <Container p={'md'}>
        <TableScrollContainer minWidth={320}>
            <Table data={tableData}/>
        </TableScrollContainer>
    </Container>
}