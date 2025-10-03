import prisma from "@/lib/prisma";
import { inngest } from "./client";

// Clerk user is at event.data
function extractClerkUserFrom(event) {
    const u = event?.data ?? null;
    if (!u) return null;

    const first = u.first_name ?? u.firstName ?? "";
    const last = u.last_name ?? u.lastName ?? "";
    const email =
        u.email_addresses?.[0]?.email_address ??
        u.emailAddresses?.[0]?.emailAddress ??
        "";

    const image = u.image_url ?? u.imageUrl ?? "";

    return {
        id: u.id || "",                            // String (required by your schema)
        email: email || "",
        name: `${first} ${last}`.trim() || (email || "User"),
        image: image || "",
    };
}

export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-create" },
    { event: "clerk/user.created" },
    // IMPORTANT: use destructuring to get { event }
    async ({ event, step, logger }) => {
        const user = extractClerkUserFrom(event);

        if (!user || !user.id) {
            await step.run("warn-missing-id", async () => {
                console.warn("clerk/user.created missing id; keys:", Object.keys(event?.data || {}));
            });
            return;
        }

        await prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                // cart uses Prisma default "{}"
            },
            update: {
                email: user.email,
                name: user.name,
                image: user.image,
            },
        });
    }
);

export const syncUserUpdate = inngest.createFunction(
    { id: "sync-user-update" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const user = extractClerkUserFrom(event);
        if (!user || !user.id) return;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                email: user.email,
                name: user.name,
                image: user.image,
            },
        });
    }
);

export const syncUserDeletion = inngest.createFunction(
    { id: "sync-user-delete" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const u = event?.data;
        if (!u?.id) return;
        await prisma.user.delete({ where: { id: u.id } });
    }
);
