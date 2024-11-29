import {ColorSwatch, Group, List, ListItem, NumberFormatter, Paper, Stack, Text} from "@mantine/core";
import {DonutChart} from "@mantine/charts";
import {ReactNode} from "react";

const SOURCE_TRANSLATE: Record<string, string | ReactNode> = {
    'directly': <>С помощью команды <pre style={{display: 'inline'}}>/start</pre></>,
    'group_link': 'Через пригласительную ссылку'
}

export default async function SourcesChartPage() {
    const sources: { source: string, count: number }[] = await fetch(`${process.env.BOT_API_HOST}/info/users/source`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
        }
    }).then(i => i.json())

    const data = sources
            .toSorted((a, b) => b.count - a.count)
            .map((s, index) => ({
                key: s.source,
                name: SOURCE_TRANSLATE[s.source] || s.source,
                value: +s.count,
                color: ['brand', 'teal'][index]
            }))

    return <Paper withBorder p="sm" miw={'fit-content'} w={'100%'}>
        <Group>
            <DonutChart size={100}
                        paddingAngle={1}
                        withTooltip={false}
                        data={data.map(i => ({
                            ...i,
                            name: typeof i.name === 'string' ? i.name : i.key
                        }))}
            />
            <Stack gap={'xs'}>
                <Text>Источники регистрации:</Text>
                <List
                        spacing="xs"
                        center
                >
                    {data.map(i => (
                            <ListItem key={i.key}
                                      icon={<ColorSwatch color={`var(--mantine-color-${i.color}-6)`}
                                                         withShadow={false}
                                                         size={12}/>}
                            >
                                <span>{i.name}: </span>
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