import {PropsWithChildren} from "react";
import {AppShell, AppShellHeader, AppShellMain} from "@mantine/core";
import {HeaderContent} from "@/components/HeaderContent";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {PAGE_LINKS} from "@/constants/page-links";
import {redirect} from "next/navigation";

export default async function Layout({children}: PropsWithChildren) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect(PAGE_LINKS.LOGIN)
    }
    return <AppShell
            header={{height: 50}}
            footer={{height: 50}}
    >
        <AppShellHeader bg={'gray.0'}><HeaderContent/></AppShellHeader>
        <AppShellMain>
            {children}
        </AppShellMain>
    </AppShell>
}