import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getUserToken} from "@/app/api/utils/auth";
import {handleErrors} from "@/app/api/utils/middleware";
import {HttpStatus} from "@/app/api/utils/http_status";

export async function POST(req: NextRequest) {
    return handleErrors(async () => {
        const token = await getUserToken(req);

        const {fontSize, fontFamily, fontWeight} = await req.json();

        const setting = await prisma.setting.upsert({
            where: {
                userId: token.sub,
            },
            create: {
                userId: token.sub as string,
                fontSize: fontSize,
                fontFamily: fontFamily,
                fontWeight: fontWeight,
            },
            update: {
                fontSize: fontSize,
                fontFamily: fontFamily,
                fontWeight: fontWeight,
            },
        });

        return NextResponse.json(
            {
                message: "Settings updated!",
                setting,
            },
            {status: HttpStatus.Ok},
        );
    });
}