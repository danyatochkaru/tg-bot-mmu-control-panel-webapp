"use client"

import {AppShell, Button, Container, Flex, Progress, Stack, Text} from "@mantine/core";
import {useForm} from "@mantine/form";
import {RichTextEditor} from "@mantine/tiptap";
import {useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Link} from "@tiptap/extension-link";
import {Placeholder} from "@tiptap/extension-placeholder";
import {Underline} from "@tiptap/extension-underline";
import {useToggle} from "@mantine/hooks";
import {useRouter} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";
import {useFiltersStore} from "@/store/filters";
import {NodeHtmlMarkdown} from "node-html-markdown";
import useSWR from "swr";
import {useEffect} from "react";
import endingByNum from "@/utils/endingByNum";

type FormValues = {
    message: string
}

export function PrintingModule() {
    const [loading, toggleLoading] = useToggle()
    const router = useRouter()
    const selectedGroups = useFiltersStore(state => state.selectedGroups)
    const form = useForm<FormValues>({
        initialValues: {
            message: '',
        }
    })
    const editor = useEditor({
        content: form.values['message'],
        extensions: [
            StarterKit,
            Link.configure({openOnClick: false}),
            Underline,
            Placeholder.configure({placeholder: 'Введите сообщение'})
        ],
        onUpdate: ({editor}) => form.setFieldValue('message', NodeHtmlMarkdown.translate(editor.getHTML()))
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
        total: number
    }>(
            `/api/users/countbygroups?groups=${selectedGroups.join(',')}`,
            {refreshInterval: 5 * 60 * 1000}
    )


    useEffect(() => {
        console.log(data, isLoading)
    }, [data, isLoading]);

    return <>
        <Container p={'md'}>
            <RichTextEditor editor={editor} labels={{
                linkEditorSave: 'Вставить',
                linkEditorExternalLink: 'Открывать в новой вкладке',
                linkEditorInternalLink: 'Открывать в той же вкладке',
                linkEditorInputPlaceholder: 'Вставьте ссылку',
                linkControlLabel: 'Ссылка',
                unlinkControlLabel: 'Удалить ссылку',
                boldControlLabel: 'Жирный',
                italicControlLabel: 'Наклонный',
                underlineControlLabel: 'Подчёркнутый',
                strikeControlLabel: 'Зачёркнутый',
                clearFormattingControlLabel: 'Очистить стиль',
                codeControlLabel: 'Код (однострочный)'
            }}>
                <RichTextEditor.Toolbar>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold/>
                        <RichTextEditor.Italic/>
                        <RichTextEditor.Underline/>
                        <RichTextEditor.Strikethrough/>
                        <RichTextEditor.ClearFormatting/>
                        <RichTextEditor.Code/>
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link/>
                        <RichTextEditor.Unlink/>
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content/>
            </RichTextEditor>
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
                        <Text hidden={!usersCount}>
                            {`Сообщение будет отправлено ${usersCount?.total} ${endingByNum(usersCount?.total ?? 0, ['человеку', 'людям', 'человек'])}`}
                        </Text>
                        <Text size={'sm'} hidden={isLoading || data?.progress?.rejected! == 0}>
                            {`Не удалось отправить ${data?.progress?.rejected} ${endingByNum(data?.progress?.rejected!, ['человеку', 'людям', 'человек'])}`}
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