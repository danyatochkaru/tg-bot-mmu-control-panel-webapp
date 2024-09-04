import {Group, GroupProps, Text} from "@mantine/core";

type Props = {
    title: string,
    subtitle?: string,
}

export default function Title({title, subtitle, ...groupProps}: Props & GroupProps) {
    return <Group align={'baseline'} gap={'xs'} {...groupProps}>
        <Text fw={700} size={'lg'}>{title}</Text>
        {subtitle && <Text size={'sm'}>{subtitle}</Text>}
    </Group>
}