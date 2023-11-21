"use client"

import {Button, Group, Skeleton, Text} from "@mantine/core";
import {IconDoorExit} from "@tabler/icons-react";
import {signOut, useSession} from "next-auth/react";

export function LogoutButton() {
    const {status, data: session} = useSession()
    return (
            <Skeleton w={'fit-content'} visible={status !== 'authenticated'}>
                <Group visibleFrom={'sm'}>
                    <Text>{session?.user?.email ? session.user.email.split('@')[0] : 'Польователь'}</Text>
                    <Button rightSection={<IconDoorExit size={'1em'}/>}
                            color={'red'}
                            variant={'outline'}
                            size={'compact-md'}
                            onClick={() => signOut()}
                    >Выйти</Button>
                </Group>
                <Group hiddenFrom={'sm'}>
                    <Button rightSection={<IconDoorExit size={'1em'}/>}
                            color={'gray'}
                            variant={'outline'}
                            size={'compact-md'}
                            onClick={() => signOut()}
                    >{session?.user?.email ? session.user.email.split('@')[0] : 'Польователь'}</Button>
                </Group>
            </Skeleton>
    );
}

