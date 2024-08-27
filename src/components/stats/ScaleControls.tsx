'use client'

import {Chip, ChipGroup, Group} from "@mantine/core";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

type Props = {
    currentValue: string
}

export function ScaleControls({currentValue}: Props) {

    const sp = useSearchParams()
    const router = useRouter()

    const [scale, setScale] = useState<string>(currentValue)

    useEffect(() => {
        if (scale !== currentValue) {
            const qs = new URLSearchParams(sp)
            qs.set('days', scale)
            router.push(`?${qs.toString()}`)
        }
    }, [scale, currentValue]);


    return <ChipGroup defaultValue={scale} onChange={v => setScale(v as string)}>
        <Group justify="left" gap={'xs'}>
            <Chip size={'xs'} value="7">Неделю</Chip>
            <Chip size={'xs'} value="30">Месяц</Chip>
        </Group>
    </ChipGroup>
}