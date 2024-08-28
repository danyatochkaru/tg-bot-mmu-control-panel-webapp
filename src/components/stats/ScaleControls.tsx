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

    const [scale, setScale] = useState<string>(currentValue || "7")
    const [variants, setVariants] = useState([
        {
            label: 'Неделю',
            value: '7'
        }, {
            label: 'Месяц',
            value: '30'
        }
    ])

    useEffect(() => {
        if (scale !== currentValue) {
            const qs = new URLSearchParams(sp)
            qs.set('days', scale)
            router.push(`?${qs.toString()}`)
        }
    }, [scale, currentValue]);

    useEffect(() => {
        if (scale && !variants.some(v => String(v.value) == scale)) {
            setVariants(vs => [...vs, {
                label: `${scale} дн.`,
                value: scale
            }])
        }
    }, []);


    return <ChipGroup defaultValue={scale} onChange={v => setScale(v as string)}>
        <Group justify="left" gap={'xs'}>
            {variants.map(v => (
                    <Chip key={v.value} size={'xs'} value={v.value}>{v.label}</Chip>
            ))}
        </Group>
    </ChipGroup>
}