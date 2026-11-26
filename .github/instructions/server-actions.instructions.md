---
description: Read this before implementing or modifying any data mutation (create, update, delete) or server action in the project.
---

# Server Actions

ALL data mutation in this app MUST be done via **server actions**. Do NOT mutate data through API routes, route handlers, or directly inside components.

## Rules

- Server actions MUST be called from **client components** (`"use client"`).
- Server action files MUST be named `actions.ts` and be **colocated** in the same directory as the component that calls them (e.g. `app/dashboard/actions.ts` for components in `app/dashboard/`).
- Every `actions.ts` file MUST start with `"use server"`.
- Server actions MUST NOT use Drizzle queries directly. All database operations go through helper functions in `/data` that wrap Drizzle queries (see `data-fetching.instructions.md`).
- Mutation helpers in `/data` (e.g. `insertLink`, `updateLink`, `deleteLink`) are the only place Drizzle `insert` / `update` / `delete` calls are allowed.

## Typed Parameters

- ALL data passed to a server action MUST have an explicit TypeScript type (an inferred zod type or a declared type/interface).
- NEVER use the `FormData` type as a parameter. Pass plain typed objects instead.

## Validation (zod)

- ALL data MUST be validated inside the server action with **zod**, even if the client already validated it.
- Define the zod schema next to the action and derive the parameter type with `z.infer`.
- Use `safeParse` (never `parse`) and return `{ error }` on failure rather than throwing.

## Authentication

- Every server action MUST check for a logged-in user FIRST, before validation side effects or any database operation.
- Get the user with `auth()` from `@clerk/nextjs/server`. Never accept a user ID from the client.
- If there is no `userId`, return `{ error: "Unauthorized" }` immediately (see `auth.instructions.md`).
- Scope every mutation to the authenticated `userId` (e.g. pass it to the `/data` helper so it filters by owner).

## Return Values (No Throwing)

- Server actions MUST NOT throw errors. Never use `throw` to signal auth, validation, or database failures.
- Always return an object with either a `success` property or an `error` property:
  - Success: `{ success: true, data }` (`data` optional for actions with nothing to return).
  - Failure: `{ error: "message" }`.
- Wrap `/data` helper calls in `try/catch` and return `{ error }` on failure instead of rethrowing.
- Client components MUST check the returned object (e.g. `if ("error" in result)`) and handle it; do not rely on `try/catch` around the action call.

## Order of Operations

1. Check auth (`auth()` -> `userId`).
2. Validate input with zod.
3. Call the `/data` helper function(s) inside `try/catch`.
4. Return `{ success: true, data }` or `{ error }`.

## Example

```ts
// data/links.ts
import { db } from "@/db";
import { links } from "@/db/schema";

export async function insertLink(data: { userId: string; url: string; slug: string }) {
  const [link] = await db.insert(links).values(data).returning();
  return link;
}
```

```ts
// app/dashboard/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { insertLink } from "@/data/links";

const createLinkSchema = z.object({
  url: z.url(),
  slug: z.string().min(1).max(50),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  try {
    const link = await insertLink({ userId, ...parsed.data });
    return { success: true as const, data: link };
  } catch {
    return { error: "Failed to create link" };
  }
}
```

```tsx
// app/dashboard/create-link-form.tsx
"use client";

import { createLink } from "./actions";

// Call createLink({ url, slug }) from an event handler; never pass FormData.
// const result = await createLink({ url, slug });
// if ("error" in result) { /* show result.error */ }
```
