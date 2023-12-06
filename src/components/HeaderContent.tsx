import {Anchor, Container, Flex, Title} from "@mantine/core";
import Link from "next/link";
import {IconMailFast} from "@tabler/icons-react";
import {LogoutButton} from "@/components/LogoutButton";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGES_LINK} from "@/constants/PAGES_LINK";

export async function HeaderContent() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return redirect(PAGES_LINK.LOGIN)
    }

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
                    <LogoutButton name={(session.user.email as string).split('@')[0]}/>
                </Flex>
            </Container>
    );
}
