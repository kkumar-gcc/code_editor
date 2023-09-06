import type {NextAuthOptions} from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers:[
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        session({user, session}) {
            return { ...session,
                user: { ...session.user,
                    id: user.id,
                }
            };
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET as string,
}