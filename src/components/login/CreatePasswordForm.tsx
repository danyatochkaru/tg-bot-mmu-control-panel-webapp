"use client"

import {Button, Group, PasswordInput, Stack, Text} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useState} from "react";
import {useToggle} from "@mantine/hooks";
import {useRouter, useSearchParams} from "next/navigation";
import {showNotification} from "@mantine/notifications";
import {PAGE_LINKS} from "@/constants/page-links";

type CreatePasswordData = {
    password: string
    confirmPassword: string
}

export default function CreatePasswordForm() {
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, toggleLoading] = useToggle()
    const router = useRouter()
    const searchParams = useSearchParams()

    const form = useForm<CreatePasswordData>({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            confirmPassword: (_, values) => values.password !== values.confirmPassword ? "Парооли не совпадают" : null
        }
    })

    const handleSubmit = (v: CreatePasswordData) => {
        setGlobalError(null)
        toggleLoading(true)
        form.resetTouched()
        fetch('/api/requests/confirm', {
            method: 'PATCH',
            body: JSON.stringify({password: v.password, token: searchParams.get('token')}),
        })
                .then(res => {
                    if (res?.ok) {
                        showNotification({
                            title: 'Вы успешно зарегистрированы',
                            message: 'Для продолжения войдите в профиль',
                            color: 'brand'
                        })
                        router.push(PAGE_LINKS.LOGIN)
                    } else {
                        res.json().then(r => {
                            setGlobalError(r.message || 'Пароль недостаточно сложный')
                        })
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
        <Text size={'lg'} fw={500}>Добро пожаловать!</Text>
        <Text size={'md'} fw={400}>Для завершения регистрации придумайте пароль</Text>
        <Stack py={'md'}>
            <PasswordInput
                    placeholder={'Придумайте пароль'}
                    {...form.getInputProps('password')}
                    label={'Пароль'}
                    // error={!!globalError && !form.isTouched('password')}
            />
            <PasswordInput
                    placeholder={'Повторите пароль'}
                    {...form.getInputProps('confirmPassword')}
                    label={'Подтверждение пароля'}
                    // error={form.errors.confirmPassword || (!!globalError && !form.isTouched('confirmPassword'))}
            />
            {globalError && <Text size={'sm'} c={'red'} ta={'center'}>{globalError}</Text>}
        </Stack>
        <Group w={'100%'} justify={'center'}>
            <Button loading={loading} type={'submit'}>Продолжить</Button>
        </Group>
    </form>
}