import React from "react";
import Folder from "@/components/folder";
import {getServerSession} from "next-auth/next";
import {options} from "@/app/api/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {Session} from "next-auth";


async function fetchData(session: Session, parentId: any) {
    const folders = await prisma.folder.findMany({
        where: {
            userId: session?.user?.id,
            parentId: parentId,
        },
    })
    const files = await prisma.file.findMany({
        where: {
            userId: session?.user?.id,
            folderId: parentId,
        }
    })

    return {folders, files}
}
export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }
    const {folders, files} = await fetchData(session, params.id)
    return (
        <div className="flex flex-col gap-3 w-10/12 mx-auto my-4">
            <Folder folders={folders} files={files} />
        </div>
    );
}
