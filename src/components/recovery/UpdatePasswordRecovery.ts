'use server'

import {PAGE_LINKS} from "@/constants/page-links";
import {redirect} from "next/navigation";

export async function updatePasswordRecovery(state: { message: string }, formData: FormData) {
    if (formData.get('password') !== formData.get('confirmPassword')) {
        return {message: 'Пароли не совпадают'}
    }

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/recovery`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: formData.get('token'),
            password: formData.get('confirmPassword'),
        }),
        cache: 'no-store'
    })

    const url = new URL(process.env.NEXTAUTH_URL)

    if (res.ok) {
        url.pathname = PAGE_LINKS.LOGIN
        url.searchParams.set('message', 'Пароль изменён. Вы можете войти в профиль с новым паролем')
        url.searchParams.set('messageColor', 'green')
    } else {
        const data = await res?.json()
        url.pathname = PAGE_LINKS.RECOVERY
        url.searchParams.set('message', data.message || 'Произошла ошибка')
        url.searchParams.set('messageColor', 'red')
        url.searchParams.set('token', formData.get('token') as string)
    }

    redirect(url.toString())
}