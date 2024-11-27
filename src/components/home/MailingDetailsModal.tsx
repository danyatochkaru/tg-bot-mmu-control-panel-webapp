'use client'

import {Badge, Group, ScrollArea, Stack, Text} from "@mantine/core";
import {Mailing, MailingStatus} from "@prisma/client";
import useSWR from "swr";
import {useCallback} from "react";
import {MESSAGES_STATUS} from "@/types/swr-responses";
import ModalGroupsList from "@/components/home/ModalGroupsList";

type Props = {
    recipients: { groupOid: number, name: string }[],
    id: Mailing['id'],
    status: Mailing['status']
    failed: Mailing['failed'],
    total: Mailing['total']
}

const statusText = {
    [MailingStatus.PROCESSING]: 'В процессе',
    [MailingStatus.COMPLETED]: 'Завершено',
    [MailingStatus.CANCELLED]: 'Отменено',
}

export default function MailingDetailsModal({recipients, status, failed, total, id}: Props) {
    const {data, isLoading} = useSWR<MESSAGES_STATUS>(
            `/api/messages/status`,
            {refreshInterval: 5 * 1000}
    )

    const getTotal = useCallback(() => {
        return (data && id === data.args?.id && data.isRunning) ? data?.progress?.total : total
    }, [data?.isRunning, data?.progress?.total, total, isLoading, status])

    const getSuccess = useCallback(() => {
        return (data && id === data.args?.id && data?.isRunning) ? data?.progress?.current : (getTotal() - failed)
    }, [data?.isRunning, data?.progress?.current, failed, isLoading, status])

    return <ScrollArea.Autosize mah={600}>
        {isLoading
                ? <Text mb={'xs'}>Загрузка...</Text>
                : <Stack gap={2} mb={'xs'}>
                    <Text>Статус: <Badge
                            component={'span'}
                            color={status === 'COMPLETED'
                                    ? 'green' : status === 'CANCELLED'
                                            ? 'red' : 'brand'}
                    >{statusText[status]}</Badge></Text>
                    {getTotal() > 0 && <Text>Всего получателей: {getTotal()}</Text>}
                    {status === 'COMPLETED'
                            && getTotal() > 0
                            && <Group display={'inline-flex'} align={'center'} gap={'xs'}>
                                <Text>Успешных отправок: {getSuccess()}</Text>
                                <Badge autoContrast>{(getSuccess() / getTotal() * 100).toFixed(1)}%</Badge>
                            </Group>}
                </Stack>}

        <ModalGroupsList recipients={recipients} id={id}/>
    </ScrollArea.Autosize>
}