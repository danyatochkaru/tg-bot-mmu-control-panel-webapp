import {Mailing, Profile} from "@prisma/client";

export type MESSAGES = {
    messages: (Mailing & { sender: Profile })[],
    count: number
}

export type MESSAGES_STATUS = {
    args: {
        id: string;
        groupList: number[];
        text: string;
        options?: {
            doLinkPreview?: boolean;
        };
    } | null,
    isRunning: boolean
    progress: {
        current: number
        total: number
        rejected: number
    }
}

export type USERS_COUNT_BY_GROUP = {
    groups: Record<string, number>,
    inactive: number,
    total: number
}