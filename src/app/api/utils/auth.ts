import {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";
import {ApiError} from "@/app/api/utils/api_error";
import {HttpStatus} from "@/app/api/utils/http_status";

export async function getUserToken(req: NextRequest) {
    const token = await getToken({req});

    if (!token || token?.sub == null) {
        throw new ApiError(HttpStatus.Unauthorized, "Not authorized!");
    }

    return token;
}