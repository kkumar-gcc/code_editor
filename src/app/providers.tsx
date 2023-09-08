'use client'
import {SessionProvider} from "next-auth/react";
import React from "react";
import {GeistProvider} from "@geist-ui/core";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <GeistProvider>
            <SessionProvider>
                    {children}
            </SessionProvider>
        </GeistProvider>
    )
}