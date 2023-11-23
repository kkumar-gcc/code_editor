import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getUserToken} from "@/app/api/utils/auth";
import {handleErrors} from "@/app/api/utils/middleware";
import {HttpStatus} from "@/app/api/utils/http_status";
import {ApiError} from "@/app/api/utils/api_error";
import {clearFolder} from "@/app/api/utils/folder";

export async function POST(req: NextRequest, {params}: { params: { id: string[] } }) {
    return handleErrors(async () => {
        const token = await getUserToken(req);
        const {name} = await req.json();

        const folder = await prisma.folder.create({
            data: {
                name: name,
                userId: token.sub as string,
                parentId: params.id?.[0],
            },
        });

        return NextResponse.json(
            {
                message: "Folder created!",
                folder,
            },
            {status: HttpStatus.Ok},
        );
    });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string }}) {
    return handleErrors(async () => {
        const token = await getUserToken(req);
        if (!params.id) {
            throw new ApiError(HttpStatus.BadRequest, "id is required!");
        }

        const {name} = await req.json();

        const folder = await prisma.folder.update({
            where: {
                id: params.id[0],
                userId: token.sub,
            },
            data: {
                name: name,
            },
        });

        return NextResponse.json(
            {
                message: "Folder updated!",
                folder,
            },
            {status: HttpStatus.Ok},
        );
    });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return handleErrors(async () => {
        const token = await getUserToken(req);

        if (!params.id) {
            throw new ApiError(HttpStatus.BadRequest, "ID is required!");
        }

        // Delete all files and sub-folders in the folder
        await clearFolder(params.id?.[0], token.sub as string);

        return NextResponse.json(
            {
                message: "Folder deleted!",
            },
            {status: HttpStatus.Ok},
        );
    });
}