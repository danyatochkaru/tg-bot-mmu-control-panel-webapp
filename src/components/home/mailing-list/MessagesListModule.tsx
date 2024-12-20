"use client"

import {ActionIcon, Group, Loader, Pagination, SegmentedControl, Stack, Text} from "@mantine/core";
import {useEffect} from "react";
import useSWR from "swr";
import {useGroupsStore} from "@/store/groups";
import {useSearchParams} from "next/navigation";
import {IconFilter, IconFilterFilled} from "@tabler/icons-react";
import {useFilteringQueryString} from "@/components/home/mailing-list/useFilteringQueryString";
import {MessagesListItem} from "@/components/home/mailing-list/MessagesListItem";
import Title from "@/components/Title";
import dynamic from "next/dynamic";
import {MESSAGES} from "@/types/swr-responses";

const FilteringDrawer = dynamic(() => import("@/components/home/FilteringDrawer"), {ssr: false})

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


    const {data, isLoading, error} = useSWR<MESSAGES>(
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
                <Title title={'История рассылок'} subtitle={data?.count ? `всего: ${data.count}` : undefined}/>
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
                    ? <Stack gap={'xs'} align={'center'}>
                        <Loader/>
                        <Text>Загрузка...</Text>
                    </Stack>
                    : data?.messages?.length
                            ? data?.messages?.map((i) => (
                                    <MessagesListItem key={i.id}
                                                      data={i}
                                                      sender={i.sender}
                                                      recipients={groups.filter(g => i.recipients.includes(g.groupOid))}
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