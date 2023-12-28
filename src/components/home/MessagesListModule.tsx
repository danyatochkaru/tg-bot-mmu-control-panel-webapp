"use client"

import {ActionIcon, Group, Pagination, SegmentedControl, Stack, Text} from "@mantine/core";
import {useEffect} from "react";
import useSWR from "swr";
import {Mailing, Profile} from "@prisma/client";
import {useGroupsStore} from "@/store/groups";
import {FilteringDrawer} from "@/components/home/FilteringDrawer";
import {useSearchParams} from "next/navigation";
import {IconFilter, IconFilterFilled} from "@tabler/icons-react";
import {useFilteringQueryString} from "@/components/home/useFilteringQueryString";
import {MessagesListItem} from "@/components/home/MessagesListItem";

export function MessagesListModule() {
    const sp = useSearchParams()
    const itemsPerPage = 12;

    const {
        url,
        getRequestQuery,
        toggleSort,
        changeActivePage,
        toggleFilterManageWindow
    } = useFilteringQueryString({itemsPerPage})
    const groups = useGroupsStore(state => state.groups)


    const {data, isLoading, error} = useSWR<{
        messages: (Mailing & { sender: Profile })[],
        count: number
    }>(
            `/api/messages?${getRequestQuery()}`,
            {refreshInterval: 30 * 1000}
    )

    useEffect(() => {
        if (error) console.error(error)
    }, [error])

    return <>
        <FilteringDrawer/>
        <Stack gap={'lg'}>
            <Group justify={'space-between'}>
                <Group align={'baseline'} gap={'xs'}>
                    <Text fw={700} size={'lg'}>История рассылок</Text>
                    {data?.count && <Text size={'sm'}>всего: {data.count}</Text>}
                </Group>
                <Group>
                    <SegmentedControl
                            size={'sm'}
                            disabled={isLoading}
                            value={url?.searchParams.get('sort-date') ?? 'newest'}
                            onChange={v => toggleSort(v as 'newest' | 'oldest')}
                            data={[
                                {label: 'Сначала старые', value: 'oldest'},
                                {label: 'Сначала новые', value: 'newest'},
                            ]}
                    />
                    <ActionIcon size={'lg'}
                                disabled={isLoading}
                                onClick={toggleFilterManageWindow.open}
                                variant={'outline'}
                    >
                        {(/filter-.*=/gi.test(sp.toString()))
                                ? <IconFilterFilled size={'1em'}/>
                                : <IconFilter size={'1em'}/>
                        }
                    </ActionIcon>
                </Group>
            </Group>
            {isLoading
                    ? <Text>Загрузка...</Text>
                    : data?.messages?.length
                            ? data?.messages?.map((i) => (
                                    <MessagesListItem key={i.id}
                                                      message={i.message}
                                                      recipients={groups.filter(g => i.recipients.includes(g.groupOid))}
                                                      sender={i.sender}
                                                      createdAt={i.createdAt}
                                    />
                            ))
                            : error ? <Text>Произошла ошибка. Попробуйте перезагрузить страницу или повторите запрос
                                позже</Text> : <Text>Сообщения отсутствуют</Text>
            }
            <Pagination total={Math.ceil((data?.count ?? 0) / itemsPerPage)}
                        value={parseInt(url?.searchParams.get('page') ?? '1')}
                        onChange={changeActivePage}/>
        </Stack>
    </>
}