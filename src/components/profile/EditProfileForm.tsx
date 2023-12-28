"use client"

import {useForm} from "@mantine/form";
import {Button, Flex, Group, PasswordInput, Select, Stack, Text, TextInput} from "@mantine/core";
import {Profile, Role} from "@prisma/client";
import {useRouter, useSearchParams} from "next/navigation";
import {useToggle} from "@mantine/hooks";
import {useSession} from "next-auth/react";

type FormValues = {
    email: string
    role: Role
    new_password: string
    repeat_new_password: string
    submit_password: string
}

const rolesName: Record<Role, string> = {
    ADMIN: 'Администратор',
    USER: 'Пользователь',
}

export function EditProfileForm({initValues, id, isSameProfile = false, banned = false}:
                                        {
                                            initValues?: Pick<FormValues, 'role' | 'email'>,
                                            id: string,
                                            isSameProfile?: boolean
                                            banned?: boolean
                                        }) {
    const {update} = useSession()
    const form = useForm<FormValues>({
        initialValues: {
            email: '',
            role: 'USER',
            new_password: '',
            repeat_new_password: '',
            submit_password: '',
            ...initValues,
        },
        validate: {
            new_password: (value, values) => value !== values.repeat_new_password ? 'Пароли не совпадают' : null,
            repeat_new_password: (value, values) => value !== values.new_password ? 'Пароли не совпадают' : null,
        }
    })
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, toggleLoading] = useToggle()

    const handleSubmit = (values: FormValues) => {
        toggleLoading(true)
        fetch('/api/users/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'applications/json',
            },
            body: JSON.stringify({
                email: values.email,
                password: values.submit_password || undefined,
                new_password: values.new_password || undefined,
                role: values.role !== initValues?.role ? values.role : undefined,
            } as Partial<Profile> & {
                new_password?: string
                role?: Role
            })
        })
                .then((res) => {
                    const {ok} = res
                    res.json().then(data => {
                        if (data.message) {
                            const sp = new URLSearchParams(searchParams.toString())
                            sp.append('message', data.message)
                            sp.append('messageColor', ok ? 'green' : 'red')
                            router.replace(`?${sp.toString()}`)
                        }
                        if (ok) {
                            if (data.profile) {
                                const profile = data.profile as Profile
                                form.setInitialValues({
                                    email: profile.email,
                                    role: profile.Role,
                                    new_password: '',
                                    submit_password: '',
                                    repeat_new_password: '',
                                })

                                if (isSameProfile) {
                                    update({
                                        user: {
                                            email: profile.email,
                                            role: profile.Role,
                                        }
                                    })
                                }
                            }
                            form.reset()
                        } else {
                            console.error(data)
                        }
                    })
                })
                .finally(() => {
                    toggleLoading(false)
                })
    }

    return <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
            <Group gap={0}>
                <Text fw={700} size={'lg'}>Настройки профиля</Text>
                {!isSameProfile && <Text c={'red.4'} size={'sm'}>Вы изменяете чужой профиль</Text>}
            </Group>
            <Select
                    label={isSameProfile ? 'Ваша роль' : 'Роль данного профиля'}
                    data={[
                        {label: rolesName['USER'], value: 'USER'},
                        {label: rolesName['ADMIN'], value: 'ADMIN'},
                    ] as { label: string, value: Role }[]}
                    readOnly={(isSameProfile && initValues?.role === 'USER')}
                    description={
                            (isSameProfile && initValues?.role === 'USER' && 'Вы не можете изменять этот параметр')
                            || 'Изменение данного параметра должно быть осознанным'
                    }
                    allowDeselect={false}
                    {...form.getInputProps('role')}
            />
            <TextInput
                    label={'Почта'}
                    placeholder={'Введите почту'}
                    required
                    autoComplete={'email'}
                    {...form.getInputProps('email')}
            />
            <PasswordInput
                    label={'Новый пароль'}
                    placeholder={'Введите новый пароль'}
                    autoComplete={'new-password'}
                    {...form.getInputProps('new_password')}
            />
            <PasswordInput
                    label={'Повторите новый пароль'}
                    placeholder={'Повторите новый пароль'}
                    autoComplete={'new-password'}
                    {...form.getInputProps('repeat_new_password')}
            />
            {isSameProfile && <PasswordInput
                    label={'Старый пароль'}
                    placeholder={'Введите старый пароль'}
                    required
                    autoComplete={'off'}
                    {...form.getInputProps('submit_password')}
            />}
            <Flex direction={'column'} align={'center'} gap={'lg'}>
                <Button loading={loading} disabled={!form.isDirty()} type={'submit'}>Сохранить</Button>
                {!isSameProfile &&
                        <Button disabled
                                color={banned ? 'green' : 'red'}>{banned ? 'Разблокировать' : 'Заблокировать'}</Button>}
            </Flex>
        </Stack>
    </form>
}