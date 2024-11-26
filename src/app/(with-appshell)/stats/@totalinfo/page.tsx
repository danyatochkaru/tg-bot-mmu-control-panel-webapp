import {UsersCountResponse} from "@/types/stats";
import {Badge, ColorSwatch, Flex, Group, List, ListItem, NumberFormatter, Paper, Stack, Text} from "@mantine/core";
import {DonutChart} from "@mantine/charts";

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
                    size={120}
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
                <List
                        spacing="xs"
                        center
                >
                    {[
                        {label: 'Активных пользователей: ', value: activeUsers, color: 'brand'},
                        {label: 'Неактивных пользователей: ', value: inactiveUsers, color: 'gray'},
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
                            </ListItem>

                    ))}
                </List>
            </Stack>
        </Group>
    </Paper>
}