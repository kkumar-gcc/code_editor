import React from "react";
import File from "@/components/file";
import {getServerSession} from "next-auth/next";
import {options} from "@/app/api/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import disk from "@/lib/disk";

async function fetchFile(session: any, fileId: any) {
    if (!fileId) {
        return null
    }

    try {
        const file = await prisma.file.findFirst({
            where: {
                userId: session?.user?.id,
                id: fileId,
            }
        })

        if (!file) {
            return null
        }

        let url = disk.url(file.path)
        const content = new TextDecoder('utf-8').decode(await disk.get(file.path));

        return { ...file, url, content }
    } catch (e) {
        console.log(e)
        return null
    }
}

export default async function Page({ params }: { params: { id: string[] } }) {
    const fileId = params.id ? params.id[0] : null
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const file = await fetchFile(session, fileId)
    if (!file) {
        return NextResponse.json({ message: "Not found!" }, { status: 404 });
    }

    return (
        <div className="flex flex-col gap-3 w-10/12 mx-auto my-4">
            <File file={file}/>
        </div>
    );
}
