import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';

import {ColorSchemeScript} from '@mantine/core';
import {PropsWithChildren} from "react";
import {Providers} from "@/app/providers";
import {Notifications} from "@mantine/notifications";

export const metadata = {
    title: 'Панель управления рассылкой',
};


export default async function RootLayout({children}: PropsWithChildren) {

    return (
            <html lang="ru">
            <head>
                <ColorSchemeScript/>
            </head>
            <body>
            <Providers>
                <Notifications/>
                {children}
            </Providers>
            </body>
            </html>
    );
}
