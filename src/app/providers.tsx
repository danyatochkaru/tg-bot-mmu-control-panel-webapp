"use client"

import {Noto_Sans} from "next/font/google";
import {MantineProvider} from "@mantine/core";
import {SessionProvider} from "next-auth/react";
import {PropsWithChildren} from "react";
import {SWRConfig} from "swr";
import {ModalsProvider} from "@mantine/modals";
import {DatesProvider} from "@mantine/dates";

import 'dayjs/locale/ru';

const NotoSansFont = Noto_Sans({weight: ["200", "400", "500", '600'], subsets: ['cyrillic', 'latin']})


//@ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

export function Providers({children}: PropsWithChildren) {
    return (
            <MantineProvider defaultColorScheme={'light'} theme={{
                fontFamily: NotoSansFont.style.fontFamily,
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
                defaultRadius: 'xs',
            }}>
                <ModalsProvider>
                    <DatesProvider settings={{locale: 'ru', timezone: 'Europe/Moscow'}}>
                        <SessionProvider>
                            {/*<TelegramProvider>*/}
                            <SWRConfig value={{
                                fetcher,
                            }}>
                                {children}
                            </SWRConfig>
                            {/*</TelegramProvider>*/}
                        </SessionProvider>
                    </DatesProvider>
                </ModalsProvider>
            </MantineProvider>
    );
}

