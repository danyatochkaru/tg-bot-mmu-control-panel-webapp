import {Badge, Group, NumberFormatter, Skeleton, Text} from "@mantine/core";

export default function TotalInfoLoading() {
    return <Group gap={'xs'} align={'center'}>
        <Skeleton>
            <Text>Кол-во зарегистрированных пользователей:</Text>
        </Skeleton>
        <Skeleton>
            <Badge size={'lg'} autoContrast color="brand">
                <NumberFormatter
                        value={1000}
                        thousandSeparator=" "
                        decimalScale={2}
                        decimalSeparator="."
                />
            </Badge>
        </Skeleton>
    </Group>
}