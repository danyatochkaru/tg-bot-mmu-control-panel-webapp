import {Container} from "@mantine/core";
import {MessagesListModule} from "@/components/home";


export default function MessagesPage() {
    return <Container p={'md'}>
        <MessagesListModule/>
    </Container>
}