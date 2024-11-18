import {addDays, endOfDay, format, startOfDay} from "date-fns";
import {UsersCountResponse} from "@/types/stats";
import {Button, ButtonGroup, Group, NumberFormatter, Paper, Stack, Text} from "@mantine/core";
import endingByNum from "@/utils/endingByNum";
import {ScaleControls} from "@/components/stats/ScaleControls";
import {ru as ruLocale} from "date-fns/locale/ru";
import Link from "next/link";
import {AreaChart} from "@mantine/charts";
import calcAvgValue from "@/utils/calcAvgValue";
import {AvgLineViewControl} from "@/components/stats/AvgLineViewControl";

type Props = {
    searchParams: Record<string, string>
}

export default async function NewUsersChartPage(props: Props) {
    const days = (+props.searchParams.days > 30 ? 30 : +props.searchParams.days) || 7
    const selectedDate = new Date(props.searchParams.date || Date.now())

    const dates = Array
            .from({length: days}, (_, index) => startOfDay(addDays(selectedDate, -index * (!!JSON.parse(props.searchParams.next || "0") ? -1 : 1))))
            .toSorted((a, b) => a.getTime() - b.getTime())


    const statsSearchParams = new URLSearchParams()

    statsSearchParams.set('date', selectedDate.toISOString())
    statsSearchParams.set('days', String(days))

    if (!!JSON.parse(props.searchParams.next || "0")) {
        statsSearchParams.set('dir', 'next')
    }

    const stats: {
        payload: any,
        data: UsersCountResponse
    } = await fetch(`${process.env.BOT_API_HOST}/info/users/count?${statsSearchParams.toString()}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
        }
    })
            .then(i => i.json())

    const getPeriodHref = (date: Date, days: number) => {
        const row = ['/stats']
        const sp = new URLSearchParams(props.searchParams)
        if (days) {
            let new_date = addDays(date, days)
            if (new_date.getTime() > endOfDay(Date.now()).getTime()) new_date = new Date()
            sp.set('date', format(new_date, 'yyyy-MM-dd'))
        } else {
            sp.delete('date')
        }
        sp.size && row.push(sp.toString())
        return row.join('?')
    }
    return <Paper withBorder p={'sm'}>
        <Stack gap={'lg'}>
            <Group justify={'space-between'}>
                <Group gap={'xs'} align={'center'}>
                    <Text>
                        <NumberFormatter value={stats.data.total_count} thousandSeparator=" " decimalScale={2}
                                         decimalSeparator="."/> {endingByNum(stats.data.total_count, ['новый пользователь', "новых пользователя", "новых пользователей"])} за
                    </Text>
                    <ScaleControls currentValue={props.searchParams.days}/>
                </Group>
                <Group wrap={'wrap-reverse'}>
                    <Text size={'sm'}
                          title={"Точка отсчёта"}>{format(new Date(dates[dates.length - 1]), 'dd MMM yyyy', {locale: ruLocale})}</Text>
                    <ButtonGroup>
                        {[
                            {
                                label: "←",
                                title: "Предыдущий период",
                                date: selectedDate,
                                days: -days,
                            },
                            {
                                label: "→",
                                title: "Следующий период",
                                date: selectedDate,
                                days: days,
                                disabled: endOfDay(selectedDate).getTime() >= endOfDay(new Date()).getTime()
                            },
                            {
                                label: '↺',
                                title: "Сброс",
                                date: new Date(),
                                days: 0,
                                disabled: endOfDay(selectedDate).getTime() >= endOfDay(new Date()).getTime()
                            },
                        ].map(i => (
                                <Button
                                        key={i.label}
                                        component={Link}
                                        href={getPeriodHref(i.date, i.days)}
                                        title={i.title}
                                        size={'xs'}
                                        variant={'subtle'}
                                        disabled={i.disabled}
                                        replace
                                        prefetch={false}
                                >{i.label}</Button>
                        ))}
                    </ButtonGroup>
                </Group>
            </Group>
            <AreaChart
                    h={300}
                    data={
                        dates.map(d => ({
                            date: format(d, 'dd.MM.yyyy'),
                            'Новых пользователей за день': stats.data.details.find(j =>
                                    format(j.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
                            )?.groups.reduce((acc, cur) => acc + cur.count, 0) || 0
                        }))
                    }
                    dataKey="date"
                    connectNulls
                    referenceLines={props.searchParams?.avg === 'show'
                            ? [
                                {
                                    y: calcAvgValue(dates.map(d => stats.data.details.find(j =>
                                            format(j.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
                                    )?.groups.reduce((acc, cur) => acc + cur.count, 0) || 0)),
                                    label: 'Среднее значение',
                                    color: 'red'
                                }
                            ]
                            : undefined}
                    series={[
                        {name: 'Новых пользователей за день', color: 'brand'}
                    ]}
                    curveType="monotone"
            />
            <Group>
                <AvgLineViewControl currentValue={props.searchParams?.avg === 'show'}/>
            </Group>
        </Stack>
    </Paper>
}