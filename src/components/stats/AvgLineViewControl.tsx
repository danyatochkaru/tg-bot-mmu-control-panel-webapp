'use client'

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Switch} from "@mantine/core";

type Props = {
    currentValue: boolean
}


export function AvgLineViewControl({currentValue}: Props) {
    const sp = useSearchParams()
    const router = useRouter()

    const [isShow, setIsShow] = useState(currentValue)

    useEffect(() => {
        if (isShow !== currentValue) {
            const qs = new URLSearchParams(sp)
            if (isShow) qs.set('avg', 'show')
            else qs.delete('avg')
            router.push(`?${qs.toString()}`)
        }
    }, [isShow, currentValue]);

    return <Switch style={{cursor: 'pointer'}} size={'xs'} label={'Линия среднего значения'} checked={isShow} onChange={e => setIsShow(e.currentTarget.checked)}/>
}