"use client"

import {AppShell, Button, Container, Flex} from "@mantine/core";
import {useForm} from "@mantine/form";
import {RichTextEditor} from "@mantine/tiptap";
import {useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Link} from "@tiptap/extension-link";
import {Placeholder} from "@tiptap/extension-placeholder";
import {Underline} from "@tiptap/extension-underline";
import TurndownService from 'turndown'
import {useToggle} from "@mantine/hooks";
import {useRouter} from "next/navigation";
import {PAGES_LINK} from "@/constants/PAGES_LINK";
import {useFiltersStore} from "@/store/filters";

type FormValues = {
    message: string
}

const tdService = new TurndownService()
tdService.remove('p')
tdService.addRule('underline', {
    filter: ['u'],
    replacement: function (content) {
        return `__${content}__`
    }
})
tdService.addRule('bold', {
    filter: ['strong'],
    replacement: function (content) {
        return `*${content}*`
    }
})
tdService.addRule('italic', {
    filter: ['em'],
    replacement: function (content) {
        return `_${content}_`
    }
})

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
        onUpdate: ({editor}) => form.setFieldValue('message', tdService.turndown(editor.getHTML()))
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
                            router.push(PAGES_LINK.NEW_NOTIFY_PRINTING + `&message=${message}&messageColor=red`)

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
            {/*<Textarea*/}
            {/*        value={form.values['message']}*/}
            {/*        autosize*/}
            {/*/>*/}
        </Container>
        <AppShell.Footer>
            <Container>
                <Flex h={50} justify={'flex-end'} align={'center'}>
                    <Button disabled={form.values['message'].trim() === ''}
                            loading={loading}
                            onClick={() => handleSubmit(form.values)}
                    >Отправить</Button>
                </Flex>
            </Container>
        </AppShell.Footer>
    </>
}