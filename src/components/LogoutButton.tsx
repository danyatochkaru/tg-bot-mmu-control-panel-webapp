"use client"

import {Button, Group, Text} from "@mantine/core";
import {IconDoorExit} from "@tabler/icons-react";
import {signOut} from "next-auth/react";

export function LogoutButton({name}: { name: string }) {
    return (<>
                <Group visibleFrom={'sm'}>
                    <Text>{name}</Text>
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
                    >{name}</Button>
                </Group>
            </>
    );
}

