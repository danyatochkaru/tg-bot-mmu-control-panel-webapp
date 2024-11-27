'use client'

import {Badge, SimpleGrid, Stack} from "@mantine/core";
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

    return <Stack gap={'xs'}>
        <Title title={"Список групп"} subtitle={`всего: ${groupsList.length || recipients.length}`}/>
        <SimpleGrid cols={{base: 3, xs: 4}} spacing={'xs'}>
            {
                groupsList.length
                        ? groupsList.map(item => (
                                <Badge key={item.id}
                                       variant={'outline'}>{groups.find(i => i.groupOid === +item.groupId)?.name} ({item.recipients})</Badge>
                        ))
                        : recipients.map(item => (
                                <Badge key={item.groupOid}
                                       variant={'outline'}>{item.name}</Badge>)
                        )
            }
        </SimpleGrid>
    </Stack>
}