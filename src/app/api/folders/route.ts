import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/lib/prisma";
import {NextRequest} from "next/server";
import {options} from "@/app/api/auth/[...nextauth]/options";

/**
 *
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest){
    if (req.method !== "GET") {
        return NextResponse.json({ message: "invalid request" }, { status: 409 });
    }

    const session = await getServerSession(options)
    console.log("session", session)
    if (!session) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const token = await getToken({ req: req });
    console.log("token", token)
    if (!token) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }
    const folders = await prisma.folder.findMany({
        where: {
            userId: token?.sub,
            parentId: null,
        },
    })
    const files = await prisma.file.findMany({
        where: {
            userId: token?.sub,
            folderId: null,
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

/**
 * @param req
 */
export async function POST(req: NextRequest){
    if (req.method !== "POST") {
        return NextResponse.json({ message: "invalid request" }, { status: 409 });
    }

    const token = await getToken({ req: req });
    console.log(token)
    if (!token || token?.sub == null) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const { name, parentId } = await req.json();
    const folder = await prisma.folder.create({
        data: {
            name: name,
            userId: token?.sub,
            parentId: parentId !== "" ? parentId : null,
        },
    });

    return NextResponse.json(
            {
                folder: folder,
            },
            { status: 200 },
    );
}
