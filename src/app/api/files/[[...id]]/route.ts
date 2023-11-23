import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import disk from "@/lib/disk";
import {DateTime} from "luxon";
import {handleErrors} from "@/app/api/utils/middleware";
import {getUserToken} from "@/app/api/utils/auth";
import {HttpStatus} from "@/app/api/utils/http_status";
import {ApiError} from "@/app/api/utils/api_error";

export async function POST(req: NextRequest, {params}: { params: { id: string[] } }) {
    return handleErrors(async () => {
        const token = await getUserToken(req);

        const data = await req.formData();
        const file = data.get('file') as File;
        const name = data.get('name') as string;
        const isEmpty = data.get('isEmpty') === 'true';

        if (!file && !isEmpty) {
            return NextResponse.json({success: false});
        }

        const bytes = isEmpty ? new TextEncoder().encode("\n") : await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const currentTime = DateTime.now().toMillis();
        const userId = token.sub ?? "unknown_user";
        const generatedName = `${currentTime}_${userId}_${name}`;
        const mimeType = isEmpty ? "text/plain" : file.type;

        const diskFile = await disk.put(generatedName, buffer, mimeType);

        const newFile = await prisma.file.create({
            data: {
                name: name,
                path: generatedName,
                size: !isEmpty ? file.size : 0,
                mimeType: mimeType,
                etag: diskFile.etag,
                versionId: diskFile.versionId,
                userId: token.sub as string,
                folderId: params.id?.[0],
            },
        });

        return NextResponse.json(
            {
                message: "File created!",
                file: newFile,
            },
            {status: HttpStatus.Created}
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

        const file = await prisma.file.update({
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
                message: "file updated!",
                file: file,
            },
            {status: HttpStatus.Ok},
        );
    });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string }}) {
    return handleErrors(async () => {
        const token = await getUserToken(req);

        if (!params.id) {
            throw new ApiError(HttpStatus.BadRequest, "id is required!");
        }

        const {content} = await req.json();

        const file = await prisma.file.findFirst({
            where: {
                id: params.id[0],
                userId: token.sub,
            },
        });

        if (!file) {
            throw new ApiError(HttpStatus.NotFound, "file not found!");
        }

        await disk.put(file.path, Buffer.from(content), file.mimeType);

        const updatedFile = await prisma.file.update({
            where: {
                id: params.id[0],
            },
            data: {
                size: content.length,
            },
        });

        return NextResponse.json(
            {
                message: "file updated!",
                file: updatedFile,
            },
            {status: HttpStatus.Ok},
        );
    });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return handleErrors(async () => {
        const token = await getUserToken(req);

        if (!params.id) {
            throw new ApiError(HttpStatus.BadRequest, "invalid request");
        }

        const file = await prisma.file.findUnique({
            where: {
                id: params.id[0],
                userId: token.sub,
            },
        });

        if (!file) {
            throw new ApiError(HttpStatus.NotFound, "file not found.");
        }

        await disk.delete(file.path);

        await prisma.file.delete({
            where: {
                id: file.id,
            },
        });

        return NextResponse.json(
            {
                message: "file deleted",
            },
            {status: HttpStatus.Ok}
        );
    });
}