import {PropsWithChildren} from "react";
import {Center, Paper} from "@mantine/core";

export function FormLayout({children}: PropsWithChildren) {
    return <Center>
        <Paper radius={'md'} px={'xl'} py={'md'} withBorder maw={360} w={'100%'}>
            {children}
        </Paper>
    </Center>
}