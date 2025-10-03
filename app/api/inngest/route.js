// app/api/inngest/route.js
import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdate,
} from "@/inngest/functions";

// Keep this endpoint in Node runtime and avoid static optimization:
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serve your functions (note: no nested arrays)
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [syncUserCreation, syncUserUpdate, syncUserDeletion],
});
