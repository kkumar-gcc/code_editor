export {default} from "next-auth/middleware"

export const config = {
    matcher: ['/files/:path*', "/folders/:path*", "/api/folders/:path*", "/api/files/:path*"],
};