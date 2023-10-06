import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string[] }}){
    const token = await getToken({ req: req });
    if (!token || token?.sub == null) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    let parentId = null;
    if (params.id) {
        console.log(params.id);
        parentId = params.id[0];
    }

    const { name } = await req.json();

    try {
        const folder = await prisma.folder.create({
            data: {
                name: name,
                userId: token?.sub,
                parentId: parentId,
            },
        });

        return NextResponse.json(
            {
                message: "folder created!",
                folder: folder,
            },
            { status: 200 },
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
        const folder = await prisma.folder.update({
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
                message: "folder updated!",
                folder: folder,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
    const token = await getToken({ req: req });

    if (!token || token?.sub == null) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    if (!params.id) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    try {
        // delete all files and sub-folders in folder
        await prisma.folder.delete({
            where: {
                id: params.id[0],
                userId: token?.sub,
            },
        });

        return NextResponse.json(
            {
                message: "folder deleted!",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}