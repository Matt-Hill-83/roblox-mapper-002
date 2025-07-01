<!-- filename: 001-createNextJsDataViewer-003.md -->

When told to do so:
execute tasks, starting with task 12.
mark each task complete before starting the next task.
if a task fails or cannot be done, stop and wait for instructions.

# Next.js Data Viewer Specification

## Summary

A Next.js 14 application that renders database records in a unified MUI Data Grid and an interactive pivot table. TailwindCSS is used with JS‑object style mappings. The goal is to demonstrate multi‑type record visualization with runtime column generation and column‑level sort/filter while keeping the codebase minimal and concept‑focused.

## Core Principles

1. ⬛ Simplicity over completeness
2. ⬛ Include only features necessary to prove the concept
3. ⬛ No mock data – connect to a real database
4. ⬛ Minimal error handling
5. ⬛ No tests

## Requirements

1. ⬛ Functional

   1. ⬛ **R1** – Build with Next.js 14 and TypeScript.
   2. ⬛ **R2** – Integrate TailwindCSS; apply styles through exported JS objects.
   3. ⬛ **R3** – Provide two pages:
      • `/` Data Grid page
      • `/pivot` Pivot Table page
   4. ⬛ **R4** – Data Grid page displays _N_ records from each entity type in one grid.
   5. ⬛ **R5** – Grid columns are dynamically generated at runtime by analyzing all record properties; missing values display "—".
   6. ⬛ **R6** – Column definitions include automatic type detection (string, number, date, boolean) and appropriate renderers.
   7. ⬛ **R7** – Use **@mui/x-data-grid-pro** (Advanced Data Grid) with column sort & filter.
   8. ⬛ **R8** – Separate Data Grid **styles.ts**, **config.ts**, **columns.ts** modules.
   9. ⬛ **R9** – Pivot Table page uses **react‑pivottable** to visualise the same dataset.

2. ⬛ Non‑Functional

   1. ⬛ **R11** – First contentful paint ≤ 2 s on localhost dev build.
   2. ⬛ **R12** – Use ESLint Airbnb + Prettier; CI not required.
   3. ⬛ **R13** – All code in a single monorepo; no separate packages.

## Task List

2. ⬛ Tasks

   1. ✅ Initialise `next-app` with TypeScript template.
   2. ✅ Install dependencies: Tailwind, @mui/x-data-grid, react‑pivottable, clsx, better-sqlite3.
   3. ✅ Configure Tailwind and create `styles/theme.ts` exporting JS style objects.
   4. ✅ Implement `/app/layout.tsx` with navbar links to pages.
   5. ✅ Implement `pages/index.tsx` (DataGridPage) with Table001 component.
   6. ✅ Create `src/components/Table001Basic/columns.ts` to build dynamic column definitions with type detection.
   7. ✅ Create `src/components/Table001Basic/config.ts` for grid options (pagination, density, filter).
   8. ✅ Create `src/components/Table001Basic/styles.ts` exporting Tailwind‑based style object.
   9. ✅ Fetch Persons data from SQLite database
      1. ✅ Create API route (`/api/persons`)
      2. ✅ Create front end data service (`personService.ts`)
      3. ✅ Create useState in Table001 component
      4. ✅ Implement SQLite database query (`src/lib/db.ts`)
      5. ✅ Console log real data throughout data flow
   10. ✅ Validate runtime column generation logic with live DB data.
   11. ✅ Create a new table in the datagrid page for Team data
       1. ✅ Create a new route with dummy data
       2. ✅ Create a new service
       3. ✅ Create a new useState
       4. ✅ Create a new folder and component with the same structure as Table001
          1. folder name = Table002Teams
          2. component name Table002
       5. ✅ Install zustand
       6. ✅ Fetch the Persons and Teams data when the app loads, regardless of what page the user is on, and make it available to all pages through zustand
       7. ✅ Update the data grid page to get the data from zustand
       8. ✅ Implement the pivot table library on the PivotTable page, display Persons data.
