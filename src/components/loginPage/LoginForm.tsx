"use client"

import {Button, Group, PasswordInput, Stack, Text, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {signIn} from "next-auth/react";
import {useState} from "react";
import {useToggle} from "@mantine/hooks";
import {useRouter, useSearchParams} from "next/navigation";

type LoginData = {
    email: string,
    password: string
}

export function LoginForm() {
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, toggleLoading] = useToggle()
    const router = useRouter()
    const searchParams = useSearchParams()

    const form = useForm<LoginData>({
        initialValues: {
            email: '',
            password: '',
        },
    })

    const handleSubmit = (v: LoginData) => {
        setGlobalError(null)
        toggleLoading(true)
        form.resetTouched()
        signIn('credentials', {...v, redirect: false})
                .then(res => {
                    if (res?.ok) {
                        router.push(searchParams.has('callbackUrl') ? searchParams.get('callbackUrl') ?? '/' : '/')
                    } else {
                        setGlobalError('Неверная почта или пароль')
                    }
                })
                .catch(err => {
                    setGlobalError('Произошла ошибка')
                    console.error(err)
                })
                .finally(() => {
                    toggleLoading(false)
                })
    }

    return <form onSubmit={form.onSubmit(handleSubmit)}>
        <Text size={'lg'} fw={500}>Авторизация</Text>
        <Stack py={'md'}>
            <TextInput
                    label={'Почта'}
                    type={'email'}
                    {...form.getInputProps('email')}
                    placeholder={'Введите почту'}
                    error={!!globalError && !form.isTouched('email')}
            />
            <PasswordInput
                    placeholder={'Введите пароль'}
                    {...form.getInputProps('password')}
                    label={'Пароль'}
                    error={!!globalError && !form.isTouched('password')}
            />
            {globalError && <Text size={'sm'} c={'red'} ta={'center'}>{globalError}</Text>}
        </Stack>
        <Group w={'100%'} justify={'center'}>
            <Button loading={loading} type={'submit'}>Войти</Button>
        </Group>
    </form>
}