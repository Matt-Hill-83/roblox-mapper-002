# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 3D hierarchical graph visualization system built for Roblox that maps entity relationships into interactive 3D space. The project combines Roblox game development with a Next.js web viewer for data exploration.

## Development Commands

### Roblox Development (Primary)
```bash
# Build TypeScript to Luau
npm run build

# Watch mode for development
npm run watch

# Generate data exports from CSV sources
npm run generate-exports
```

### Web App Development (_webapp/)
```bash
cd _webapp
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Code linting
```

## Architecture

### Core Technologies
- **roblox-ts**: TypeScript-to-Luau transpiler for Roblox development
- **Next.js 15**: Web application for data viewing
- **SQLite**: Entity and relationship data storage
- **TypeScript**: Primary development language

### Directory Structure
- `src/client/`: Client-side Roblox scripts
- `src/server/`: Server-side game logic and services
- `src/shared/`: Shared modules between client/server
- `src/shared/data/`: Entity and relationship definitions (15 entity types, 22 relationship types)
- `src/shared/modules/`: Core business logic including spatial positioning and layout algorithms
- `_webapp/`: Next.js application for data exploration
- `out/`: Compiled Luau output from TypeScript

### Service Architecture
The system uses a service-oriented design with key services:
- **GameService** (`src/server/services/game.service.ts`): Main orchestrator
- **HierarchicalLayoutService**: 3D positioning and spatial algorithms
- **ComponentStackService**: Visual entity representation
- **ConnectorService**: Relationship visualization

### Data Pipeline
1. CSV sources contain entity and relationship data
2. `scripts/generate-data-exports.js` converts CSV to TypeScript
3. Data is imported into SQLite database
4. Roblox game renders 3D visualization
5. Web app provides tabular data exploration

### 3D Visualization Logic
- Entities positioned based on hierarchical relationships
- Parent entities appear above children in 3D space
- Advanced spatial clustering and collision avoidance
- Visual components: hexagons (entities), hex stacks (grouped entities), ropes (relationships)

## Development Workflow

1. Modify entity/relationship data in CSV sources
2. Run `npm run generate-exports` to update TypeScript definitions
3. Use `npm run watch` for live development
4. Test in Roblox Studio using compiled Luau output
5. Use web app (`cd _webapp && npm run dev`) for data verification

## Key Modules

- `hierarchyAnalyzer.ts`: Analyzes parent-child relationships and connection mapping
- `hierarchicalLayoutCalculator.ts`: Computes 3D spatial positioning
- `spatialPositioning.ts`: Handles entity placement algorithms
- `collisionAvoidance.ts`: Prevents visual overlaps in 3D space
- `spatialClustering.ts`: Groups related entities for better visualization