'use client'

import {RichTextEditor} from "@mantine/tiptap";
import {useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Link} from "@tiptap/extension-link";
import {Underline} from "@tiptap/extension-underline";
import {Placeholder} from "@tiptap/extension-placeholder";
import {CharacterCount} from "@tiptap/extension-character-count";
import {NodeHtmlMarkdown} from "node-html-markdown";
import {UseFormReturnType} from "@mantine/form";
import {ActionIcon, Flex, Popover, Stack, Text} from "@mantine/core";
import {IconInfoSquare} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";

type Props<R = any> = {
    form: UseFormReturnType<R>,
    contentProperty: string,
    characterLimit?: number,
    placeholder?: string,
}

export default function RichMessageEditor<
        T extends Record<string, any>
                = Record<string, any>
>({
      contentProperty,
      form,
      characterLimit = 4000,
      placeholder = "Введите сообщение"
  }: Props<T>) {
    const [openedPopover, {close: closePopover, open: openPopover}] = useDisclosure(false);

    const editor = useEditor({
        content: form.values[contentProperty],
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({openOnClick: false}),
            Underline,
            Placeholder.configure({placeholder}),
            CharacterCount.configure({
                limit: characterLimit,
                mode: 'textSize',
            })
        ],
        onUpdate: ({editor}) => form.setFieldValue(
                contentProperty,
                NodeHtmlMarkdown.translate(editor.getHTML() as string),
        )
    })

    return <Stack gap={2}>
        <RichTextEditor
                editor={editor}
                labels={{
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
                }}
        >
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
        <Flex justify={'space-between'} my={2}>
            <Popover position="top-start"
                     offset={4}
                     opened={openedPopover}
            >
                <Popover.Dropdown style={{pointerEvents: 'none'}} bg={'dark'} c={'white'} p={'xs'}>
                    <Text size="sm">Shift + Enter - перенос на новую строку</Text>
                    <Text size="sm">Enter - новый абзац</Text>
                </Popover.Dropdown>
                <Popover.Target>
                    <ActionIcon onMouseEnter={openPopover} onMouseLeave={closePopover} variant={'subtle'}
                                size={'sm'} color={'gray'}>
                        <IconInfoSquare size={'1em'} stroke={1}/>
                    </ActionIcon>
                </Popover.Target>
            </Popover>
            <Text size={'sm'}
                  c={editor?.storage.characterCount.characters() > (characterLimit - characterLimit * 0.05)
                          ? editor?.storage.characterCount.characters() === characterLimit ? 'red' : 'red.4'
                          : 'gray.5'}
            >
                {editor?.storage.characterCount.characters()}/{characterLimit}
            </Text>
        </Flex>
    </Stack>
}