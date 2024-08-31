import {Badge, Group, NumberFormatter, Text} from "@mantine/core";
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

    return <Group gap={'xs'} align={'center'}>
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
}