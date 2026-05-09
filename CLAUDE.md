# Frontend Architecture Standards

> This file defines how agents and contributors must use the project structure.
> Non-compliant code = reject.

---

## 1. Core Rules

- Follow the existing architecture strictly.
- Prefer extension by composition, not ad-hoc exceptions.
- Do not introduce new dependencies without approval.
- Do not place business logic in pages, UI components, or temporary helper files.
- Treat `lib/` as compatibility only. New code must prefer `features/`, `shared/`, `config/`, and `providers/`.
- **Always use existing reusable components before writing new ones.** See Section 3.

---

## 2. Current Project Structure (Actual State)

The project is in its early phase. The structure below reflects what actually exists today:

```text
.
|-- docs/
|-- messages/
|   |-- en.json
|   `-- tr.json
|-- public/
`-- src/
    |-- app/
    |   |-- _components/
    |   |-- api/
    |   |   `-- auth/
    |   |-- clients/
    |   |-- profile/
    |   |-- globals.css
    |   `-- layout.tsx
    |-- components/
    |   |-- layout/
    |   |   |-- app-breadcrumbs.tsx
    |   |   |-- app-header.tsx
    |   |   |-- app-sidebar.tsx
    |   |   |-- language-picker.tsx
    |   |   |-- sidebar-user.tsx
    |   |   `-- theme-picker.tsx
    |   |-- providers/
    |   |   |-- config-provider.tsx
    |   |   `-- theme-provider.tsx
    |   `-- ui/
    |       |-- avatar.tsx
    |       |-- breadcrumb.tsx
    |       |-- button.tsx
    |       |-- data-source-item.tsx   ← custom
    |       |-- data-table.tsx         ← custom
    |       |-- dropdown-menu.tsx
    |       |-- filter-panel.tsx       ← custom
    |       |-- input.tsx
    |       |-- page-header.tsx        ← custom
    |       |-- separator.tsx
    |       |-- sheet.tsx
    |       |-- sidebar.tsx
    |       |-- skeleton.tsx
    |       |-- tooltip.tsx
    |       `-- widget-card.tsx        ← custom
    |-- hooks/
    |-- i18n/
    `-- lib/
```

### Target Structure (migration goal)

As the project grows, code must migrate toward this layout:

```text
.
|-- app/
|   |-- (public)/
|   |-- (protected)/
|   |-- api/
|   |-- globals.css
|   `-- layout.tsx
|-- config/
|-- docs/
|   `-- adr/
|-- features/
|   `-- _template/
|-- providers/
|-- public/
|-- shared/
|   |-- api/
|   |-- auth/
|   |-- components/
|   |   `-- ui/
|   |-- constants/
|   |-- feedback/
|   |-- hooks/
|   |-- lib/
|   |-- query/
|   |-- types/
|   `-- utils/
|-- tests/
|   |-- e2e/
|   |-- integration/
|   `-- unit/
`-- lib/
```

---

## 3. Reusable UI Components — MANDATORY USAGE

> **Before writing any new UI structure, check if a component below already covers the need.**
> Rebuilding what already exists is rejected.

All custom components live in `src/components/ui/`. Import path: `@/components/ui/<name>`.

---

### `PageHeader` — `page-header.tsx`

Use for every page's top header bar. Never build a one-off header per page.

```tsx
import { PageHeader } from "@/components/ui/page-header";

<PageHeader title="Clients">
  {/* optional: action buttons rendered right-aligned */}
  <Button size="sm">Export</Button>
</PageHeader>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✓ | Page title rendered as `<h1>` |
| `children` | `ReactNode` | — | Right-side action area |
| `className` | `string` | — | Tailwind overrides |

---

### `WidgetCard` — `widget-card.tsx`

Use for every dashboard card / widget container. Never build a one-off card.

```tsx
import { WidgetCard } from "@/components/ui/widget-card";

// "View All" as navigation link
<WidgetCard title="Distribution of Sensitive Columns" subtitle="Top 10" viewAll="/sources">
  {/* chart or any content */}
</WidgetCard>

// "View All" as callback
<WidgetCard title="Recent Activity" viewAll={() => openModal()}>
  {/* content */}
</WidgetCard>

// No "View All"
<WidgetCard title="Summary">
  {/* content */}
</WidgetCard>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✓ | Card title |
| `subtitle` | `string` | — | Secondary line below title |
| `viewAll` | `string \| () => void` | — | String → Next.js Link; function → button |
| `onMaximize` | `() => void` | — | Maximize icon button handler |
| `children` | `ReactNode` | ✓ | Card body |
| `className` | `string` | — | Tailwind overrides |

> `"use client"` — already declared. Safe to pass callbacks from client components.

---

### `DataTable<T>` — `data-table.tsx`

Use for every tabular list view. Never build a raw `<table>` for listing data.

```tsx
import { DataTable } from "@/components/ui/data-table";
import type { TableColumn, TableTab } from "@/components/ui/data-table";

interface User { id: string; name: string; role: string; }

const COLUMNS: TableColumn<User>[] = [
  { header: "Name", key: "name", sortable: true },
  { header: "Role", key: "role", sortable: true },
  {
    align: "center",
    header: "Actions",
    key: "actions",
    render: (row) => <button type="button">Edit {row.name}</button>,
  },
];

const TABS: TableTab[] = [
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

<DataTable<User>
  columns={COLUMNS}
  data={filteredUsers}
  getRowKey={(row) => row.id}
  tabs={TABS}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  key={activeTab}          {/* always add key when tabs change data type */}
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `TableColumn<T>[]` | ✓ | Column definitions |
| `data` | `T[]` | ✓ | Rows to display |
| `getRowKey` | `(row: T) => string` | ✓ | Unique key per row |
| `tabs` | `TableTab[]` | — | Tab bar above the table |
| `activeTab` | `string` | — | Currently selected tab value |
| `onTabChange` | `(tab: string) => void` | — | Tab switch callback |
| `emptyMessage` | `string` | — | Message when data is empty |
| `className` | `string` | — | Tailwind overrides |

**`TableColumn<T>` shape:**

```ts
interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
}
```

Rules:
- Sort is handled internally (asc → desc → reset cycle).
- When tabs switch between data with different types, always add `key={activeTab}` to reset internal sort state.
- Pass pre-filtered data — `DataTable` does not filter rows itself.

---

### `FilterPanel` — `filter-panel.tsx`

Use for every search/filter bar above a list. Never build one-off input grids.

```tsx
import { FilterPanel } from "@/components/ui/filter-panel";
import type { FilterField } from "@/components/ui/filter-panel";

const FIELDS: FilterField[] = [
  { key: "name", label: "Name", placeholder: "Enter name" },
  { key: "type", label: "Type" },
];

const [filters, setFilters] = useState<Record<string, string>>({});

<FilterPanel
  fields={FIELDS}
  onSearch={setFilters}   {/* called on Search click */}
  onReset={() => {}}      {/* optional extra reset side-effect */}
  defaultExpanded={true}
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fields` | `FilterField[]` | ✓ | Input field definitions |
| `onSearch` | `(values: Record<string, string>) => void` | — | Called when Search is clicked |
| `onReset` | `() => void` | — | Optional extra callback on reset |
| `defaultExpanded` | `boolean` | — | Panel starts expanded (default: `true`) |
| `className` | `string` | — | Tailwind overrides |

**`FilterField` shape:**

```ts
interface FilterField {
  key: string;
  label: string;
  placeholder?: string;
}
```

Rules:
- `onSearch` receives the full `values` map. Wire it directly to `setState` for the filter state.
- Reset clears internal inputs **and** calls `onSearch({})` automatically — no need to re-fetch manually.
- Filter the data yourself with a `filterRows` helper; `FilterPanel` does not touch the data.

**Standard `filterRows` pattern to use in every feature:**

```ts
function filterRows<T>(rows: T[], filters: Record<string, string>): T[] {
  const active = Object.entries(filters).filter(([, v]) => v.trim() !== "");
  if (active.length === 0) { return rows; }
  return rows.filter((row) =>
    active.every(([key, value]) =>
      String((row as Record<string, unknown>)[key] ?? "")
        .toLowerCase()
        .includes(value.toLowerCase()),
    ),
  );
}
```

---

### `DataSourceItem` — `data-source-item.tsx`

Use whenever a data source needs to be displayed with a sensitive/non-sensitive progress bar.

```tsx
import { DataSourceItem } from "@/components/ui/data-source-item";

<DataSourceItem
  name="74_heatmaps_100tablo"
  sensitiveTypes={4}
  sensitive={49}
  nonSensitive={1111}
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | ✓ | Data source display name |
| `sensitiveTypes` | `number` | ✓ | Count of sensitive type categories |
| `sensitive` | `number` | ✓ | Count of sensitive columns |
| `nonSensitive` | `number` | ✓ | Count of non-sensitive columns |
| `className` | `string` | — | Tailwind overrides |

---

### `MetricCard` — `metric-card.tsx`

Use for any large-number stat card on dashboards or reports. Always prefer this over building a `WidgetCard` + `<p>` combo by hand.

```tsx
import { MetricCard } from "@/components/ui/metric-card";

<MetricCard
  title="Avg duration"
  subtitle="Last 100 runs"
  value={423}
  unit="ms"
  viewAll="/reports/flow-performance"
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✓ | Card title |
| `value` | `ReactNode` | ✓ | Big number (or any node) rendered center |
| `subtitle` | `string` | — | Secondary line below title |
| `unit` | `string` | — | Suffix rendered after `value` (e.g. `"ms"`, `"%"`) |
| `viewAll` | `string \| () => void` | — | Same as `WidgetCard.viewAll` |
| `className` | `string` | — | Tailwind overrides |

---

### `ChartCard` — `chart-card.tsx`

Wrapper around `WidgetCard` that handles loading / empty / error states for any chart. Charts must always be wrapped with this — never render a raw `<ResponsiveContainer>` inside a bare `WidgetCard`.

```tsx
import { ChartCard } from "@/components/ui/chart-card";

<ChartCard
  title="Message flow"
  subtitle="Last 24 hours"
  isLoading={query.isLoading}
  isError={query.isError}
  isEmpty={buckets.length === 0}
  emptyTitle="No activity"
  errorTitle="Failed to load chart"
>
  <MessageFlowChart data={buckets} />
</ChartCard>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✓ | Card title |
| `children` | `ReactNode` | ✓ | The chart itself |
| `subtitle` | `string` | — | Secondary line below title |
| `isLoading` | `boolean` | — | Renders a skeleton placeholder |
| `isError` | `boolean` | — | Renders an `EmptyState` with `errorTitle` |
| `isEmpty` | `boolean` | — | Renders an `EmptyState` with `emptyTitle` |
| `emptyTitle` | `string` | — | Empty state caption |
| `errorTitle` | `string` | — | Error state caption (also used as description) |
| `height` | `number` | — | Min height in px (default: `280`) |
| `viewAll` | `string \| () => void` | — | Same as `WidgetCard.viewAll` |
| `onMaximize` | `() => void` | — | Maximize handler |
| `className` | `string` | — | Tailwind overrides |

---

### `LiveIndicator` — `live-indicator.tsx`

Use for any "● LIVE / ⏸ PAUSED" status badge. Replaces all per-screen one-off pulsing-dot spans.

```tsx
import { LiveIndicator } from "@/components/ui/live-indicator";

<LiveIndicator label="● LIVE" />

<LiveIndicator
  label="● LIVE"
  paused={isPaused}
  pausedLabel="⏸ PAUSED"
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | ✓ | Active label (when not paused) |
| `paused` | `boolean` | — | Renders muted dot + `pausedLabel` |
| `pausedLabel` | `string` | — | Label when paused (defaults to `label`) |
| `className` | `string` | — | Tailwind overrides |

---

### `TimeRangePicker` — `time-range-picker.tsx`

Use for any preset-based time range toggle (1h / 24h / 7d). Renders as a semantic `<fieldset>` with toggle buttons.

```tsx
import { TimeRangePicker } from "@/components/ui/time-range-picker";
import type { TimeRangePreset } from "@/components/ui/time-range-picker";

const PRESETS: TimeRangePreset[] = [
  { label: "1h", value: "1h" },
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
];

const [range, setRange] = useState("24h");

<TimeRangePicker
  presets={PRESETS}
  value={range}
  onChange={setRange}
  legend="Time range"
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `presets` | `TimeRangePreset[]` | ✓ | Toggle options |
| `value` | `string` | ✓ | Currently selected value |
| `onChange` | `(value: string) => void` | ✓ | Selection handler |
| `legend` | `string` | — | Screen-reader label for the fieldset |
| `className` | `string` | — | Tailwind overrides |

**`TimeRangePreset` shape:**

```ts
interface TimeRangePreset {
  label: string;
  value: string;
}
```

---

### `EmptyState` — `empty-state.tsx`

Use for any empty list / table / chart placeholder. Replaces inline "No data" `<div>`s.

```tsx
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "lucide-react";

<EmptyState title="No subjects yet" />

<EmptyState
  icon={Search}
  title="No matches"
  description="Try clearing the filter."
  action={<Button onClick={reset}>Clear filter</Button>}
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✓ | Primary line |
| `description` | `string` | — | Secondary line below title |
| `icon` | `LucideIcon` | — | Icon component (default: `Inbox`) |
| `action` | `ReactNode` | — | Optional action button below the text |
| `className` | `string` | — | Tailwind overrides |

---

## 4. Responsibility of Each Folder

### `app/`

- App Router entrypoints only.
- Define routes, layouts, route groups, metadata, and API handlers.
- Compose feature screens and providers.
- No business rules, mapping logic, or backend transformation logic.

### `src/components/layout/`

- Application shell components: `AppHeader`, `AppSidebar`, `AppBreadcrumbs`, `LanguagePicker`, `ThemePicker`.
- Do not add business logic here.
- These are layout-level singletons, not reused per page.

### `src/components/ui/`

- All reusable presentational primitives.
- Includes both shadcn/ui primitives and custom components (see Section 3).
- No feature-specific business rules.
- Maps to `shared/components/ui/` in the target architecture.

### `config/` *(target)*

- Centralized runtime and environment access.
- Typed access to env values.
- Auth/runtime configuration belongs here.
- `process.env` must not be used outside `config/`.

### `features/` *(target)*

- Main business boundary.
- Each feature owns its own:
  - `api/`
  - `domain/`
  - `hooks/`
  - `schemas/`
  - `services/`
  - `_components/`
- New application logic should start here.

### `providers/` *(target)*

- Application-wide composition root.
- Global providers such as:
  - React Query
  - Jotai
  - i18n composition
  - future permission/session providers

### `shared/` *(target)*

- Reusable technical building blocks.
- Generic code only.
- Includes:
  - UI primitives
  - logger
  - error normalization
  - query helpers
  - common types
  - permission helpers
  - constants and utilities
- No feature-specific business rules.

### `tests/` *(target)*

- `unit/`: domain/services logic
- `integration/`: hooks, request orchestration, adapters
- `e2e/`: critical user flows

### `docs/adr/`

- Record major architectural decisions.
- Every important new technical direction must be documented here.

### `lib/`

- Temporary compatibility layer only.
- Existing imports may continue to work through wrappers.
- Do not grow this directory with new business logic.
- When a compatibility file becomes unused, remove it deliberately.

---

## 5. Feature Module Shape

Use this structure for every real feature:

```text
features/<feature-name>/
|-- _components/
|   |-- form.tsx
|   |-- table.tsx
|   |-- table-wrapper.tsx
|   `-- upsert-screen.tsx
|-- api/
|   `-- <feature-name>-api.ts
|-- domain/
|   `-- <feature-name>-service.ts
|-- hooks/
|   |-- use-<feature-name>-list.ts
|   `-- use-<feature-name>-mutation.ts
|-- schemas/
|   `-- <feature-name>-schema.ts
`-- services/
    `-- <feature-name>-mapper.ts
```

Rules:

- `_components/` only renders and orchestrates UI.
- `api/` defines request functions and external contracts.
- `domain/` contains business logic and orchestration rules.
- `hooks/` wraps server state and UI composition.
- `schemas/` stores Zod validation.
- `services/` stores pure transformation/mapping helpers when needed.

---

## 6. Import Direction Rules

Allowed direction:

```text
app -> features
app -> providers
app -> shared / src/components
features -> shared / src/components
features -> config
providers -> shared
providers -> config
lib -> features/shared/config  (compatibility only)
```

Forbidden direction:

- `shared -> features`
- `shared -> app`
- `src/components/ui -> features` (UI primitives must not depend on features)
- cross-feature business imports unless explicitly extracted into `shared/`
- new feature logic directly in `lib/`

---

## 7. How to Add a New Page

1. Create the route under `app/`.
2. Keep the route file thin.
3. Import the screen from `features/<feature-name>/_components/...`.
4. Put business rules, request handling, schemas, and orchestration inside the feature.
5. If multiple routes share technical code, move that code into `shared/`, not another feature.

**Every page must use `PageHeader` for its title bar.**

Bad:

```tsx
// app/users/page.tsx — fetch + transform + rendering in one file, custom header div
export default function UsersPage() {
  return (
    <div>
      <div className="px-6 py-5"><h1>Users</h1></div>
      <table>...</table>
    </div>
  );
}
```

Good:

```tsx
// app/(protected)/users/page.tsx
import { UsersScreen } from "@/features/users/_components/users-screen";

export default function UsersPage() {
  return <UsersScreen />;
}
```

```tsx
// features/users/_components/users-screen.tsx
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";

export function UsersScreen() {
  return (
    <div>
      <PageHeader title="Users">
        <Button>Add User</Button>
      </PageHeader>
      <div className="px-6 pb-6">
        <FilterPanel fields={FIELDS} onSearch={setFilters} />
        <DataTable columns={COLUMNS} data={filteredData} getRowKey={(r) => r.id} />
      </div>
    </div>
  );
}
```

---

## 8. How to Add a New Feature

1. Create `features/<feature-name>/`.
2. Add `_components`, `api`, `domain`, `hooks`, `schemas`, `services`.
3. Put request contracts in `api/`.
4. Put business decisions in `domain/`.
5. Put React Query hooks in `hooks/`.
6. Put forms and validation schemas in `schemas/`.
7. Keep route files inside `app/` as thin composition only.
8. Use `PageHeader`, `DataTable`, `FilterPanel`, `WidgetCard`, `DataSourceItem` wherever applicable.

If logic is generic across multiple features:

- move it to `shared/`
- never copy-paste the same logic into multiple features

---

## 9. State Management Rules

| Tool | Usage |
|------|-------|
| `@tanstack/react-query` | all server state |
| `jotai` | local UI state only |
| URL search params | filter, sort, pagination state |

Rules:

- Do not fetch server data with ad-hoc `useEffect`.
- Do not use Jotai for backend state.
- Use stable serializable query keys.
- Prefer query helpers from `shared/query/`.

Query key pattern:

```ts
["entity", "list", filters]
["entity", "detail", id]
```

---

## 10. Request and API Rules

Request flow:

```text
Client -> Next.js API or frontend adapter -> Backend
```

Rules:

- Response contracts should follow:

```ts
type ApiResponse<T> = {
  isSuccess: boolean;
  message: string;
  data: T;
  code: number;
};
```

- Client-side adapters belong in feature `api/` or `shared/api/`.
- Error normalization belongs in `shared/lib/` or `shared/feedback/`.
- Do not place raw backend error handling inside page components.

---

## 11. Auth and Session Rules

- This repository does not require Keycloak at bootstrap.
- Existing session/auth files are transitional and must be treated carefully.
- If a real auth provider is introduced later:
  - configure it through `config/`
  - compose it through `providers/`
  - keep tokens server-side
  - avoid leaking provider-specific assumptions into unrelated features

Current rule:

- Do not reintroduce import-time crashes for optional auth configuration.

---

## 12. Forms

Stack:

- `react-hook-form`
- `zod`

Rules:

- Schemas live in `features/<feature>/schemas/`.
- Form UI lives in `_components/`.
- Form submission logic belongs in mutation hooks or feature domain layer.
- Backend `fieldErrors` must be mapped to the form layer.

---

## 13. Components

Rules:

- Components must be small, pure, and reusable.
- **Check Section 3 first** — if a reusable component covers the need, use it.
- UI primitives go to `src/components/ui/` (current) → `shared/components/ui/` (target).
- Layout singletons go to `src/components/layout/`.
- Feature-specific screens and form sections stay inside feature `_components/`.
- No business logic in presentational components.

Limits:

- Component <= 150 lines when practical
- Hook <= 100 lines when practical
- Function <= 40 lines when practical

If a file grows too much:

- split UI rendering from orchestration
- move logic into `domain/`, `services/`, or hooks

---

## 14. Shared Layer Rules

Put code in `shared/` (or `src/components/ui/` until migration) only when it is:

- generic
- reused or clearly reusable
- not tied to one domain

Examples:

- `src/components/ui/page-header.tsx` ✓
- `src/components/ui/data-table.tsx` ✓
- `src/components/ui/widget-card.tsx` ✓
- `src/components/ui/filter-panel.tsx` ✓
- `src/components/ui/data-source-item.tsx` ✓

Do not put domain-specific names or backend-specific business decisions in `shared/`.

---

## 15. Config Rules

Use `config/` for:

- env access
- feature flags
- auth/runtime configuration

Rules:

- No direct `process.env` outside `config/`
- Return typed values
- Normalize optional values once
- Reuse config outputs everywhere else

---

## 16. Migration Rules for Legacy `lib/`

When touching old code:

1. Prefer moving logic into `features/`, `shared/`, or `config/`.
2. Leave a small wrapper in `lib/` only if existing imports still need compatibility.
3. Do not add fresh business logic to `lib/`.
4. Remove compatibility wrappers once no callers remain.

Target state:

- `lib/` becomes empty or nearly empty over time.

---

## 17. Testing Strategy

| Type | Focus |
|------|-------|
| Unit | domain and service logic |
| Integration | hooks, adapters, request orchestration |
| E2E | critical user journeys |

Rules:

- Do not spend effort on trivial visual tests.
- Test business rules first.
- Add tests next to architecture growth, not as an afterthought.

---

## 18. Design System Rules

- Use shared design tokens and shared UI primitives.
- No random one-off styling patterns for repeated components.
- No raw color naming like `text-red-500` in business UI decisions if a semantic token exists.
- Expand `src/components/ui/` deliberately as the reusable system grows.
- When adding a new generic UI primitive, document it in Section 3 of this file.

---

## 19. I18N Rules

- `next-intl` only
- No hardcoded user-facing strings in feature code
- Messages must be added to both `messages/en.json` and `messages/tr.json`
- Localization files must be UTF-8 without BOM
- No escaped unicode fallback

---

## 20. Naming Rules

| Convention | Scope |
|-----------|-------|
| `kebab-case` | files |
| `PascalCase` | components |
| `camelCase` | variables/functions |
| `SCREAMING_SNAKE_CASE` | module-level constants (e.g. `PERCENT_SCALE`, `DB_COLUMNS`) |

---

## 21. Code Quality Rules

- `Biome` is mandatory
- `ESLint` must pass
- No `any`
- No `console.log`
- No magic numbers without meaningful constants
- No barrel files

Biome rules that commonly fire in this project:

| Rule | Fix |
|------|-----|
| `useSortedKeys` | Sort object literal keys alphabetically |
| `organizeImports` | `npm run format` auto-fixes |
| `noMagicNumbers` | Extract to a named constant at module level |
| `useBlockStatements` | Add `{}` braces to all `if` branches |
| `noLabelWithoutControl` | `<label htmlFor="x">` must match `<input id="x">` |
| `noEmptyBlockStatements` | Remove `() => {}` — pass `undefined` or omit the prop |

Run in order before considering work complete:

```sh
npm run format
npm run lint
npm run typecheck
npm run build
```

---

## 22. Package Manager Policy

Default for this repository:

- `npm`

Do not mix package managers in the same change unless explicitly requested.

---

## 23. Architectural Decisions

All major architectural choices must be documented in:

- `docs/adr/`

Examples:

- auth strategy
- permission model
- API client approach
- shared table/form abstraction strategy

---

## 24. Golden Rules

> Composition > Inheritance
> Declarative > Imperative
> Consistency > Innovation
> Simplicity > Complexity

**Never rebuild what already exists. Read Section 3 before writing any UI.**
