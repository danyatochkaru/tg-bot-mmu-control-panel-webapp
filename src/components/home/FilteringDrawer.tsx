"use client"

import {Button, Drawer, rem, Stack, Text} from "@mantine/core";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {SearchSenderInput} from "@/components/home/SearchSenderInput";
import {useSession} from "next-auth/react";
import {DateFilteringInput} from "@/components/home/DateFilteringInput";

export function FilteringDrawer() {
    const sp = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const {data: session} = useSession()

    const clearFiltering = () => {
        const params = new URLSearchParams(sp.toString())

        // @ts-ignore
        for (const key of params.keys()) {
            if (/filter-*/i.test(key)) {
                params.delete(key)
            }
        }

        router.push(pathname + "?" + params.toString())
    }

    const close = () => {
        const params = new URLSearchParams(sp.toString())
        params.delete('window', 'filter-history')
        router.push(pathname + "?" + params.toString())
    }

    return <Drawer position={'right'} title={<Text fw={600} fz={rem(18)}>Настройка фильтров</Text>}
                   opened={sp.has('window') && sp.get('window')! === 'filter-history'}
                   onClose={close}>
        <Stack>
            {/*<Text fw={600}>Сортировка</Text>*/}
            {/*/ по дате*/}
            {/*<Text fw={600}>Фильтрация</Text>*/}
            {session?.user.role === 'ADMIN' && <SearchSenderInput/>}
            <DateFilteringInput/>
            <Button variant={'outline'} color={'red'} onClick={clearFiltering}>Очистить фильтрацию</Button>
        </Stack>
    </Drawer>
}