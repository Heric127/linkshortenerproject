import { index, pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

export const links = pgTable(
    'links',
    {
        id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
        userId: text('user_id').notNull(),
        shortCode: varchar('short_code', { length: 32 }).notNull().unique(),
        url: text('url').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [index('links_user_id_idx').on(table.userId)],
);

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
