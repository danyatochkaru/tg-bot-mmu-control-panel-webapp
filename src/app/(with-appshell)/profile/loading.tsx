import {Container, Text} from "@mantine/core";
import {FormLayout} from "@/layouts/FormLayout";

export default function LoadingEditProfile() {
    return <Container p={'md'}>
        <FormLayout>
            <Text>Загрузка...</Text>
        </FormLayout>
    </Container>
}