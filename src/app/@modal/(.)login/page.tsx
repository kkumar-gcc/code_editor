"use client";
import { Modal, Button } from "@/components/geist-ui/core";
import { signIn } from "next-auth/react";
import {Github} from "@/components/geist-ui/icons";

export default function LoginModal() {
    return (
        <div>
            <Modal width="35rem" visible={true}>
                <Modal.Title>Login</Modal.Title>
                <Modal.Content>
                    <div className="text-center">
                        <Button icon={<Github />} auto onClick={() => signIn("github", { callbackUrl: "/" })}>Sign in with Github</Button>
                    </div>
                </Modal.Content>
            </Modal>
        </div>
    )
}