import {Loader, Stack, Text} from "@mantine/core";

export default function SourcesChartLoading() {
    return <Stack gap={'xs'} align={'center'}>
        <Loader/>
        <Text>Загрузка...</Text>
    </Stack>
}