'use client'

import {Group, Loader, Stack} from "@mantine/core";
import Title from "@/components/Title";
import RichMessageEditor from "@/components/RichMessageEditor";
import {SubmitActionButton} from "@/components/SubmitActionButton";
import {useForm} from "@mantine/form";
import React, {useEffect} from "react";
import useSWR from "swr";
import {PAGE_LINKS} from "@/constants/page-links";
import {useToggle} from "@mantine/hooks";
import {useRouter} from "next/navigation";
import ServerData from "@/types/data";
import {NodeHtmlMarkdown} from "node-html-markdown";
import markdownit from 'markdown-it'


type FormValues = {
    message: string
}

const md = markdownit()


export default function FaqFormPage() {
    const [loading, toggleLoading] = useToggle()
    const router = useRouter()
    const {data: faqData, isValidating} = useSWR<ServerData[]>('/api/bot/faq', {
        revalidateIfStale: false,
        revalidateOnFocus: false
    });

    const form = useForm<FormValues>({
        initialValues: {
            message: ''
        }
    })

    useEffect(() => {
        if (faqData) {
            const faq = faqData.find(i => i.language === 'ru')
            form.setFieldValue('message', faq ? md.render(faq.value) : '')
        }
    }, [faqData]);

    useEffect(() => {
        toggleLoading(isValidating)

    }, [isValidating]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        fetch('/api/bot/faq', {
            method: 'POST',
            body: JSON.stringify({
                value: NodeHtmlMarkdown.translate(form.values.message)
            })
        })
                .then(res => {
                    let {ok} = res

                    res.json().then(data => {
                        if (ok) {
                            router.push(PAGE_LINKS.BOT + (data.message ? `?message=${data.message}&messageColor=green` : ''))
                        } else {
                            const message = data.message ?? 'Произошла неизвестаня ошибка'
                            router.push(PAGE_LINKS.BOT + `?message=${message}&messageColor=red`)

                        }
                    })
                })
                .finally(() => {
                    toggleLoading(false)
                })
    }


    return <form onSubmit={handleSubmit}>
        <Stack gap={'xs'}>
            <Title title={'FAQ'}/>
            {(faqData && !loading)
                    ? <RichMessageEditor<FormValues>
                            form={form}
                            contentProperty={'message'}
                            placeholder={'Введите сообщение для FAQ'}
                            disable={loading}
                            format={'html'}
                    />
                    : <Loader/>
            }
            <Group>
                <SubmitActionButton label={'Сохранить'}/>
            </Group>
        </Stack>
    </form>
}