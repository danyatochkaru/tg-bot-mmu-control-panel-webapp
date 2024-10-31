import {Badge, Group, NumberFormatter, Stack, Text} from "@mantine/core";
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
                    <Text title={"Кол-во пользователей, которые запретили отпраку сообщений от бота"}>Кол-во неактивных
                        пользователей:</Text>
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