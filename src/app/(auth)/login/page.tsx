"use client";
import { signIn } from "next-auth/react";
import {Button} from "@nextui-org/react";
import {Github} from "@/components/geist-ui/icons";
import React from "react";

export default function LoginPage() {
    return (
        <section className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <Button onClick={() => signIn("github", { callbackUrl: "/" })} className={"bg-white border shadow rounded-lg"} startContent={<Github />}>Sign in with Github</Button>
            </div>
        </section>
    );
}