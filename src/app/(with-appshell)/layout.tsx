import {PropsWithChildren} from "react";
import {AppShell, AppShellHeader, AppShellMain} from "@mantine/core";
import {HeaderContent} from "@/components/HeaderContent";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {PAGES_LINK} from "@/constants/PAGES_LINK";
import {redirect} from "next/navigation";

export default async function Layout({children}: PropsWithChildren) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect(PAGES_LINK.LOGIN)
    }
    return <AppShell
            header={{height: 50}}
            footer={{height: 50}}
    >
        <AppShellHeader><HeaderContent/></AppShellHeader>
        <AppShellMain>
            {children}
        </AppShellMain>
    </AppShell>
}