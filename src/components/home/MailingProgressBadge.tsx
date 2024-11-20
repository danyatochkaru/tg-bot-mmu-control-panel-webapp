'use client'

import {Badge} from "@mantine/core";
import useSWR from "swr";

export default function MailingProgressBadge() {
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

    if (!data?.isRunning) {
        return null;
    }

    return <Badge>
        {!data || isLoading
                ? 'Загрузка...'
                : `${(data.progress.current / data.progress.total * 100).toFixed(1)}%`}
    </Badge>
}