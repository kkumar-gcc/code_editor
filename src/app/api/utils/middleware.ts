import {NextResponse} from "next/server";
import {ApiError} from "@/app/api/utils/api_error";
import {HttpStatus} from "@/app/api/utils/http_status";

export async function handleErrors(func: () => Promise<any>): Promise<NextResponse> {
    try {
        return await func();
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json({message: error.message}, {status: error.status});
        }
        console.error("Unhandled error:", error);
        return NextResponse.json({message: "An unexpected error occurred."}, {status: HttpStatus.InternalServerError});
    }
}
