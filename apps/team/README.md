## Timeflow Team

Next.js frontend application for Timeflow Team.

### Tech stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Prerequisites

- **Node.js**: recommended Node 20+
- **pnpm**: install globally via npm

Install pnpm globally:

```bash
npm install -g pnpm
```

### Setup (local)

Install dependencies:

```bash
pnpm install
```

Create your environment file:

```bash
cp .env_example .env
```

Start the dev server:

```bash
pnpm dev
```

By default the dev script loads `.env` via `dotenv-cli` and runs Next.js.

### Environment variables

Common variables (see `.env_example`):

- **`PORT`**: port for the Next.js dev server (example: `4000`)
- **`NEXT_PUBLIC_API_URL`**: backend base URL exposed to the browser (example: `http://localhost:3000`)

### Useful scripts

```bash
pnpm dev     # start local development
pnpm build   # production build
pnpm start   # start production server (after build)
pnpm lint    # run lint checks
```

### Major packages used

| Area                  | Packages                                                                              | Used for                                           |
| --------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Framework             | `next`, `react`, `react-dom`                                                          | Next.js app + React rendering                      |
| Data fetching/caching | `@tanstack/react-query`                                                               | Server state, caching, mutations                   |
| Tables                | `@tanstack/react-table`                                                               | Data table modeling (sorting/filtering/pagination) |
| Forms + validation    | `react-hook-form`, `@hookform/resolvers`, `zod`                                       | Forms + schema-based validation                    |
| UI primitives         | `@radix-ui/*`                                                                         | Accessible headless UI components                  |
| Component kit         | `ui` (GitHub: `shadcn/ui`)                                                            | Prebuilt UI components (shadcn)                    |
| Styling utilities     | `tailwindcss`, `tailwind-merge`, `class-variance-authority`, `clsx`, `tw-animate-css` | Utility CSS + class composition                    |
| HTTP client           | `axios`                                                                               | API requests                                       |
| Theme + toasts        | `next-themes`, `sonner`                                                               | Theme switching + notifications                    |
| Icons                 | `lucide-react`                                                                        | Icon set                                           |
| Quality tools         | `eslint`, `eslint-config-next`, `husky`, `lint-staged`                                | Linting + pre-commit hooks                         |

### Basic folder structure

| Folder               | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `src/app/`           | Next.js App Router routes, layouts, and providers          |
| `src/app/api/`       | API-related client/actions used by the app                 |
| `src/app/users/`     | Example routes (list/create/edit)                          |
| `src/components/`    | Reusable components (ErrorBoundary, tables, dialogs, etc.) |
| `src/components/ui/` | UI components (shadcn-style components)                    |
| `src/constants/`     | Shared constants (e.g. API paths, messages)                |
| `src/hooks/`         | Reusable hooks (e.g. React Query hooks)                    |
| `src/lib/`           | Shared utilities (axios instance, query client, helpers)   |
| `src/types/`         | Shared TypeScript types                                    |

### Notes

- **Package manager**: this repo uses **pnpm** (lockfile: `pnpm-lock.yaml`).
- **Git hooks**: `husky` is configured via the `prepare` script (runs on install).
