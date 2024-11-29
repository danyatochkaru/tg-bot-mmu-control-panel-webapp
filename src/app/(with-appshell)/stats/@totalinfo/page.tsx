import {UsersCountResponse} from "@/types/stats";
import {Badge, Flex, Group, NumberFormatter, Paper, Stack, Text} from "@mantine/core";
import {DonutChart} from "@mantine/charts";
import TotalInfoLabels from "@/components/stats/TotalInfoLabels";

export default async function TotalInfoPage() {
    const total: {
        data: UsersCountResponse
    } = await fetch(`${process.env.BOT_API_HOST}/info/users/count`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
        }
    }).then(i => i.json())

    const totalUsers = total.data.total_count,
            activeUsers = (total.data.total_count - (total.data.total_inactive || 0)),
            inactiveUsers = total.data.total_inactive || 0

    return <Paper withBorder p="sm" miw={'fit-content'} w={'100%'}>
        <Group>
            <DonutChart
                    size={100}
                    paddingAngle={1}
                    withTooltip={false}
                    data={[
                        {
                            value: activeUsers,
                            name: 'Активные',
                            color: 'brand'
                        },
                        {value: inactiveUsers, name: 'Неактивные', color: 'gray'},
                    ]}
            />
            <Stack gap={'xs'}>
                <Flex gap={'0.25rem'}>
                    <Text>Всего пользователей: </Text>
                    <Badge size={'lg'} autoContrast color="brand" display={'inline-flex'}>
                        <NumberFormatter
                                value={totalUsers}
                                thousandSeparator=" "
                                decimalScale={2}
                                decimalSeparator="."
                        />
                    </Badge>
                </Flex>
                <TotalInfoLabels activeUsers={activeUsers} inactiveUsers={inactiveUsers}/>
            </Stack>
        </Group>
    </Paper>
}