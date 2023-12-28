import {Chip, Container, Divider, SimpleGrid, Skeleton} from "@mantine/core";

export default function LoadingNewMessage() {
    const groupsPlaceholder = Array(15).fill('GroupName')
    return <Container p={'md'}>
        <Skeleton height={116} width={'100%'}/>
        <Divider my="sm" label={'Группы'}/>
        <SimpleGrid cols={{base: 2, xs: 4, sm: 5, md: 6}}>
            {groupsPlaceholder.map((i, index) => (
                    <Skeleton key={index} w={'fit-content'}><Chip variant={'outline'}>{i}</Chip></Skeleton>))}
        </SimpleGrid>
    </Container>
}