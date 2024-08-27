import {Badge, Container, Group, NumberFormatter, Paper, Stack, Text} from "@mantine/core";
import {AreaChart} from "@mantine/charts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import {addDays, format, startOfDay} from "date-fns";
import {ScaleControls} from "@/components/stats/ScaleControls";
import endingByNum from "@/utils/endingByNum";
import {AvgLineViewControl} from "@/components/stats/AvgLineViewControl";

type UsersCountResponse = {
    total_count: number;
    details: Array<{
        groups: Array<{
            group_id: number;
            group_name?: string;
            inactive_count?: number;
            count: number;
        }>;
        date: Date;
    }>;
}

function getFormattedPhrase(days: number) {
    switch (days) {
        case 7:
            return 'неделю'
        case 30:
            return 'месяц'
        default:
            return `${days} дн.`
    }
}

const SOURCE_TRANSLATE: Record<string, string> = {
    'directly': 'С помощью команды /start',
    'group_link': 'Через пригласительную ссылку'
}

function calcAvgValue(nums: number[]) {
    return nums.length === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / nums.length
}

export default async function StatsPage(props: {
    searchParams: Record<string, string> & { next?: string }
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    const sources: {source: string, count: number}[] = await fetch(`${process.env.BOT_API_HOST}/info/users/source`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
        }
    }).then(i => i.json())


    const days = (+props.searchParams.days > 30 ? 30 : +props.searchParams.days) || 7

    const dates = Array
            .from({length: days}, (_, index) => startOfDay(addDays(new Date(), -index * (!!JSON.parse(props.searchParams.next || "0") ? -1 : 1))))
            .toSorted((a, b) => a.getTime() - b.getTime())

    const total: {
        data: UsersCountResponse
    } = await fetch(`${process.env.BOT_API_HOST}/info/users/count`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
        }
    }).then(i => i.json())

    const statsSearchParams = new URLSearchParams()

    statsSearchParams.set('date', new Date().toISOString())
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

    console.log(sources)

    /*stats.data.details.toSorted((a,b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(a =>
            console.log({
                date: a.date,
                count: a.groups.reduce((acc, group) => acc + group.count, 0)
            })
        )


    console.log(dates.map(d => ({
        date: d.toISOString(),
        count: stats.data.details.find(j =>
                format(j.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
        )?.groups.reduce((acc, cur) => acc + cur.count, 0) || 0
    })))*/

    //{getFormattedPhrase(days)}

    return <Container p={'md'}>
        <Stack gap={'lg'}>
            <Group justify={'space-between'}>
                <Group align={'baseline'} gap={'xs'}>
                    <Text fw={700} size={'lg'}>Статистика бота</Text>
                </Group>
            </Group>
            <Group gap={'xs'} align={'center'}>
                <Text>Кол-во зарегистрированных пользователей:</Text>
                <Badge size={'lg'} autoContrast color="brand"><NumberFormatter value={total.data.total_count}
                                                                               thousandSeparator=" " decimalScale={2}
                                                                               decimalSeparator="."/></Badge>
            </Group>
            <Paper shadow="xs" p={'sm'}>
                <Stack gap={'lg'}>
                    <Group gap={'xs'} align={'center'}>
                        <Text>
                            <NumberFormatter value={stats.data.total_count} thousandSeparator=" " decimalScale={2}
                                             decimalSeparator="."/> новых {endingByNum(stats.data.total_count, ['пользователь', "пользователя", "пользователей"])} за
                        </Text>
                        <ScaleControls currentValue={props.searchParams.days}/>
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
        </Stack>
    </Container>
}
