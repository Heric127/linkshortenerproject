"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteLink as removeLink, insertLink, updateLink as modifyLink } from "@/data/links";

const createLinkSchema = z.object({
    url: z.url(),
    shortCode: z
        .string()
        .min(3)
        .max(32)
        .regex(/^[a-zA-Z0-9_-]+$/),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(input: CreateLinkInput) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const parsed = createLinkSchema.safeParse(input);
    if (!parsed.success) {
        return {
            error: "Enter a valid URL and a short code of 3-32 letters, numbers, - or _.",
        };
    }

    try {
        const link = await insertLink({ userId, ...parsed.data });
        revalidatePath("/dashboard");
        return { success: true as const, data: link };
    } catch (e) {
        const code = (e as { code?: string; cause?: { code?: string } }) ?? {};
        if (code.code === "23505" || code.cause?.code === "23505") {
            return { error: "That short code is already taken." };
        }
        return { error: "Failed to create link." };
    }
}

const updateLinkSchema = createLinkSchema.extend({
    id: z.number().int().positive(),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLink(input: UpdateLinkInput) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const parsed = updateLinkSchema.safeParse(input);
    if (!parsed.success) {
        return {
            error: "Enter a valid URL and a short code of 3-32 letters, numbers, - or _.",
        };
    }

    try {
        const link = await modifyLink({ userId, ...parsed.data });
        if (!link) return { error: "Link not found." };
        revalidatePath("/dashboard");
        return { success: true as const, data: link };
    } catch (e) {
        const code = (e as { code?: string; cause?: { code?: string } }) ?? {};
        if (code.code === "23505" || code.cause?.code === "23505") {
            return { error: "That short code is already taken." };
        }
        return { error: "Failed to update link." };
    }
}

const deleteLinkSchema = z.object({
    id: z.number().int().positive(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLink(input: DeleteLinkInput) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const parsed = deleteLinkSchema.safeParse(input);
    if (!parsed.success) return { error: "Invalid link." };

    try {
        const link = await removeLink({ userId, id: parsed.data.id });
        if (!link) return { error: "Link not found." };
        revalidatePath("/dashboard");
        return { success: true as const };
    } catch {
        return { error: "Failed to delete link." };
    }
}
