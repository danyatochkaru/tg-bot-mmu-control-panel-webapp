'use client'

import {
    Badge,
    Button,
    Group,
    Indicator,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    TypographyStylesProvider
} from "@mantine/core";
import Markdown from "react-markdown";
import {modals} from "@mantine/modals";
import {ProfileName} from "@/components/ProfileName";
import {formatRelative} from "date-fns";
import {useSession} from "next-auth/react";
import remarkGfm from "remark-gfm";
import {ru as ruLocale} from "date-fns/locale/ru";
import {MailingStatus} from "@prisma/client";
import dynamic from "next/dynamic";

const MailingProgressBadge = dynamic(() => import("@/components/home/MailingProgressBadge"), {ssr: false})


type Props = {
    message: string,
    status?: MailingStatus
    recipients: { groupOid: number, name: string }[],
    sender: { id: string, email: string, banned: Date | null },
    createdAt: Date
}

export function MessagesListItem({message, status, recipients, sender, createdAt}: Props) {
    const {data: session} = useSession()

    const statusTest = {
        [MailingStatus.PROCESSING]: 'В процессе',
        [MailingStatus.COMPLETED]: 'Завершено',
        [MailingStatus.CANCELLED]: 'Отменено',
    }

    return <Stack gap={2}>
        <Indicator
                color={
                    status === 'COMPLETED'
                            ? 'green' : status === 'CANCELLED'
                                    ? 'red' : 'brand'
                }
                inline
                withBorder
                size={14}
                offset={2}
                processing={status === 'PROCESSING'}
                title={statusTest[status!]}
        >
            <Paper withBorder p={'xs'} bg={'gray.0'}>
                <TypographyStylesProvider className={'message'} styles={{
                    root: {margin: 0, padding: 0},
                }}>
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {message}
                    </Markdown>
                </TypographyStylesProvider>
            </Paper>
        </Indicator>
        <Group justify={'space-between'} gap={4} wrap={'wrap-reverse'}>
            <Group gap={4} align='center'>
                <Button size={'compact-sm'}
                        variant={'subtle'}
                        onClick={() => modals.open({
                            title: `Список групп (всего: ${recipients.length})`,
                            modalId: 'groups-list',
                            children: <ScrollArea.Autosize mah={400}>
                                <SimpleGrid cols={{base: 3, xs: 4}} spacing={'xs'}>
                                    {
                                        recipients.map(item => (
                                                <Badge key={item.groupOid}
                                                       variant={'outline'}>{item.name}</Badge>)
                                        )
                                    }
                                </SimpleGrid>
                            </ScrollArea.Autosize>
                        })}>
                    Список групп
                </Button>
                {status === 'PROCESSING' && <MailingProgressBadge/>}
            </Group>
            <Group>
                <ProfileName id={sender.id} email={sender.email}
                             isMe={sender.id === session?.user.sub}
                             isBanned={!!sender.banned}
                             size={'sm'}
                             short
                />
                <Text size={'sm'}
                      title={new Date(createdAt).toLocaleString('ru', {})}
                >{
                    formatRelative(new Date(createdAt), new Date(), {
                        locale: ruLocale,
                    })
                }</Text>
            </Group>
        </Group>
    </Stack>
}