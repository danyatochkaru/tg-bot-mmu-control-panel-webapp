"use client"

import {Autocomplete, Button, Center, Chip, Container, Divider, Flex, Group, Stack, Title} from "@mantine/core";
import {useTelegram} from "@/app/TelegramProvider";

export default function Home() {
    const {webApp, user} = useTelegram()

    console.log(user);

    return (
        <Container p={'md'}>
            <Stack gap={'sm'}>
                <Stack>
                    <Autocomplete
                        label="Your favorite library"
                        placeholder="Pick value or enter anything"
                        data={['React', 'Angular', 'Vue', 'Svelte']}
                    />
                </Stack>
                <Stack gap={'xs'}>
                    <Title order={6}>Выбери</Title>
                    <Flex gap={'xs'} wrap={'wrap'}>
                        <Chip defaultChecked>Awesome chip</Chip>
                        <Chip defaultChecked>Awesome chip</Chip>
                        <Chip defaultChecked>Awesome chip</Chip>
                        <Chip defaultChecked>Awesome chip</Chip>
                    </Flex>
                </Stack>
                <Stack gap={'xs'}>
                    <Title order={6}>Выбери</Title>
                    <Flex gap={'xs'} wrap={'wrap'}>
                        <Chip defaultChecked>Awesome chip</Chip>
                        <Chip defaultChecked>Awesome chip</Chip>
                    </Flex>
                </Stack>
            </Stack>
            <Divider my="sm"/>
            <Flex wrap={'wrap'} gap={'xs'}>
                <Chip defaultChecked>Awesome chip</Chip>
                <Chip defaultChecked>Awesome chip</Chip>
                <Chip defaultChecked>Awesome chip</Chip>
            </Flex>
            <Group my={'md'}>
                <Center>
                    <Button>Далее</Button>
                </Center>
            </Group>
        </Container>
    )
}
