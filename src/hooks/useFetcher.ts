import {useEffect, useState} from "react";
import {GROUPS} from "@/constants/groups";

export default function useFetcher<T = any>(path: string, options?: RequestInit) {
    const [data, setData] = useState<T[] | null>(null)
    const [error, setError] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const getData = () => {
        // setLoading(true)
        if (path === '/dictionary/groups') {
            setData(GROUPS as T[])
        }
        /*const headers = new Headers()
        headers.set('Authorization', 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_AUTH ?? '').toString('base64'))

        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${path}`, {
            credentials: 'include',
            headers,
            // referrerPolicy: 'strict-origin-when-cross-origin',
            ...options,
        })
            .then(res => {
                res.json().then(parsedData => {
                    setData(parsedData)
                })
            })
            .catch(err => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })*/
    }

    useEffect(() => {
        if (!data?.length) {
            getData()
        }
    }, []);

    const refetch = () => {
        getData()
    }

    return {data, error, loading, refetch}
}
