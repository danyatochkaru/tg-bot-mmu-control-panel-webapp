"use client"

import {Container, Paper, SimpleGrid, Stack, Text} from "@mantine/core";
import useSWR from "swr";
import {Mailing, Profile} from "@prisma/client";

//@ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function MessagesPage() {
    const {data, isLoading} = useSWR<{
        messages: (Mailing & { sender: Profile })[],
        count: number
    }>('/api/messages', fetcher)

    return <Container p={'md'}>
        <Stack>
            {isLoading
                    ? <Text>Загрузка...</Text>
                    : data?.messages?.length
                            ? data?.messages?.map((i) => (
                                    <SimpleGrid cols={3} key={i.id}>
                                        <Paper withBorder p={'xs'}><Text component={'pre'}>{i.message}</Text></Paper>
                                        <Text>{i.sender.email}</Text>
                                        <Text>{new Date(i.createdAt).toLocaleString('ru')}</Text>
                                    </SimpleGrid>
                            ))
                            : <Text>Сообщения отсутствуют</Text>
            }
        </Stack>
    </Container>
}