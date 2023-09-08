import type {NextAuthOptions} from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from '@/lib/prisma';

export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers:[
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET as string,
    session: {
        strategy: "jwt",
    }
}