'use client'

import {useFormState} from 'react-dom'
import {Group, Mark, PasswordInput, Stack, Text} from "@mantine/core";
import {SubmitActionButton} from "@/components/SubmitActionButton";
import {updatePasswordRecovery} from './UpdatePasswordRecovery'

export function ChangePasswordForm({email, token}: { email: string, token: string }) {
    const [state, formAction] = useFormState(updatePasswordRecovery, {message: ''})

    return <form action={formAction}>
        <Text size={'lg'} fw={500}>Восстановление пароля</Text>
        <Stack py={'md'}>
            <Text size={'sm'}>Придумайте новый пароль для входа в аккаунт <Mark>{email}</Mark></Text>
            <input type={'hidden'} name={'token'} value={token}/>
            <PasswordInput
                    name={'password'}
                    placeholder={'Придумайте пароль'}
                    label={'Новый пароль'}
                    required
                    minLength={5}
                    autoComplete={'new-password'}
            />
            <PasswordInput
                    name={'confirmPassword'}
                    placeholder={'Повторите пароль'}
                    label={'Подтверждение пароля'}
                    required
                    minLength={5}
                    autoComplete={'new-password'}
            />
            {state?.message && <Text size={'sm'} c={'red'} ta={'center'}>{state?.message}</Text>}
        </Stack>
        <Group w={'100%'} justify={'center'}>
            <SubmitActionButton label={'Продолжить'}/>
        </Group>
    </form>;
}