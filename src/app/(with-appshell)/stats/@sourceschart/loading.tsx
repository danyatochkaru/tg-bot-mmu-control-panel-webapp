import {Loader, Paper, Stack, Text} from "@mantine/core";

export default function SourcesChartLoading() {
    return <Paper withBorder p="sm" miw={'fit-content'} w={'100%'}>
        <Stack gap={'xs'} align={'center'}>
            <Loader/>
            <Text>Загрузка модуля...</Text>
        </Stack>
    </Paper>
}