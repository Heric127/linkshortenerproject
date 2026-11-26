import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { links } from "@/db/schema";

export async function insertLink(data: { userId: string; shortCode: string; url: string }) {
    const [link] = await db.insert(links).values(data).returning();
    return link;
}

export async function updateLink(data: {
    id: number;
    userId: string;
    shortCode: string;
    url: string;
}) {
    const { id, userId, ...values } = data;
    const [link] = await db
        .update(links)
        .set(values)
        .where(and(eq(links.id, id), eq(links.userId, userId)))
        .returning();
    return link;
}

export async function deleteLink(data: { id: number; userId: string }) {
    const [link] = await db
        .delete(links)
        .where(and(eq(links.id, data.id), eq(links.userId, data.userId)))
        .returning();
    return link;
}

export async function getLinkByShortCode(shortCode: string) {
    const [link] = await db.select().from(links).where(eq(links.shortCode, shortCode)).limit(1);
    return link;
}

export async function getLinksByUserId(userId: string) {
    return db
        .select()
        .from(links)
        .where(eq(links.userId, userId))
        .orderBy(desc(links.createdAt), desc(links.id));
}
