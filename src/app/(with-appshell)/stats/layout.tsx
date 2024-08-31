import React from "react";
import {Container, Group, Stack, Text} from "@mantine/core";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";

export default async function StatsLayout(props: {
    children: React.ReactNode,
    newuserschart: React.ReactNode,
    totalinfo: React.ReactNode,
    sourceschart: React.ReactNode,
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    return <Container p={'md'}>
        <Stack gap={'lg'}>
            <Group justify={'space-between'}>
                <Group align={'baseline'} gap={'xs'}>
                    <Text fw={700} size={'lg'}>Статистика бота</Text>
                </Group>
            </Group>
            {props.totalinfo}
            {props.newuserschart}
            {props.sourceschart}
        </Stack>
    </Container>
}