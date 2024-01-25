import {Button, Group, Stack, Text, TextInput} from "@mantine/core";
import {SubmitActionButton} from "@/components/SubmitActionButton";
import Link from "next/link";
import {PAGE_LINKS} from "@/constants/page-links";
import {redirect} from "next/navigation";

async function createRecovery(fd: FormData) {
    'use server'

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/recovery`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: fd.get('email'),
        })
    })

    const url = new URL(process.env.NEXTAUTH_URL)

    if (res.ok) {
        url.pathname = PAGE_LINKS.LOGIN
        url.searchParams.set('message', 'Запрос отправлен. Пожалуйста, проверьте вашу почту')
        url.searchParams.set('messageColor', 'green')
    } else {
        const data = await res.json()
        url.pathname = PAGE_LINKS.RECOVERY
        url.searchParams.set('message', data.message || 'Произошла ошибка')
        url.searchParams.set('messageColor', 'red')
    }

    redirect(url.toString())
}

export function RecoveryForm() {
    return <form action={createRecovery}>
        <Text size={'lg'} fw={500}>Восстановление пароля</Text>
        <Stack py={'md'}>
            <Text size={'sm'}>Введите почту, на которую был зарегистрирован аккаунт</Text>
            <TextInput
                    name={'email'}
                    autoComplete={'email'}
                    label={'Почта'}
                    type={'email'}
                    placeholder={'Введите почту'}
            />
        </Stack>
        <Group w={'100%'} justify={'space-between'}>
            <Button href={PAGE_LINKS.LOGIN} variant={'outline'} component={Link}>Назад</Button>
            <SubmitActionButton label={'Восстановить'}/>
        </Group>
    </form>
}