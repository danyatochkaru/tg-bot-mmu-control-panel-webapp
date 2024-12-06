'use client'

import {Stack, Table, TableData} from "@mantine/core";
import {MailingGroups} from "@prisma/client";
import Title from "@/components/Title";
import {useEffect, useState} from "react";
import {useGroupsStore} from "@/store/groups";

type Props = { recipients: { groupOid: number, name: string }[], id: MailingGroups['mailingId'] }

export default function ModalGroupsList({recipients, id}: Props) {
    const [groupsList, setGroupsList] = useState<MailingGroups[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const groups = useGroupsStore(state => state.groups)

    useEffect(() => {
        if (!groupsList.length) {
            setLoading(true)
            fetch(`/api/messages/groups?id=${id}`)
                    .then(res => res.json())
                    .then(data => setGroupsList(data.groups))
                    .catch(err => setError(new Error(err)))
                    .finally(() => setLoading(false))
        }
    }, [])

    if (loading) {
        return <div>Загрузка...</div>
    }

    if (error) {
        return <div>Ошибка при загрузке: {error.message}</div>
    }

    const tableData: TableData = {
        head: ['Группа', 'Кол-во получателей'],
        body: (groupsList.length
                        ? groupsList.map(i => [groups.find(g => g.groupOid === +i.groupId)?.name || '', i.recipients])
                        : recipients.map(item => [item.name, 'Нет данных'])
        ).toSorted((a, b) => (a[0] as string).localeCompare(b[0] as string))
    }

    return <Stack gap={'xs'}>
        <Title title={"Список групп"} subtitle={`всего: ${groupsList.length || recipients.length}`}/>
        <Table
                stickyHeader stickyHeaderOffset={-2}
                data={tableData}
        />
    </Stack>
}