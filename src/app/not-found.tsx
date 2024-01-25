import {Button, Container, Stack, Text} from "@mantine/core";
import Link from "next/link";
import {PAGE_LINKS} from "@/constants/page-links";

export default function NotFoundPage() {
    return <Container p={'md'}>
        <Stack align={'center'}>
            <Text ta={'center'} fw={'bold'}>Страница не найдена</Text>
            <Button component={Link} href={PAGE_LINKS.HOME}>Перейти на главную</Button>
        </Stack>
    </Container>

}