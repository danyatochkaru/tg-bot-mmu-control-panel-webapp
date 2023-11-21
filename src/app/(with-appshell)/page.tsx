import {Button, ButtonProps, Container, Grid, GridCol} from "@mantine/core";
import Link from "next/link";
import {IconHistory, IconPlus, IconSettings} from "@tabler/icons-react";
import {PAGES_LINK} from "@/constants/PAGES_LINK";

export default function Home() {
    const buttons: { props: ButtonProps & Record<string, any>, value: string }[] = [
        {
            props: {
                fullWidth: true,
                leftSection: <IconPlus size={'1rem'}/>,
                component: Link,
                href: PAGES_LINK.NEW_NOTIFY
            },
            value: 'Новая рассылка'
        },
        {
            props: {
                fullWidth: true,
                leftSection: <IconHistory size={'1rem'}/>,
                disabled: true,
                title: 'В разработке'
            },
            value: 'История рассылок'
        },
        {
            props: {
                fullWidth: true,
                leftSection: <IconPlus size={'1rem'}/>,
                component: Link,
                href: PAGES_LINK.NEW_PROFILE,
                variant: 'default',
            },
            value: 'Новый пользователь'
        },
        {
            props: {
                fullWidth: true,
                leftSection: <IconSettings size={'1rem'}/>,
                disabled: true,
                variant: 'default',
                title: 'В разработке',
            },
            value: 'Настройки профиля'
        },

    ]

    return <Container p={'md'}>
        <Grid>
            {buttons.map((b, index) => (
                    <GridCol key={index} span={{base: 12, xs: 6, md: 3}}>
                        <Button {...b.props}>{b.value}</Button>
                    </GridCol>
            ))}
        </Grid>
    </Container>
}
