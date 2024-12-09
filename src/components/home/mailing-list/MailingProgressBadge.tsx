'use client'

import {Badge} from "@mantine/core";
import useSWR from "swr";
import {MESSAGES_STATUS} from "@/types/swr-responses";
import {Mailing} from "@prisma/client";

export default function MailingProgressBadge({id}: { id: Mailing['id'] }) {
    const {data, isLoading} = useSWR<MESSAGES_STATUS>(
            `/api/messages/status`,
            {refreshInterval: 10 * 1000}
    )

    if (!data?.isRunning || data?.args?.id !== id) {
        return null;
    }

    return <Badge>
        {!data || isLoading
                ? 'Загрузка...'
                : `${(data.progress.current / data.progress.total * 100).toFixed(1)}%`}
    </Badge>
}