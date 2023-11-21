import {Anchor, Container, Flex, Title} from "@mantine/core";
import Link from "next/link";
import {IconMailFast} from "@tabler/icons-react";
import {LogoutButton} from "@/components/LogoutButton";

export async function HeaderContent() {
    return (
            <Container>
                <Flex justify={'space-between'} align={'center'} h={50} columnGap={12}>
                    <Anchor component={Link} href={"/"} underline={'never'} c={'black'}>
                        <Flex align={'center'} columnGap={6}>
                            <IconMailFast size={'2em'}/>
                            <Title visibleFrom={'sm'} order={3}>Панель управления рассылкой</Title>
                            <Title hiddenFrom={'sm'} order={3}>ПУР</Title>
                        </Flex>
                    </Anchor>
                    <LogoutButton/>
                </Flex>
            </Container>
    );
}
