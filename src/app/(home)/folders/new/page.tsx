"use client"
import {Button} from "@/components/geist-ui/core";
import {signIn} from "next-auth/react";
import {Github} from "@/components/geist-ui/icons";

export default function NewFolderPage() {
    return (
        <section className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                    Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                    dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                    Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                    Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
                    proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
            </div>
        </section>
    );
}