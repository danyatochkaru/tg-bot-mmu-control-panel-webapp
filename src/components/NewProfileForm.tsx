"use client"

import {Button, Group, Stack, Text, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useToggle} from "@mantine/hooks";
import {useRouter} from "next/navigation";
import {showNotification} from "@mantine/notifications";

type NewProfileData = {
    email: string
}

export function NewProfileForm() {
    const [loading, toggleLoading] = useToggle()
    const router = useRouter()

    const form = useForm<NewProfileData>({
        initialValues: {
            email: '',
        },
    })

    const handleSubmit = (v: NewProfileData) => {
        toggleLoading(true)
        form.resetTouched()
        fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(v)
        })
                .then(res => {
                    if (res?.ok) {
                        showNotification({
                            message: 'Заявка отправлена',
                            color: 'green',
                            withBorder: true,
                        })
                        router.push('/')
                    } else {
                        res.json().then(data => {
                            form.setFieldError('email', data?.message || "Произошла ошибка")
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                    form.setFieldError('email', 'Произошла ошибка')
                })
                .finally(() => {
                    toggleLoading(false)
                })
    }

    return <form onSubmit={form.onSubmit(handleSubmit)}>
        <Text size={'lg'} fw={500}>Отправка запроса на регистрацию</Text>
        <Stack py={'md'}>
            <TextInput
                    label={'Почта'}
                    type={'email'}
                    {...form.getInputProps('email')}
                    placeholder={'Введите почту'}
            />
        </Stack>
        <Group w={'100%'} justify={'center'}>
            <Button loading={loading} type={'submit'}>Отправить</Button>
        </Group>
    </form>
}