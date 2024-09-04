import {Loader, Stack, Text} from "@mantine/core";

export default function FaqFormLoading() {
    return <Stack gap={'xs'} align={'center'}>
        <Loader/>
        <Text>Загрузка модуля...</Text>
    </Stack>
}