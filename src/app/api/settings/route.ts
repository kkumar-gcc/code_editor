import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const token = await getToken({req: req});
    if (!token || token?.sub == null) {
        return NextResponse.json({message: "Not authorized!"}, {status: 401});
    }

    const {fontSize, fontFamily, fontWeight} = await req.json();

    try {
        const setting = await prisma.setting.upsert({
            where: {
                userId: token?.sub,
            },
            create: {
                userId: token?.sub,
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
                message: "settings updated!",
                setting: setting,
            },
            {status: 200},
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({message: "An error occurred."}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    const token = await getToken({req: req});
    if (!token || token?.sub == null) {
        return NextResponse.json({message: "Not authorized!"}, {status: 401});
    }
    try {
        const settings = await prisma.setting.findFirst({
            where: {
                    userId: token?.sub,
            }
        })

        return NextResponse.json(
            {
                message: "settings fetched!",
                setting: settings,
            },
            {status: 200},
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({message: "An error occurred."}, {status: 500});
    }
}
