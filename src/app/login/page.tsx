"use client";
import { signIn } from "next-auth/react";
import {Button} from "@/components/geist-ui/core";
import {Github} from "@/components/geist-ui/icons";

export default function LoginPage() {
    return (
        <section className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <Button auto onClick={() => signIn("github", { callbackUrl: "/" })}><Github /> Sign in with Github</Button>
            </div>
        </section>
    );
}