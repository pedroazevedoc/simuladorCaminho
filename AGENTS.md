<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Simulador Caminho

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 app: a 3D city map (Three.js via @react-three/fiber) that visualizes the shortest path via Dijkstra. UI labels, comments, and commit messages are in **Portuguese (pt-BR)** — keep new UI strings/comments in pt-BR.

## Commands

- `npm run dev` — dev server (uses npm; no yarn/pnpm, lockfile is `package-lock.json`)
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`)
- `npm run build` — **also runs typecheck**; CI (`npm ci && npm run lint && npm run build` on Node 20) is the repo's only quality gate
- No test framework is configured — don't invent a test command; verify with lint + build

## Architecture

- Path alias `@/*` → `src/*` (tsconfig).
- Graph data lives in `src/mocks/cityMocks.ts` (12 `locais`, 19 `ruas`) and is the single source of truth for both the map and the algorithm.
- Dijkstra is implemented from scratch in `src/app/api/rota/route.ts` (`POST /api/rota`). Frontend `src/app/page.tsx` posts `{origem, destino}` and renders the result.
- `src/app/page.tsx` loads `CityMap3D` via `next/dynamic` with `ssr: false` — Three.js *must not* render on the server. Keep it SSR-disabled.
- Streets in `src/components/cityMap3D.tsx` are drawn with native `THREE.Line` primitives (`<primitive object={...}>`) **intentionally** to avoid React Three Fiber Clock/Timer errors in this version. Preserve that pattern; don't refactor to `<line>`/`<Line>` JSX shorthand.

## UI conventions

- shadcn/ui v4 uses **`@base-ui/react` primitives, not Radix** (`src/components/ui/*`); Kibo UI combobox is at `src/components/kibo-ui/combobox/`. `components.json` sets style `base-nova`, Lucide icons.
- Tailwind v4 — **no `tailwind.config.js`**; configured via `@tailwindcss/postcss` and `src/app/globals.css` (`@import "tailwindcss"` + CSS variables). Don't add a Tailwind config file or edit theme in JS.
- `cn()` is re-exported from the `cn` package in `src/lib/utils.ts`; import from `@/lib/utils`, don't redefine.

## Type conventions

- Types live in `src/types/city.ts`: `Local` (grid positions as `[number, number, number]`), `Rua`, `RespostaRota`, `CityMap3DProps`. `posicao` coordinates are 3D tuples — new edges must reference keys that exist in `locais`.