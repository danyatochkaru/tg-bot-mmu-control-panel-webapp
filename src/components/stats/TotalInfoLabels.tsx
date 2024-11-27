'use client'

import {ColorSwatch, List, ListItem, NumberFormatter, Text} from "@mantine/core";
import React, {useCallback, useEffect, useState} from "react";
import {getCookie, setCookie} from "cookies-next/client";
import {addYears} from "date-fns/addYears";
import {addHours} from "date-fns/addHours";

type Props = {
    activeUsers: number,
    inactiveUsers: number,

}

function TotalInfoLabels({activeUsers, inactiveUsers}: Props) {
    const [activeLastValue, setActiveLastValue] = useState<number | null>(null)
    const [inactiveLastValue, setInactiveLastValue] = useState<number | null>(null)

    const updateStats = useCallback(() => {
        setCookie('stats', JSON.stringify({
            active: activeUsers,
            inactive: inactiveUsers,
            lastUpdated: new Date()
        }), {expires: addYears(new Date(), 1)})
    }, [activeUsers, inactiveUsers])

    useEffect(() => {
        const stats: { active: number, inactive: number, lastUpdated: Date } = JSON.parse(getCookie('stats') || "{}")

        if (!stats?.lastUpdated || addHours(new Date(), -1).getTime() > new Date(stats.lastUpdated).getTime()) {
            updateStats()
        }

        setActiveLastValue(stats.active)
        setInactiveLastValue(stats.inactive)
    }, [activeUsers, inactiveUsers])

    return <List
            spacing="xs"
            center
    >
        {[
            {
                label: 'Активных пользователей: ',
                value: activeUsers,
                color: 'brand',
                lastValue: activeLastValue,
                indicatorColors: ['green', 'red']
            },
            {
                label: 'Неактивных пользователей: ',
                value: inactiveUsers,
                color: 'gray',
                lastValue: inactiveLastValue,
                indicatorColors: ['red', 'green']
            },
        ].map(i => (
                <ListItem key={i.label}
                          icon={<ColorSwatch color={`var(--mantine-color-${i.color}-6)`}
                                             withShadow={false}
                                             size={12}/>}
                >
                    <span>{i.label}</span>
                    <NumberFormatter
                            value={i.value}
                            thousandSeparator=" "
                            decimalScale={2}
                            decimalSeparator="."
                    />
                    {i.lastValue !== null
                            && (i.value - i.lastValue !== 0)
                            && <Text component={'span'} fw={700} fz={'sm'}
                                     c={i.indicatorColors[(i.value - i.lastValue) > 0 ? 0 : 1]}
                                     title={'За час с последнего просмотра'}
                            >
                                <NumberFormatter
                                        value={Math.abs(i.value - i.lastValue)}
                                        allowNegative={false}
                                        prefix={(i.value - i.lastValue) > 0 ? '+' : '-'}
                                        thousandSeparator=" "
                                        decimalScale={2}
                                        decimalSeparator="."
                                />
                            </Text>}
                </ListItem>

        ))}
    </List>
}

export default React.memo(TotalInfoLabels)