'use client'
import {SessionProvider} from "next-auth/react";
import React from "react";
import {NextUIProvider} from "@nextui-org/react";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider className={"w-full min-h-screen"}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </NextUIProvider>
    )
}