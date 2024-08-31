import {Stack, Text} from "@mantine/core";
import {PieChart} from "@mantine/charts";

const SOURCE_TRANSLATE: Record<string, string> = {
    'directly': 'Через /start',
    'group_link': 'Через ссылку'
}

export default async function SourcesChartPage() {
    const sources: { source: string, count: number }[] = await fetch(`${process.env.BOT_API_HOST}/info/users/source`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
        }
    }).then(i => i.json())

    return <Stack gap={'lg'}>
        <Text>Источники регистрации:</Text>
        <PieChart size={240}
                  withLabelsLine
                  labelsPosition="inside"
                  labelsType="percent"
                  withLabels
                  withTooltip
                  data={sources.toSorted((a, b) => b.count - a.count).map((s, index) => ({
                      key: s.source,
                      name: SOURCE_TRANSLATE[s.source] || s.source,
                      value: +s.count,
                      color: ['brand', 'teal'][index]
                  }))}
        />
    </Stack>
}