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
            router.replace(pathname)
        }
    }, [searchParams?.has('message')]);

    return <>
        <Notifications/>
        {children}
    </>
}