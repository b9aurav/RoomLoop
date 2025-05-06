import prisma from '@/db';
import {
    betterAuth
} from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export const auth = betterAuth({
    appName: "better_auth_nextjs",
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/github",
        }
    },
});
