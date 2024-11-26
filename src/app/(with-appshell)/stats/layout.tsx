import React from "react";
import {Container, Group, SimpleGrid, Stack} from "@mantine/core";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import Title from "@/components/Title";

export const revalidate = 90

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
                    <Title title={'Статистика бота'}/>
                </Group>
            </Group>
            <SimpleGrid cols={{base: 1, sm: 2}} spacing={'xs'}>
                {props.totalinfo}
                {props.sourceschart}
            </SimpleGrid>
            {props.newuserschart}
        </Stack>
    </Container>
}