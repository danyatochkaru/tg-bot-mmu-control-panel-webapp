import {Loader, Paper, Stack, Text} from "@mantine/core";

export default function NewUsersChartLoading() {
    return <Paper shadow="xs" p={'sm'}>
        <Stack gap={'xs'} align={'center'}>
            <Loader/>
            <Text>Загрузка...</Text>
        </Stack>
    </Paper>
}