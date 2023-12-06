"use client"

import {AppShell, Button, Container, Flex} from "@mantine/core";
import {useForm} from "@mantine/form";
import {RichTextEditor} from "@mantine/tiptap";
import {useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Link} from "@tiptap/extension-link";
import {Placeholder} from "@tiptap/extension-placeholder";
import {Underline} from "@tiptap/extension-underline";
import {useToggle} from "@mantine/hooks";
import {useRouter} from "next/navigation";
import {PAGES_LINK} from "@/constants/PAGES_LINK";
import {useFiltersStore} from "@/store/filters";

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
        onUpdate: ({editor}) => form.setFieldValue('message', editor.getHTML())
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
                            router.push(PAGES_LINK.HOME + (data.message ? `?message=${data.message}&messageColor=green` : ''))
                        } else {
                            const message = data.message ?? 'Произошла неизвестаня ошибка'
                            router.push(PAGES_LINK.NEW_MESSAGE_PRINTING + `&message=${message}&messageColor=red`)

                        }
                    })
                })
                .finally(() => {
                    toggleLoading(false)
                })
    }

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
        </Container>
        <AppShell.Footer>
            <Container>
                <Flex h={50} justify={'space-between'} align={'center'}>
                    <Button onClick={() => router.back()} variant={'default'}>Назад</Button>
                    <Button disabled={form.values['message'].trim() === ''}
                            loading={loading}
                            onClick={() => handleSubmit(form.values)}
                    >Отправить</Button>
                </Flex>
            </Container>
        </AppShell.Footer>
    </>
}