"use client"

import {useFormStatus} from 'react-dom'
import {Button} from "@mantine/core";

export function SubmitActionButton({label}: { label: string }) {
    const {pending} = useFormStatus()
    return <Button loading={pending} type={'submit'}>{label}</Button>
}