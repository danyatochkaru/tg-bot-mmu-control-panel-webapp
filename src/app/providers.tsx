"use client"
import {Noto_Sans} from "next/font/google";
import {MantineProvider} from "@mantine/core";
import {SessionProvider} from "next-auth/react";
import {TelegramProvider} from "@/app/TelegramProvider";
import {PropsWithChildren} from "react";

const NotoSansFont = Noto_Sans({weight: ["200", "400", "500", '600'], subsets: ['cyrillic', 'latin']})

export function Providers({children}: PropsWithChildren) {
    return (
            <MantineProvider theme={{
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
                <SessionProvider>
                    <TelegramProvider>
                        {children}
                    </TelegramProvider>
                </SessionProvider>
            </MantineProvider>
    );
}

