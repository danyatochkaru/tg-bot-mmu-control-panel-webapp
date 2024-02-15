'use client'

import {
    Badge,
    Button,
    Group,
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
import ruLocale from "date-fns/locale/ru";
import {useSession} from "next-auth/react";
import remarkGfm from "remark-gfm";

type Props = {
    message: string,
    recipients: { groupOid: number, name: string }[],
    sender: { id: string, email: string, banned: Date | null },
    createdAt: Date
}

export function MessagesListItem({message, recipients, sender, createdAt}: Props) {
    const {data: session} = useSession()

    return <Stack gap={2}>
        <Paper withBorder p={'xs'} bg={'gray.0'}>
            <TypographyStylesProvider className={'message'} styles={{
                root: {margin: 0, padding: 0},
            }}>
                <Markdown remarkPlugins={[remarkGfm]}>
                    {message}
                </Markdown>
            </TypographyStylesProvider>
        </Paper>
        <Group justify={'space-between'} gap={4} wrap={'wrap-reverse'}>
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