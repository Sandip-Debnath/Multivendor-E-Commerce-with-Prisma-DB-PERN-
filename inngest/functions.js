// inngest/functions.js
import prisma from "@/lib/prisma";
import { inngest } from "./client";

// 1) Make each export a single function (NOT an array)
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-create" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { user } = event.data;
        await prisma.user.create({
            data: {
                id: user.id,
                email: user.email_addresses?.[0]?.email_address || "",
                name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
                image: user.image_url || "",
            },
        });
    }
);

export const syncUserUpdate = inngest.createFunction(
    { id: "sync-user-update" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { user } = event.data;
        await prisma.user.update({
            where: { id: user.id },
            data: {
                email: user.email_addresses?.[0]?.email_address || "",
                name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
                image: user.image_url || "",
            },
        });
    }
);

export const syncUserDeletion = inngest.createFunction(
    { id: "sync-user-delete" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { user } = event.data;
        await prisma.user.delete({
            where: { id: user.id },
        });
    }
);
