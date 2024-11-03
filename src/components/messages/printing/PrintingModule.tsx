"use client"

import {AppShell, Button, Container, Flex, Progress, Stack, Switch, Text} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useToggle} from "@mantine/hooks";
import {useRouter} from "next/navigation";
import {useFiltersStore} from "@/store/filters";
import useSWR from "swr";
import endingByNum from "@/utils/endingByNum";
import RichMessageEditor from "@/components/RichMessageEditor";
import {PAGE_LINKS} from "@/constants/page-links";

type FormValues = {
    message: string
    doLinkPreview: boolean
}

export default function PrintingModule() {
    const [loading, toggleLoading] = useToggle()
    const router = useRouter()
    const selectedGroups = useFiltersStore(state => state.selectedGroups)
    const form = useForm<FormValues>({
        initialValues: {
            message: '',
            doLinkPreview: false
        }
    })

    const handleSubmit = (values: FormValues) => {
        toggleLoading(true)
        fetch(`/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...values, recipients: selectedGroups}),
        })
                .then(res => {
                    let {ok} = res

                    res.json().then(data => {
                        if (ok) {
                            router.push(PAGE_LINKS.HOME + (data.message ? `?message=${data.message}&messageColor=green` : ''))
                        } else {
                            const message = data.message ?? 'Произошла неизвестаня ошибка'
                            router.push(PAGE_LINKS.NEW_MESSAGE_PRINTING + `&message=${message}&messageColor=red`)

                        }
                    })
                })
                .finally(() => {
                    toggleLoading(false)
                })
    }

    const {data, isLoading} = useSWR<{
        isRunning: boolean
        progress: {
            current: number
            total: number
            rejected: number
        }
    }>(
            `/api/messages/status`,
            {refreshInterval: 5 * 1000}
    )
    const {data: usersCount} = useSWR<{
        groups: Record<string, number>,
        inactive: number,
        total: number
    }>(
            `/api/users/countbygroups?groups=${selectedGroups.join(',')}`,
            {refreshInterval: 5 * 60 * 1000}
    )

    return <>
        <Container p={'md'}>
            <RichMessageEditor form={form} contentProperty={'message'}/>
            <Flex my={'md'}>
                <Switch checked={form.values.doLinkPreview}
                        onChange={(event) => form.setFieldValue('doLinkPreview', event.currentTarget.checked)}
                        label={'Предпросмотр ссылок'}/>
            </Flex>
            {data
                    ? <Stack my={'md'}>

                        <Text>
                            {`В данный момент ${data?.isRunning ? 'идёт рассылка' : 'можно запустить рассылку'}`}
                        </Text>
                        {(!isLoading && data?.isRunning)
                                && <Stack gap={2}>
                                    <Text
                                            size={'xs'}>{`${(data?.progress.current! / data?.progress.total! * 100).toFixed(1)}%`}</Text>
                                    <Progress
                                            value={parseFloat((data?.progress.current! / data?.progress.total! * 100).toFixed(1))}
                                            animated
                                    />
                                </Stack>}
                        <Text size={'sm'} hidden={isLoading || data?.progress?.rejected! == 0}>
                            {`Не удалось отправить ${data?.progress?.rejected} ${endingByNum(data?.progress?.rejected!, ['человеку', 'людям', 'человек'])}`}
                        </Text>
                        <Text hidden={!usersCount}>
                            {`Сообщение будет отправлено ${
                                    usersCount
                                            ? (usersCount.total - usersCount.inactive)
                                            : 0} ${
                                    endingByNum(usersCount
                                            ? (usersCount.total - usersCount.inactive)
                                            : 0, ['человеку', 'людям', 'человек'])}`}
                        </Text>
                    </Stack>
                    : <Text my={'md'}>Получение статуса...</Text>}
        </Container>
        <AppShell.Footer bg={'gray.0'}>
            <Container>
                <Flex h={50} justify={'space-between'} align={'center'}>
                    <Button onClick={() => router.back()} variant={'default'}>Назад</Button>
                    <Button disabled={form.values['message'].trim() === '' || data?.isRunning}
                            loading={loading}
                            onClick={() => handleSubmit(form.values)}
                    >Отправить</Button>
                </Flex>
            </Container>
        </AppShell.Footer>
    </>
}