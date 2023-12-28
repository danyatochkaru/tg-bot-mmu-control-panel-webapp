"use client"

import {Button, Checkbox, Drawer, rem, Select, Stack, Text} from "@mantine/core";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {DatePickerInput, DatesRangeValue, DateValue} from "@mantine/dates";
import {useToggle} from "@mantine/hooks";
import dayjs from "dayjs";
import {IconX} from "@tabler/icons-react";
import {useEffect, useState} from "react";

export function FilteringDrawer() {
    const sp = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [isRange, toggleIsRange] = useToggle()

    const [searchProfileValue, setSearchProfileValue] = useState('')
    const [isSearching, toggleIsSearching] = useToggle()

    const handleDateChange = (value: DateValue | DatesRangeValue | null) => {
        const params = new URLSearchParams(sp.toString())

        params.delete(`filter-date`)

        if (Array.isArray(value)) {
            value[0] && params.append('filter-date', dayjs(value[0]).format('MM.DD.YYYY'))
            value[1] && params.append('filter-date', dayjs(value[1]).format('MM.DD.YYYY'))
        }
        if (value instanceof Date) {
            params.set(`filter-date`, dayjs(value).format('MM.DD.YYYY'))
        }

        router.push(pathname + "?" + params.toString())
    }

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

    const searchUser = async (email: string) => {

    }

    useEffect(() => {
        toggleIsSearching(true)
        searchUser(searchProfileValue).finally(() => {
            toggleIsSearching(false)
        })
    }, [searchProfileValue]);

    return <Drawer position={'right'} title={<Text fw={600} fz={rem(18)}>Настройка фильтров</Text>}
                   opened={sp.has('window') && sp.get('window')! === 'filter-history'}
                   onClose={close}>
        <Stack>
            {/*<Text fw={600}>Сортировка</Text>*/}
            {/*/ по дате*/}
            {/*<Text fw={600}>Фильтрация</Text>*/}
            <Select label={'Отправитель'} placeholder={"Введите почту отправителя"}
                    data={['hello', 'hell', 'help']}
                    checkIconPosition={'right'}
                    searchable
                    searchValue={searchProfileValue}
                    onSearchChange={setSearchProfileValue}
                    nothingFoundMessage={isSearching ? 'Идёт поиск...' : 'Пользователь не найден'}
            />
            <DatePickerInput label={`Дата`}
                             valueFormat={'DD MMMM YYYY'}
                             type={isRange ? 'range' : 'default'}
                             rightSection={
                                     sp.has('filter-date') && <IconX size={'1em'}
                                                                     style={{cursor: 'pointer'}}
                                                                     onClick={() => handleDateChange(isRange ? [null, null] : null)}/>
                             }
                             value={sp.has('filter-date')
                                     ? isRange
                                             ? [
                                                 sp.getAll('filter-date')[0]
                                                         ? dayjs(sp.getAll('filter-date')[0]).toDate()
                                                         : dayjs(sp.get('filter-date')).toDate(),
                                                 sp.getAll('filter-date')[1]
                                                         ? dayjs(sp.getAll('filter-date')[1]).toDate()
                                                         : null
                                             ]
                                             : dayjs(sp.get('filter-date')).toDate()
                                     : isRange ? [null, null] : null}
                             placeholder={`Выберите ${isRange ? 'диапозон дат' : 'дату'}`}
                             onChange={value => {
                                 if (Array.isArray(value) && value.every(i => i === null)) {
                                     return
                                 }
                                 handleDateChange(value)
                             }}
            />
            <Checkbox label={'Диапозон дат'} checked={isRange} onChange={() => {
                toggleIsRange()
            }}/>
            <Button variant={'outline'} color={'red'} onClick={clearFiltering}>Очистить фильтрацию</Button>
        </Stack>
    </Drawer>
}