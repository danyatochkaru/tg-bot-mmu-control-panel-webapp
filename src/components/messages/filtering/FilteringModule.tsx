"use client"

import {AppShell, Button, Container, Divider, Flex, Group, Text} from "@mantine/core";
import {FilteringPanel, FilteringResultList} from "./";
import IGroup from '@/types/group'
import {useFilteringManager} from "@/hooks/useFilteringManager";
import endingByNum from "@/utils/endingByNum";
import {useRouter} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import {useEffect, useState} from "react";
import LoadingNewMessage from "@/app/(with-appshell)/messages/new/loading";

export function FilteringModule(props: { groups: IGroup[] }) {
    const {groups, clear} = useFilteringManager(props.groups)
    const router = useRouter()

    const [init, setInit] = useState(false)

    useEffect(() => {
        setInit(true)
    }, []);

    if (!init) {
        return <LoadingNewMessage/>
    }

    return <>
        <Container p={'md'}>
            <FilteringPanel/>
            <Divider my="sm" label={'Группы'}/>
            <FilteringResultList/>
        </Container>
        <AppShell.Footer bg={'gray.0'}>
            <Container>
                <Flex h={50} justify={'space-between'} align={'center'}>
                    <Group align={'center'}>
                        <Text size={'sm'}>Выбрано {groups.length} {endingByNum(groups.length, ['группа', 'группы', 'групп'])}</Text>
                        <Button variant={'outline'} color={'red'} size={'compact-sm'}
                                onClick={() => clear()}
                                disabled={!groups.length}
                        >Очистить</Button>
                    </Group>
                    <Button disabled={!groups.length}
                            onClick={() => router.push(PAGE_LINKS.NEW_MESSAGE_PRINTING)}
                    >Далее</Button>
                </Flex>
            </Container>
        </AppShell.Footer>
    </>
}