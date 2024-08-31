import {Container, Loader, Stack, Text} from "@mantine/core";
import {FormLayout} from "@/layouts/FormLayout";

export default function LoadingEditProfile() {
    return <Container p={'md'}>
        <FormLayout>
            <Stack gap={'xs'} align={'center'}>
                <Loader/>
                <Text>Загрузка...</Text>
            </Stack>
        </FormLayout>
    </Container>
}