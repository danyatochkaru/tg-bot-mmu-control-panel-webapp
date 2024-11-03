import {Badge, Group, NumberFormatter, Stack, Text, Tooltip} from "@mantine/core";
import {UsersCountResponse} from "@/types/stats";

export default async function TotalInfoPage() {
    const total: {
        data: UsersCountResponse
    } = await fetch(`${process.env.BOT_API_HOST}/info/users/count`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BOT_AUTH_TOKEN}`,
        }
    }).then(i => i.json())

    return <Stack gap={'xs'}>
        <Group gap={'xs'} align={'center'}>
            <Text>Кол-во зарегистрированных пользователей:</Text>
            <Badge size={'lg'} autoContrast color="brand">
                <NumberFormatter
                        value={total.data.total_count}
                        thousandSeparator=" "
                        decimalScale={2}
                        decimalSeparator="."
                />
            </Badge>
        </Group>
        {!!total.data.total_inactive &&
                <Group gap={'xs'} align={'center'}>
                    <Tooltip position={'bottom-start'}
                             multiline
                             w={220}
                             transitionProps={{duration: 320}}
                             label={'Неактивными считаются пользователи, запретившие отправку сообщений от бота'}>
                        <Text>Кол-во
                            неактивных
                            пользователей:</Text>
                    </Tooltip>
                    <Badge size={'lg'} autoContrast color="brand">
                        <NumberFormatter
                                value={total.data.total_inactive}
                                thousandSeparator=" "
                                decimalScale={2}
                                decimalSeparator="."
                        />
                    </Badge>
                </Group>
        }
    </Stack>
}