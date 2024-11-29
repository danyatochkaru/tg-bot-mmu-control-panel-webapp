import {Loader, Paper, Stack, Text} from "@mantine/core";

export default function NewUsersChartLoading() {
    return <Paper withBorder p={'sm'}>
        <Stack gap={'xs'} align={'center'}>
            <Loader/>
            <Text>Загрузка модуля...</Text>
        </Stack>
    </Paper>
}