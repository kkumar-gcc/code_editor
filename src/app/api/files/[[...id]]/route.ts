import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/lib/prisma";
import disk from "@/lib/disk";
import {DateTime} from "luxon";

export async function POST(req: NextRequest, { params }: { params: { id: string[] } }) {
    const token = await getToken({ req: req });
    if (!token || token?.sub == null) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    let parentId = null;
    if (params.id) {
        parentId = params.id[0];
    }
    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File
    const name: string | null = data.get('name') as unknown as string

    if (!file) {
        return NextResponse.json({ success: false })
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate a unique file name based on current time, user ID, and original name
        const currentTime = DateTime.now().toMillis();
        const userId = token?.sub || "unknown_user"; // Use "unknown_user" as a default if user ID is not available
        const generatedName = `${currentTime}_${userId}_${name}`;

        // Upload the file to disk storage
        const diskFile = await disk.put(generatedName, buffer);

        const newFile = await prisma.file.create({
            data: {
                name: name,
                path: generatedName,
                size: file.size,
                mimeType: file.type,
                etag: diskFile.etag,
                versionId: diskFile.versionId,
                userId: token?.sub,
                folderId: parentId,
            },
        });

        return NextResponse.json(
            {
                message: "File created!",
                file: newFile,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string }}){
    const token = await getToken({ req: req });

    if (!token || token?.sub == null) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    if (!params.id) {
        return NextResponse.json({ message: "id is required!" }, { status: 400 });
    }

    const { name } = await req.json();

    try {
        const file = await prisma.file.update({
            where: {
                id: params.id[0],
                userId: token?.sub,
            },
            data: {
                name: name,
            },
        });

        return NextResponse.json(
            {
                message: "file updated!",
                file: file,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = await getToken({ req: req });

    if (!token || token?.sub == null) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    if (!params.id) {
        return NextResponse.json({ message: "Invalid request!" }, { status: 400 });
    }

    try {
        // Find the file in your database using Prisma
        const file = await prisma.file.findUnique({
            where: {
                id: params.id[0],
                userId: token.sub,
            },
        });

        if (!file) {
            return NextResponse.json({ message: "File not found!" }, { status: 404 });
        }

        // Delete the file from Minio using disk
        await disk.delete(file.path);

        // Delete the file record from your database
        await prisma.file.delete({
            where: {
                id: file.id,
            },
        });

        return NextResponse.json(
            {
                message: "File deleted!",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}