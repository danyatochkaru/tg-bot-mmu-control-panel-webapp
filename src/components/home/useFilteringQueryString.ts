import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

type Options = { itemsPerPage?: number }

const SORTING_BY_DATE = 'sort-date'
const FILTERING_HISTORY_WINDOW = 'filter-history'
const PAGE = 'page'
const FILTERING_DATES = 'filter-date'
const FILTERING_SENDER = 'filter-sender'

export const useFilteringQueryString = (options?: Options) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [url, setUrl] = useState<URL>()

    const push = () => url && router.push(url.toString())

    const toggleSort = (dir?: 'oldest' | 'newest') => {
        if (!url) {
            return
        }
        url.searchParams.set(SORTING_BY_DATE, dir ?? (searchParams.get(SORTING_BY_DATE) === 'newest' ? 'oldest' : 'newest'))
        push()
    }

    const changeActivePage = (page: number) => {
        if (!url) {
            return
        }
        url.searchParams.set(PAGE, String(page))
        push()
    }

    const openFilterManageWindow = () => {
        if (!url) {
            return
        }
        url.searchParams.set('window', FILTERING_HISTORY_WINDOW)
        push()
    }
    const closeFilterManageWindow = () => {
        if (!url) {
            return
        }
        url.searchParams.delete('window', FILTERING_HISTORY_WINDOW)
        push()
    }

    const getRequestQuery = (): string => {
        const sp = new URLSearchParams()

        if (url?.searchParams.has(SORTING_BY_DATE)) {
            const x = {
                'oldest': 'asc',
                'newest': 'desc',
            }

            sp.set('orderDir', x[url!.searchParams.get(SORTING_BY_DATE) as 'newest' | 'oldest'])
        }

        if (url?.searchParams.has(PAGE)) {
            const count = options?.itemsPerPage ?? 12
            sp.set('take', String(count))
            sp.set('skip', String(((parseInt(url?.searchParams.get('page') || '1') - 1) * count)))
        }

        if (url?.searchParams.has(FILTERING_DATES)) {
            const dates = url?.searchParams.getAll(FILTERING_DATES)
            sp.append('date', dates[0])
            sp.append('date', dates[dates.length - 1])
        }

        if (url?.searchParams.has(FILTERING_SENDER)) {
            const sender = url?.searchParams.get(FILTERING_SENDER)!
            sp.set('sender', sender)
        }

        return sp.toString()
    }

    useEffect(() => {
        setUrl(new URL(window?.location.href))
    }, [searchParams])

    return {
        url,
        toggleSort,
        changeActivePage,
        getRequestQuery,
        toggleFilterManageWindow: {open: openFilterManageWindow, close: closeFilterManageWindow},
    }
}