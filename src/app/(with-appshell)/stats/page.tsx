import {Container, Group, Stack, Text} from "@mantine/core";
import {AreaChart} from "@mantine/charts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import {addDays, format, startOfDay} from "date-fns";

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

export default async function StatsPage(props: any) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    const days = (+props.searchParams.days > 30 ? 30 : +props.searchParams.days) || 7

    const dates = Array
            .from({length: days}, (_, index) => startOfDay(addDays(new Date(), -index * (!!JSON.parse(props.searchParams.next || 0) ? -1 : 1))))
            .toSorted((a, b) => a.getTime() - b.getTime())

    const total: {
        data: UsersCountResponse
    } = await fetch(`${process.env.BOT_API_HOST}/info/users/count`).then(i => i.json())

    const statsSearchParams = new URLSearchParams()

    statsSearchParams.set('date', new Date().toISOString())
    statsSearchParams.set('days', String(days))

    if (!!JSON.parse(props.searchParams.next || 0)) {
        statsSearchParams.set('dir', 'next')
    }

    const stats: {
        payload: any,
        data: UsersCountResponse
    } = await fetch(`${process.env.BOT_API_HOST}/info/users/count?${statsSearchParams.toString()}`)
            .then(i => i.json())

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

    return <Container p={'md'}>
        <Stack gap={'lg'}>
            <Group justify={'space-between'}>
                <Group align={'baseline'} gap={'xs'}>
                    <Text fw={700} size={'lg'}>Статистика бота</Text>
                </Group>
            </Group>
            <Stack gap={'xs'}>
                <Text>Кол-во зарегистрированных пользователей: {total.data.total_count}</Text>
                <Text>Новых пользователей за {getFormattedPhrase(days)}: {stats.data.total_count}</Text>
            </Stack>
            <Group mt={'md'}>
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
                        series={[
                            {name: 'Новых пользователей за день', color: 'brand.6'}
                        ]}
                        curveType="monotone"
                />
            </Group>
        </Stack>
    </Container>
}
