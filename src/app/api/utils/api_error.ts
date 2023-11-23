import {HttpStatus} from "@/app/api/utils/http_status";

export class ApiError extends Error {
    constructor(public readonly status: HttpStatus, message: string) {
        super(message);
    }
}