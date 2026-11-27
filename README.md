# Link Shortener

A link shortener web application where authenticated users create, edit, and delete short links, and anyone can use a short link to be redirected to the original URL.

> **Academic project.** This project was developed for educational purposes as part of a university course. It is not a production service and is not intended for commercial use.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [Architecture and Conventions](#architecture-and-conventions)
- [Use of GitHub Copilot and AI](#use-of-github-copilot-and-ai)
- [License and Academic Use](#license-and-academic-use)

## Features

- User authentication (sign up, sign in, sign out) with Clerk.
- Protected dashboard at `/dashboard`; signed-in users visiting `/` are redirected there.
- Create, edit, and delete short links, each scoped to its owner.
- Public redirect from `/l/{shortcode}` to the original URL (HTTP 307).
- Redirect targets are restricted to `http` and `https` URLs.
- Input validation with Zod on every mutation.

## Tech Stack

| Area           | Technology                                                 |
| -------------- | ---------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org) (App Router) and React 19 |
| Language       | TypeScript                                                 |
| Authentication | [Clerk](https://clerk.com)                                 |
| Database       | PostgreSQL on [Neon](https://neon.com)                     |
| ORM            | [Drizzle ORM](https://orm.drizzle.team) and Drizzle Kit    |
| Styling        | Tailwind CSS 4                                             |
| UI components  | shadcn/ui (Base UI) and lucide-react                       |
| Validation     | [Zod](https://zod.dev)                                     |

## Project Structure

```text
app/              Routes, layouts, and pages (App Router)
  dashboard/      Protected dashboard, dialogs, and server actions (actions.ts)
  l/[shortcode]/  Public redirect route handler
  sign-in/        Clerk sign-in page
  sign-up/        Clerk sign-up page
components/ui/    shadcn/ui components
data/             Data-access helpers wrapping all Drizzle queries
db/               Drizzle client (index.ts) and schema (schema.ts)
drizzle/          Generated SQL migrations
lib/              Shared utilities
proxy.ts          Clerk middleware (route protection and redirects)
.github/          Copilot instruction files, prompts, and custom agents
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- A [Neon](https://neon.com) PostgreSQL database
- A [Clerk](https://clerk.com) application

### Installation

```bash
git clone <repository-url>
cd linkshortenerproject
npm install
```

Create a `.env` file in the project root (see [Environment Variables](#environment-variables)), then apply the database schema and start the dev server:

```bash
npx drizzle-kit migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Never commit real credentials. Create a `.env` file with:

```dotenv
# Neon PostgreSQL connection string
DATABASE_URL=

# Clerk keys (from the Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Run the production build     |
| `npm run lint`  | Lint the code with ESLint    |

## Database

The schema is defined in [db/schema.ts](db/schema.ts) and managed with Drizzle Kit.

`links` table:

| Column       | Type              | Notes                  |
| ------------ | ----------------- | ---------------------- |
| `id`         | integer, identity | Primary key            |
| `user_id`    | text              | Clerk user ID, indexed |
| `short_code` | varchar(32)       | Unique                 |
| `url`        | text              | Original URL           |
| `created_at` | timestamptz       | Defaults to now        |
| `updated_at` | timestamptz       | Updated automatically  |

Useful commands:

```bash
npx drizzle-kit generate   # generate a migration after changing the schema
npx drizzle-kit migrate    # apply migrations
```

## Architecture and Conventions

Project rules are documented as instruction files in [.github/instructions](.github/instructions):

- **Authentication:** Clerk handles identity; the user ID always comes from the server, never from the client.
- **Data fetching:** Server components fetch data through helpers in `/data`; Drizzle queries are not written elsewhere.
- **Data mutation:** All mutations use server actions (`actions.ts`), validated with Zod, authenticated first, and returning `{ success }` or `{ error }` instead of throwing.
- **UI:** Components are built with shadcn/ui and Tailwind CSS.

## Use of GitHub Copilot and AI

This project was built with the assistance of AI tools, mainly **GitHub Copilot Chat** in VS Code. AI was used as a development aid, not as a replacement for understanding the work.

### How AI was used

- Generating and refactoring code (components, server actions, data helpers).
- Explaining errors and suggesting fixes.
- Drafting documentation, including this README.
- Applying project conventions consistently through instruction files.

### How AI use was guided

AI behavior is configured in the repository so that its output follows the project standards:

| File | Purpose |
| ---- | ------- |
| [AGENTS.md](AGENTS.md) | General instructions and stack summary for AI agents |
| [.github/instructions/](.github/instructions) | Rules for auth, data fetching, server actions, and UI |
| [.github/agents/instruction-generator.agent.md](.github/agents/instruction-generator.agent.md) | Custom agent that writes instruction files |
| [.github/prompts/](.github/prompts) | Reusable prompts for generating instructions |

### Responsible use

- All AI-generated code was reviewed, tested, and understood by the author before being kept.
- AI suggestions were checked against the official documentation of each tool.
- Security-sensitive parts (authentication, input validation, redirect safety) were verified manually.
- No secrets or personal data were shared with AI tools.
- The author remains fully responsible for the submitted work, in line with the university's academic integrity policy.

## License and Academic Use

This repository was created for coursework. Reuse is subject to the university's academic integrity policy. If you plan to reuse any part of it, please contact the author.
