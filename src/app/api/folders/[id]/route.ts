import {NextApiRequest} from "next";
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/lib/prisma";

export async function GET(req: NextApiRequest){
    if (req.method !== "GET") {
        return NextResponse.json({ message: "invalid request" }, { status: 409 });
    }

    const token = await getToken({ req: req });

    if (!token) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }
    const { parentId, userId } = req.body;

    const folders = await prisma.folder.findMany({
        where: {
            userId: token?.sub,
            parentId: parentId,
        },
    })
    const files = await prisma.file.findMany({
        where: {
            userId: token?.sub,
            folderId: parentId,
        }
    })
    return NextResponse.json(
        {
            folders: folders,
            files: files,
        },
        { status: 200 },
    );
}

export async function PUT(req: NextApiRequest){
    if (req.method !== "PUT") {
        return NextResponse.json({ message: "invalid request" }, { status: 409 });
    }

    const token = await getToken({ req: req });

    if (!token) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }
    const { name, id, userId } = req.body;

    if (userId != token?.sub) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const folder = await prisma.folder.update({
        where: {
            id: id,
        },
        data: {
            name: name,
        },
    });

    return NextResponse.json(
        {
            folder: folder,
        },
        { status: 200 },
    );
}

export async function DELETE(req: NextApiRequest){
    if (req.method !== "DELETE") {
        return NextResponse.json({ message: "invalid request" }, { status: 409 });
    }

    const token = await getToken({ req: req });

    if (!token) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }
    const { id, userId } = req.body;

    if (userId != token?.sub) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const folder = await prisma.folder.delete({
        where: {
            id: id,
            userId: userId,
        },
    });

    return NextResponse.json(
        {
            folder: folder,
        },
        { status: 200 },
    );
}