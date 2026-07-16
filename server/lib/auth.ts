import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

import { generateFromEmail } from "unique-username-generator";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const baseAdapter = prismaAdapter(prisma, { provider: "postgresql" });

// BetterAuth doesn't invoke before database hook automatically, it is a limitation in the current architecture
const adapterFn = (schemaOptions: any) => {
    const adapter = baseAdapter(schemaOptions);
    const originalCreate = adapter.create.bind(adapter);

    adapter.create = async ({ model, data, select }: any) => {
        if (model === "user") {
            data = {
                ...data,
                username: data.username || generateFromEmail(data.email, 3),
                firstName: data.firstName || data.name || "مجهول",
                password: data.password || "",
            };
        }
        return originalCreate({ model, data, select });
    };

    return adapter;
};

export const auth = betterAuth({
    trustedOrigins: ["http://localhost:5000", "https://itnab.com"],
    database: adapterFn as any,
    // BetterAuth generates non-UUID IDs by default
    advanced: {
        database: {
            generateId: "uuid",
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
            },
            firstName: {
                type: "string",
                required: false,
            },
            password: {
                type: "string",
                required: false,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
});
