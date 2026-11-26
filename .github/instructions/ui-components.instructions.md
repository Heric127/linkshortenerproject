---
description: Read this before implementing or modifying UI components in the project.

---


# UI Components

All UI in this app is built with **shadcn/ui**. No custom UI components may be created.

## Rules

- Use shadcn/ui components for EVERY UI element (buttons, inputs, forms, dialogs, cards, tables, dropdowns, toasts, etc.).
- Do NOT create custom components, wrappers, or hand-styled replacements for elements shadcn/ui already provides.
- Do NOT use raw HTML elements (`<button>`, `<input>`, `<select>`, `<dialog>`, etc.) where a shadcn/ui component exists.
- Do NOT add other component libraries (MUI, Chakra, Ant, Radix primitives used directly, etc.).
- If a needed component is not yet installed, add it with the CLI: `npx shadcn@latest add <component>`. It lands in `components/ui/`.
- Never hand-write or edit files in `components/ui/` to invent new components. Only install via the CLI.
- Compose pages by combining shadcn/ui components directly in route files (`app/**/page.tsx`, `layout.tsx`). Layout-only markup (`div`, `section`, `main`) styled with Tailwind utilities is allowed.
- Style with Tailwind CSS classes and shadcn/ui variants/props (`variant`, `size`). Use `cn()` from `@/lib/utils` for conditional classes.
- Icons come from `lucide-react` (configured in `components.json`).
- Clerk-provided UI (`SignInButton`, `SignUpButton`, `UserButton`, `Show`) is allowed for auth only (see `docs/auth.md`). A shadcn/ui `Button` may be passed as its child.

## Configuration

Defined in `components.json`: style `base-nova`, base color `neutral`, CSS variables on, components at `@/components`, UI at `@/components/ui`.

```tsx
import { Button } from "@/components/ui/button";

<Button variant="outline" size="lg">Shorten link</Button>
```

## Checklist

- [ ] Every UI element is a shadcn/ui component
- [ ] No new custom component files created
- [ ] Missing components installed via `npx shadcn@latest add`
- [ ] No raw HTML form controls where shadcn/ui has an equivalent
- [ ] Icons from `lucide-react`
