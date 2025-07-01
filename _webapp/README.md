# Next.js Data Viewer

A Next.js 14 application that renders database records in a unified MUI Data Grid and an interactive pivot table. This app demonstrates multi-type record visualization with runtime column generation and column-level sort/filter capabilities.

## Features

- **Data Grid Page** (`/`) - Displays all database records in a unified MUI Advanced Data Grid
- **Pivot Table Page** (`/pivot`) - Interactive pivot table for analytical insights
- **Dynamic Columns** - Automatically generates columns based on data properties with type detection
- **TailwindCSS** - Applied through JavaScript objects for consistent styling
- **TypeScript** - Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation & Running

1. **Navigate to the webapp directory:**

   ```bash
   cd _webapp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Local: [http://localhost:3000](http://localhost:3000)
   - Network: http://10.0.0.94:3000 (or your local IP)

The application will auto-reload when you make changes to the code.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
_webapp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Data Grid page (/)
│   │   └── pivot/
│   │       └── page.tsx        # Pivot Table page (/pivot)
│   ├── components/             # Reusable React components
│   ├── datagrid/              # Data Grid specific modules
│   │   ├── columns.ts          # Dynamic column generation
│   │   ├── config.ts           # Grid configuration
│   │   └── styles.ts           # TailwindCSS style objects
│   └── lib/                   # Utilities and database helpers
├── public/                    # Static assets
└── package.json
```

## Technology Stack

- **Framework:** Next.js 15.3.4 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **Data Grid:** @mui/x-data-grid-pro
- **Pivot Table:** react-pivottable
- **Database:** PostgreSQL (via @vercel/postgres)
- **Linting:** ESLint with Next.js config

## Development Notes

- The app uses runtime column generation - no predefined schemas needed
- Columns are automatically typed (string, number, date, boolean) based on data analysis
- Missing values display as "—" in the grid
- All styles are applied through JavaScript objects for maintainability

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [MUI Data Grid](https://mui.com/x/react-data-grid/) - Advanced data grid documentation
- [TailwindCSS](https://tailwindcss.com/docs) - Utility-first CSS framework

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
