"use client"

import {Group, Pagination, Paper, SegmentedControl, Stack, Text} from "@mantine/core";
import {formatRelative} from "date-fns";
import ruLocale from "date-fns/locale/ru";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {Mailing, Profile} from "@prisma/client";
import {useSession} from "next-auth/react";
import {ProfileName} from "@/components/ProfileName";

export function MessagesListModule() {
    const {data: session} = useSession({required: true})
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
    const [activePage, setActivePage] = useState<number>(1)
    const itemsPerPage = 12;

    const {data, isLoading, error} = useSWR<{
        messages: (Mailing & { sender: Profile })[],
        count: number
    }>(`/api/messages?orderDir=${sortDir}&take=${itemsPerPage}&skip=${((activePage - 1) * itemsPerPage)}`)

    useEffect(() => {
        if (error) console.error(error)
    }, [error])

    return <Stack>
        <Group justify={'space-between'}>
            <Group align={'baseline'} gap={'xs'}>
                <Text fw={700} size={'lg'}>История рассылок</Text>
                {data?.count && <Text size={'sm'}>всего: {data.count}</Text>}
            </Group>
            <SegmentedControl
                    disabled={isLoading}
                    value={sortDir}
                    onChange={v => setSortDir(v as 'asc' | 'desc')}
                    data={[
                        {label: 'Сначала старые', value: 'asc'},
                        {label: 'Сначала новые', value: 'desc'},
                    ]}
            />
        </Group>
        {isLoading
                ? <Text>Загрузка...</Text>
                : data?.messages?.length
                        ? data?.messages?.map((i) => (
                                <Stack key={i.id} gap={4}>
                                    <Paper withBorder p={'xs'}>
                                        <Text component={'pre'}>{i.message}</Text>
                                    </Paper>
                                    <Group justify={'space-between'} gap={'xs'}>
                                        <ProfileName id={i.sender.id} email={i.sender.email}
                                                     isMe={i.sender.id === session?.user.sub}
                                                     isBanned={!!i.sender.banned}
                                                     size={'sm'}
                                                     short
                                        />
                                        <Text size={'sm'}
                                              title={new Date(i.createdAt).toLocaleString('ru', {})}
                                        >{
                                            formatRelative(new Date(i.createdAt), new Date(), {
                                                locale: ruLocale,
                                            })
                                        }</Text>
                                    </Group>
                                </Stack>
                        ))
                        : error ? <Text>Произошла ошибка. Попробуйте перезагрузить страницу или повторите запрос
                            позже</Text> : <Text>Сообщения отсутствуют</Text>
        }
        <Pagination total={Math.ceil((data?.count ?? 0) / itemsPerPage)} value={activePage}
                    onChange={setActivePage}/>
    </Stack>
}