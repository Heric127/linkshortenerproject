---
description: Read this before implementing or modyfing authentication in the project.

---


# Authentication

All authentication in this app is handled by **Clerk** (`@clerk/nextjs`). No other auth method, library, or custom session/token/password logic may be introduced.

## Rules

- Use Clerk only. Do NOT add NextAuth/Auth.js, Supabase Auth, custom JWT/cookies, or hand-rolled login forms.
- Get the current user server-side with `auth()` / `currentUser()` from `@clerk/nextjs/server`. Never trust a user ID sent from the client.
- Clerk setup lives in `app/layout.tsx` (`ClerkProvider`) and `proxy.ts` (`clerkMiddleware`). Keep both in place.
- Use Clerk components for UI state (`Show when="signed-in" | "signed-out"`, `UserButton`).

## Route Protection

| Route | Access | Behavior |
|-------|--------|----------|
| `/dashboard` (and sub-routes) | Signed-in only | Unauthenticated users must be redirected to sign in. |
| `/` (homepage) | Public | Signed-in users must be redirected to `/dashboard`. |

- Enforce both rules in `proxy.ts` using `clerkMiddleware` (e.g. `createRouteMatcher(["/dashboard(.*)"])` with `auth.protect()`, and `redirect` to `/dashboard` when `userId` exists on `/`).
- Also verify `userId` from `auth()` in server code that reads or mutates user data; middleware alone is not sufficient for data access.

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute(req)) await auth.protect();
});
```

## Sign In / Sign Up / Sign Out

- Sign in and sign up MUST always open as a **modal**: use `<SignInButton mode="modal" />` and `<SignUpButton mode="modal" />`.
- Sign out MUST also be handled through Clerk's modal-based UI (`UserButton` / `SignOutButton`). Do not build custom sign-out endpoints.
- Do NOT link to or redirect users to full-page sign-in/sign-up flows for normal navigation.

```tsx
<Show when="signed-out">
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</Show>
<Show when="signed-in">
  <UserButton />
</Show>
```

## Checklist

- [ ] Only Clerk APIs used for auth
- [ ] `/dashboard` requires a signed-in user
- [ ] Signed-in users hitting `/` are redirected to `/dashboard`
- [ ] Every `SignInButton` / `SignUpButton` uses `mode="modal"`
- [ ] Server code derives user identity from `auth()`
