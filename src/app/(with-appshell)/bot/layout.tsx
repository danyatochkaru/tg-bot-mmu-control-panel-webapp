import {Container} from "@mantine/core";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import React from "react";
import Title from "@/components/Title";

export default async function BotLayout(props: {
    faqform: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return redirect(PAGE_LINKS.LOGIN)
    }

    return <Container p={'md'}>
        <Title title={'Настройка бота'}/>
        {props.faqform}
    </Container>
}