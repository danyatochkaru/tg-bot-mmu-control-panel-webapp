'use client'

import {Badge, Group, ScrollArea, SimpleGrid, Stack, Text} from "@mantine/core";
import Title from "@/components/Title";
import {Mailing, MailingStatus} from "@prisma/client";
import useSWR from "swr";
import {useCallback} from "react";
import {MESSAGES_STATUS} from "@/types/swr-responses";

type Props = {
    recipients: { groupOid: number, name: string }[],
    id: Mailing['id'],
    status: Mailing['status']
    progress: Mailing['progress'],
    total: Mailing['total'],
}

const statusText = {
    [MailingStatus.PROCESSING]: 'В процессе',
    [MailingStatus.COMPLETED]: 'Завершено',
    [MailingStatus.CANCELLED]: 'Отменено',
}

export default function MailingDetailsModal({recipients, status, progress, total, id}: Props) {
    const {data, isLoading} = useSWR<MESSAGES_STATUS>(
            `/api/messages/status`,
            {refreshInterval: 5 * 1000}
    )

    const getTotal = useCallback(() => {
        return (data && id === data.args?.id && data.isRunning) ? data?.progress.total : total
    }, [data?.isRunning, data?.progress.total, total, isLoading, status])

    const getSuccess = useCallback(() => {
        return (data && id === data.args?.id && data.isRunning) ? data?.progress.current : progress
    }, [data?.isRunning, data?.progress.current, progress, isLoading, status])

    return <ScrollArea.Autosize mah={400}>
        {isLoading
                ? <Text mb={'xs'}>Загрузка...</Text>
                : <Stack gap={2} mb={'xs'}>
                    <Text>Статус: <Badge
                            color={status === 'COMPLETED'
                                    ? 'green' : status === 'CANCELLED'
                                            ? 'red' : 'brand'}
                    >{statusText[status]}</Badge></Text>
                    <Text>Всего получателей: {getTotal()}</Text>
                    <Group display={'inline-flex'} align={'center'} gap={'xs'}>
                        <Text>Успешных отправок: {getSuccess()}</Text>
                        {getTotal() > 0 && <Badge autoContrast>{(getSuccess() / getTotal() * 100).toFixed(1)}%</Badge>}
                    </Group>
                </Stack>}
        <Title title={"Список групп"} subtitle={`всего: ${recipients.length}`} mb={'xs'}/>
        <SimpleGrid cols={{base: 3, xs: 4}} spacing={'xs'}>
            {
                recipients.map(item => (
                        <Badge key={item.groupOid}
                               variant={'outline'}>{item.name}</Badge>)
                )
            }
        </SimpleGrid>
    </ScrollArea.Autosize>
}