'use client'

import {Button, Group, Indicator, Paper, Stack, Text, TypographyStylesProvider} from "@mantine/core";
import Markdown from "react-markdown";
import {useModals} from "@mantine/modals";
import {ProfileName} from "@/components/ProfileName";
import {formatRelative} from "date-fns";
import {useSession} from "next-auth/react";
import remarkGfm from "remark-gfm";
import {ru as ruLocale} from "date-fns/locale/ru";
import {Mailing, Profile} from "@prisma/client";
import dynamic from "next/dynamic";
import MailingDetailsModal from "@/components/home/detail-modal/MailingDetailsModal";

const MailingProgressBadge = dynamic(() => import("@/components/home/mailing-list/MailingProgressBadge"), {ssr: false})

type Props = {
    data: Mailing,
    sender: Profile,
    recipients: { groupOid: number, name: string }[],
}

export function MessagesListItem({recipients, sender, data}: Props) {
    const {data: session} = useSession()
    const {openModal, modals} = useModals()


    return <Stack gap={2}>
        <Indicator
                color={
                    data.status === 'COMPLETED'
                            ? 'green' : data.status === 'CANCELLED'
                                    ? 'red' : 'brand'
                }
                inline
                withBorder
                size={14}
                offset={2}
                zIndex={10}
                processing={data.status === 'PROCESSING'}
        >
            <Paper withBorder p={'xs'} bg={'gray.0'}>
                <TypographyStylesProvider className={'message'} styles={{
                    root: {margin: 0, padding: 0},
                }}>
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {data.message}
                    </Markdown>
                </TypographyStylesProvider>
            </Paper>
        </Indicator>
        <Group justify={'space-between'} gap={4} wrap={'wrap-reverse'}>
            <Group gap={4} align='center'>
                <Button size={'compact-sm'}
                        variant={'subtle'}
                        onClick={() => {
                            openModal({
                                title: `Информация о рассылке`,
                                modalId: 'mailing-details',
                                overlayProps: {
                                    backgroundOpacity: 0.55,
                                    blur: 3,
                                },
                                size: 'md',
                                children: <MailingDetailsModal
                                        id={data.id}
                                        recipients={recipients}
                                        status={data.status}
                                        total={data.total}
                                        failed={data.failed}
                                />
                            })
                        }}>
                    Подробнее
                </Button>
                {data.status === 'PROCESSING'
                        && modals.every(i => i.id !== 'mailing-details')
                        && <MailingProgressBadge id={data.id}/>}
            </Group>
            <Group>
                <ProfileName id={sender.id} email={sender.email}
                             isMe={sender.id === session?.user.sub}
                             isBanned={!!sender.banned}
                             size={'sm'}
                             short
                />
                <Text size={'sm'}
                      title={new Date(data.createdAt).toLocaleString('ru', {})}
                >{
                    formatRelative(new Date(data.createdAt), new Date(), {
                        locale: ruLocale,
                    })
                }</Text>
            </Group>
        </Group>
    </Stack>
}