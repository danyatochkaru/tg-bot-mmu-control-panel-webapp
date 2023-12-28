import {PropsWithChildren} from "react";
import {Center, Paper} from "@mantine/core";

export function FormLayout({children}: PropsWithChildren) {
    return <Center>
        <Paper px={'xl'} bg={'gray.0'} py={'md'} withBorder maw={380} w={'100%'}>
            {children}
        </Paper>
    </Center>
}