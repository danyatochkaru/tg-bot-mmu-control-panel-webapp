import {Container, Group, Stack, Text} from "@mantine/core";
import {AreaChart} from "@mantine/charts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import {addDays, format} from "date-fns";

type UsersCountResponse = { total_count: number, date: string }

export default async function StatsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    const total: UsersCountResponse = await fetch(`${process.env.BOT_API_HOST}/info/users/count`).then(i => i.json())
    const days: UsersCountResponse[] = await Promise.all(
            Array.from({length: 7}, (_, index) => addDays(new Date(), -index))
                    .map(d => fetch(`${process.env.BOT_API_HOST}/info/users/count?date=${format(d, 'yyyy-MM-dd')}`).then(i => i.json()))
    )

    return  <Container p={'md'}>
        <Stack gap={'lg'}>
            <Group justify={'space-between'}>
                <Group align={'baseline'} gap={'xs'}>
                    <Text fw={700} size={'lg'}>Статистика бота</Text>
                </Group>
            </Group>
            <Text>Кол-во зарегистрированных пользователей: {total.total_count}</Text>
            <AreaChart
                    h={300}
                    data={days.toSorted((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime())).map(i => ({
                        date: format(i.date, 'yyyy-MM-dd'),
                        'Новых пользователей за день': i.total_count,
                        // 'Всего пользователей': total.total_count
                    }))}
                    dataKey="date"
                    connectNulls
                    series={[
                        {name: 'Новых пользователей за день', color: 'brand.6'},
                        // {name: 'Всего пользователей', color: 'brand.3'},
                    ]}
                    curveType="monotone"
            />
        </Stack>
    </Container>
}