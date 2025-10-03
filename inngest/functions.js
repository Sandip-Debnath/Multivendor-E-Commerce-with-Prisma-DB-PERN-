import prisma from "@/lib/prisma";
import { inngest } from "./client";

// Define your functions here
export const syncUserCreation = [
    // Your function implementation will go here later!
    inngest.createFunction(
        {'id':"sync-user-create"},
        { event: 'clerk/user.created' },
        async (event) => {
           const { user } = event.data;
           await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email_addresses[0]?.email_address || '',
                    name: user.first_name + ' ' + user.last_name,
                    image: user.image_url || '',
                }
            });
        }
    ),
];

export const syncUserUpdate = [
    inngest.createFunction(
        {'id':"sync-user-update"},
        { event: 'clerk/user.updated' },
        async (event) => {
            const { user } = event.data;
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    email: user.email_addresses[0]?.email_address || '',
                    name: user.first_name + ' ' + user.last_name,
                    image: user.image_url || '',
                }
            });
        }
    ),
];

export const syncUserDeletion = [
    inngest.createFunction(
        {'id':"sync-user-delete"},
        { event: 'clerk/user.deleted' },
        async (event) => {
            const { user } = event.data;
            await prisma.user.delete({
                where: { id: user.id },
            });
        }
    ),
];
