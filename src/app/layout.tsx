import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

import {ColorSchemeScript, MantineProvider} from '@mantine/core';
import {TelegramProvider} from "@/app/TelegramProvider";

export const metadata = {
    title: 'My Mantine app',
    description: 'I have followed setup instructions carefully',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <head>
            <ColorSchemeScript/>
        </head>
        <body>
        <MantineProvider theme={{
            colors: {
                brand: [
                    "#fffce1",
                    "#fff7cc",
                    "#ffef9b",
                    "#ffe664",
                    "#ffdf38",
                    "#ffda1c",
                    "#ffd600",
                    "#e3be00",
                    "#c9a900",
                    "#ae9200"
                ]
            },
            primaryColor: 'brand',
            primaryShade: 6,
        }}>
            <TelegramProvider>
                {children}
            </TelegramProvider>
        </MantineProvider>
        </body>
        </html>
    );
}
