import {Button, ButtonProps, Container, Group, SimpleGrid} from "@mantine/core";
import Link from "next/link";
import {IconList, IconPlus, IconSettings} from "@tabler/icons-react";
import {PAGE_LINKS} from "@/constants/page-links";
import {MessagesListModule} from "@/components/home";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";


const buttons: { props: ButtonProps & Record<string, any>, value: string, onlyAdmin: boolean }[] = [
    {
        props: {
            fullWidth: true,
            leftSection: <IconPlus size={'1rem'}/>,
            component: Link,
            href: PAGE_LINKS.NEW_MESSAGE,
        },
        value: 'Новая рассылка',
        onlyAdmin: false,
    },
    {
        props: {
            fullWidth: true,
            leftSection: <IconSettings size={'1rem'}/>,
            component: Link,
            href: PAGE_LINKS.PROFILE,
            variant: 'default',
        },
        value: 'Настройки профиля',
        onlyAdmin: false,
    },
    {
        props: {
            fullWidth: true,
            leftSection: <IconPlus size={'1rem'}/>,
            component: Link,
            href: PAGE_LINKS.NEW_PROFILE,
            variant: 'default',
        },
        value: 'Новый профиль',
        onlyAdmin: true,
    },
    {
        props: {
            fullWidth: true,
            leftSection: <IconList size={'1rem'}/>,
            component: Link,
            href: PAGE_LINKS.PROFILE_LIST,
            variant: 'default',
        },
        value: 'Список всех профилей',
        onlyAdmin: true,
    },
]

export default async function Home() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    const calcColumCount = (length: number, maxCount: number = 4) => {
        return length < maxCount ? (length % maxCount) : maxCount
    }

    const buttonsToRender = buttons.filter(b => !b.onlyAdmin || session.user.role === 'ADMIN')

    return <>
        <Container p={'md'}>
            <SimpleGrid cols={{
                base: 1,
                xs: calcColumCount(buttonsToRender.length, 2),
                md: calcColumCount(buttonsToRender.length),
            }}
                        mb={'lg'}>
                {buttonsToRender.map((b) => (
                        <Button key={b.value} {...b.props}>{b.value}</Button>
                ))}
            </SimpleGrid>
            <MessagesListModule/>
            <Group py={'md'}>
                <Button component={Link} href={PAGE_LINKS.STATS} variant="transparent" size={'xs'} color={'dark'}>Статистика бота (β)</Button>
            </Group>
        </Container>
    </>
}
