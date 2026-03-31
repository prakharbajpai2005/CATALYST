# CATALYST

CATALYST is the Next.js client for an AI-guided skill development platform. It helps users upload a resume, analyze skill gaps for a target role, generate a personalized learning roadmap, and view supporting dashboard and passport experiences.

## Stack

- Next.js 15 with the App Router
- React 18
- TypeScript
- Tailwind CSS 4
- NextAuth v5 beta
- Recharts and custom dashboard UI components
- Cloudflare Pages build support via `@cloudflare/next-on-pages`

## Core User Flow

1. `Upload Resume` at `/upload`
2. `Analyze Skill Gap` at `/analyze`
3. `Generate Roadmap` at `/roadmap`

The app stores intermediate results such as extracted skills, gap analysis, target role, and roadmap data in `localStorage` so the multi-step flow can continue across pages.

## Main Routes

- `/` landing page for CATALYST
- `/dashboard` authenticated dashboard with profile and quick actions
- `/upload` resume upload and skill extraction
- `/analyze` target-role and job-description gap analysis
- `/roadmap` personalized roadmap generation and progress tracking
- `/passport?userId=<id>` skill passport view
- `/auth/signin` sign in with credentials, GitHub, or Google
- `/auth/signup` account creation
- `/ui-showcase` component showcase

## Project Structure

```text
client/
|-- app/                  # App Router pages and route handlers
|-- components/           # Shared UI and feature components
|-- lib/                  # API helpers and utilities
|-- public/               # Static assets
|-- auth.ts               # NextAuth configuration
`-- wrangler.json         # Cloudflare Pages configuration
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

Create `client/.env.local` and add the auth values from `env-setup.txt`.

Example:

```env
AUTH_SECRET="generate_a_secure_random_string_here"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

Notes:

- `NEXT_PUBLIC_API_URL` is used by the client API helper in `lib/api.ts`.
- The helper normalizes the base URL and appends `/api` when needed.
- Credentials sign-in expects the backend login endpoint at `/api/users/login`.
- The sign-up page currently posts to `http://localhost:5000/api/users/create`.

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` starts the Next.js dev server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint
- `npm run pages:build` prepares a Cloudflare Pages build output

## Backend Expectations

This client depends on the CATALYST backend for:

- resume upload and skill extraction
- skill gap analysis
- roadmap generation
- user creation and credentials login
- passport data retrieval
- simulation and skill-tree related endpoints used by `lib/api.ts`

For local development, the frontend defaults to `http://localhost:5000/api` when `NEXT_PUBLIC_API_URL` is not set.

## Authentication

CATALYST uses NextAuth with:

- GitHub OAuth
- Google OAuth
- Email/password credentials

The custom sign-in page lives at `/auth/signin`, and `SessionProvider` is wired globally in `components/providers.tsx`.

## Deployment

For a standard production build:

```bash
npm run build
npm run start
```

For Cloudflare Pages:

```bash
npm run pages:build
```

## Notes for Contributors

- The UI is built around reusable chart, card, timeline, and layout components in `components/ui`.
- Several pages rely on browser-only APIs such as `localStorage`, so those views are implemented as client components.
- If you update backend endpoints, make sure to keep `lib/api.ts`, `auth.ts`, and the auth pages in sync.
