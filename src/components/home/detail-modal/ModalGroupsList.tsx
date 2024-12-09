'use client'

import {Stack} from "@mantine/core";
import {MailingGroups} from "@prisma/client";
import Title from "@/components/Title";
import {useEffect, useState} from "react";
import {useGroupsStore} from "@/store/groups";
import GroupsListTable from "@/components/home/detail-modal/GroupsListTable";

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

    return <Stack gap={'xs'}>
        <Title title={"Список групп"} subtitle={`всего: ${groupsList.length || recipients.length}`}/>
        <GroupsListTable data={
            groupsList.length
                    ? groupsList.map(g => ({
                        id: g.groupId,
                        name: groups.find(i => i.groupOid === +g.groupId)?.name || 'Нет данных',
                        recipients: g.recipients
                    }))
                    : recipients.map((r, index) => ({
                        id: String(index),
                        name: r.name,
                        recipients: 'Нет данных'
                    }))
        }/>
    </Stack>
}