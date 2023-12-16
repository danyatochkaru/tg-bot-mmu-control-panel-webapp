import Link from "next/link";
import {PAGE_LINKS} from "@/constants/page-links";
import {Anchor, AnchorProps, Flex, Text} from "@mantine/core";
import {IconHandStop} from "@tabler/icons-react";

type Props = {
    id: string
    email: string
    short?: boolean
    isMe?: boolean
    isBanned?: boolean
}

export function ProfileName({isMe, isBanned, email, id, short, ...props}: Props & AnchorProps) {
    return <Anchor component={Link} href={PAGE_LINKS.PROFILE + '?id=' + id}
                   c={'black'}
                   title={email}
                   underline={'never'}

                   {...props}
    >
        <Flex gap={'xs'} align={'baseline'} w={'fit-content'}>
            {short ? email.split('@')[0] : email}
            {isMe && <Text span size={'0.7em'}>{' (Вы)'}</Text>}
            {isBanned && <IconHandStop size={'1em'} color={'red'} stroke={1.2}/>}
        </Flex>
    </Anchor>
}