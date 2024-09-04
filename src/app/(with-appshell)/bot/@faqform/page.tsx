'use client'

import {Group, Stack} from "@mantine/core";
import Title from "@/components/Title";
import RichMessageEditor from "@/components/RichMessageEditor";
import {SubmitActionButton} from "@/components/SubmitActionButton";
import {useForm} from "@mantine/form";
import React from "react";


type FormValues = {
    message: string
}

export default function FaqFormPage() {
    const form = useForm<FormValues>({
        initialValues: {
            message: ''
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(form.values.message)
    }


    return <form onSubmit={handleSubmit}>
        <Stack gap={'xs'}>
            <Title title={'FAQ'}/>
            <RichMessageEditor<FormValues>
                    form={form}
                    contentProperty={'message'}
                    placeholder={'Введите сообщение для FAQ'}
            />
            <Group>
                <SubmitActionButton label={'Сохранить'}/>
            </Group>
        </Stack>
    </form>
}