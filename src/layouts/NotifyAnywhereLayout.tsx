"use client"

import {PropsWithChildren, useEffect} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Notifications, showNotification} from "@mantine/notifications";

export function NotifyAnywhereLayout({children}: PropsWithChildren) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    useEffect(() => {
        if (searchParams.has('message')) {
            showNotification({
                id: 'global-message-' + searchParams.get('message'),
                message: searchParams.get('message'),
                color: searchParams.get('messageColor') || 'brand'
            })
            const sp = new URLSearchParams(searchParams.toString())
            sp.delete('message')
            sp.delete('messageColor')
            router.replace(pathname + (sp.size > 0 ? `?${sp.toString()}` : ''))
        }
    }, [searchParams?.has('message')]);

    return <>
        <Notifications/>
        {children}
    </>
}