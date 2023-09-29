import React from "react";
import Folder from "@/components/folder";
import {getServerSession} from "next-auth/next";
import {options} from "@/app/api/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/lib/prisma";
import {Session} from "next-auth";

async function fetchFolders(session: Session, parentId: any) {
    return await prisma.folder.findMany({
        where: {
            userId: session?.user?.id,
            parentId: parentId,
        },
    })
}

async function fetchFiles(session: Session, parentId: any) {
    return await prisma.file.findMany({
        where: {
            userId: session?.user?.id,
            folderId: parentId,
        }
    })
}

export default async function Page() {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }
    const foldersData = fetchFolders(session, null)
    const filesData = fetchFiles(session, null)

    const [folders, files] = await Promise.all([foldersData, filesData])
    return (
        <div className="flex flex-col gap-3 w-10/12 mx-auto my-4">
            <Folder folders={folders} files={files} />
        </div>
    );
}
