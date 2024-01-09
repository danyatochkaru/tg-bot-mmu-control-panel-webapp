'use client'

import {Select} from "@mantine/core";
import {useDebouncedValue, useListState, useToggle} from "@mantine/hooks";
import {Profile} from "@prisma/client";
import {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export function SearchSenderInput() {
    const sp = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [searchResult, searchResultHandlers] = useListState<Profile>()
    const [isSearching, toggleIsSearching] = useToggle()
    const [searchProfileValue, setSearchProfileValue] = useState(
            sp.has('filter-sender')
                    ? sp.get('filter-sender')!
                    : ''
    )
    const [searchValue] = useDebouncedValue(searchProfileValue, 500, {leading: true})

    const searchUser = async (email: string) => {
        if (email === '') {
            searchResultHandlers.setState([])
            return
        }

        const searchParams = new URLSearchParams()
        searchParams.set('q', email)
        return fetch(`/api/users/search?${searchParams.toString()}`)
                .then(async (res) => {
                    if (res.ok) {
                        searchResultHandlers.setState((await res.json()).data)
                    }
                })
    }

    const handleSenderSelect = (email: string | null) => {
        const params = new URLSearchParams(sp.toString())
        if (email) {
            params.set('filter-sender', email)
        } else {
            params.delete('filter-sender')
            setSearchProfileValue('')
        }
        router.push(pathname + "?" + params.toString())
    }

    useEffect(() => {
        toggleIsSearching(true)
        searchUser(searchValue).finally(() => {
            toggleIsSearching(false)
        })
    }, [searchValue]);

    return <Select label={'Отправитель'} placeholder={"Введите почту отправителя"}
                   data={searchResult.map(u => u.email)}
                   checkIconPosition={'right'}
                   searchable
                   clearable
                   value={sp.has('filter-sender')
                           ? sp.get('filter-sender')!
                           : ''}
                   onChange={handleSenderSelect}
                   searchValue={searchProfileValue}
                   onSearchChange={setSearchProfileValue}
                   nothingFoundMessage={searchValue.length > 0
                           ? isSearching
                                   ? 'Идёт поиск...'
                                   : 'Пользователь не найден или ещё не отправлял сообщения'
                           : 'Начните вводить почту отправителя'}
    />
}