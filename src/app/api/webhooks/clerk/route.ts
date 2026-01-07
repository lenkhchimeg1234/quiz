import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    console.log("[Webhook] Received request");

    const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!secret) throw new Error("CLERK_WEBHOOK_SIGNING_SECRET is not set");

    // Read payload
    const payload = await req.text();
    console.log("[Webhook] Payload length:", payload.length);

    // Get Svix headers
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing Svix headers", { status: 400 });
    }

    // Verify webhook signature
    let event: WebhookEvent;
    try {
      const wh = new Webhook(secret);
      event = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;

      console.log("[Webhook] Event verified:", event.type);
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    // Only handle user.created
    if (event.type !== "user.created") {
      console.log("[Webhook] Event ignored:", event.type);
      return new Response("Ignored", { status: 200 });
    }

    // Extract user data
    const {
      id,
      email_addresses,
      primary_email_address_id,
      first_name,
      last_name,
    } = event.data;


    // Fallback to first email if primary_email_address_id is missing
    const email =
      email_addresses.find((e) => e.id === primary_email_address_id)
        ?.email_address || email_addresses[0]?.email_address;

    if (!email) {
      console.warn("[Webhook] No email found for user", id);
      return new Response("No email", { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    // Upsert user in DB safely
    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        update: { email, name },
        create: { clerkId: id, email, name },
      });

      console.log("[Webhook] User upserted:", id, email);
    } catch (err: unknown) {
      const e = err as
        | { code?: string; meta?: { target?: string[] } }
        | undefined;
      if (e?.code === "P2002" && e.meta?.target?.includes("email")) {
        console.warn(
          "[Webhook] Email conflict, another user already has this email:",
          email
        );
        return new Response("Email conflict", { status: 409 });
      } else {
        console.error("[Webhook] DB error:", err);
        return new Response("DB error", { status: 500 });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[Webhook] Unexpected error:", err);
    return new Response("Server error", { status: 500 });
  }
}
