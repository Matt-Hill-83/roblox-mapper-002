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

### Web App Development (\_webapp/)

```bash
cd _webapp
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Code linting
```

## Roblox Coordinate System

**Important**: In Roblox, the coordinate axes are oriented as follows:
- **X axis**: Horizontal, parallel to the ground (left/right)
- **Z axis**: Horizontal, parallel to the ground (forward/backward)
- **Y axis**: Vertical, perpendicular to the ground (up/down)

To avoid confusion, we refer to the Y axis as the "up/down axis" throughout this project.

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

### Troubleshooting

If the lua-language-server is consuming too many resources:
```bash
# Kill lua-language-server process
pkill -f lua-language-server

# Or find and kill specific process
ps aux | grep -i lua-language-server
kill -9 [PID]
```

## Key Modules

## Code Organization Guidelines

### How to Clean Up a Roblox File

When refactoring a large file, follow these steps:

1. **Put the file in a well-named folder** that reflects its purpose

2. **Split the file into well-named sub-files**, if it makes sense:
   - **constants.ts** - All constants, configuration values, and magic numbers
   - **data.ts** - Data structures, interfaces, and static data (if relevant)
   - **More granular asset sub-files**:
     - `block.ts` - Block creation and manipulation
     - `rope.ts` - Rope/connector creation and styling
     - `label.ts` - Label creation and positioning
   - **More granular processing sub-files**:
     - Split by logical operations or phases
     - Keep related functionality together
     - Ensure clear interfaces between modules

3. **Constants Organization**:
   - Constants should always be organized into an object at the top of the file
   - Group related constants together within the object
   - Use descriptive names for both the object and its properties
   - Example:
     ```typescript
     const VISUALIZATION_CONSTANTS = {
       SPACING: {
         COLUMN: 10,
         LEVEL: 5,
         BASE_Y: 20
       },
       COLORS: {
         PEOPLE: [0.2, 0.4, 0.8],
         ANIMALS: [0.8, 0.4, 0.2]
       }
     };
     ```

## OnStartup

When starting work on this project, please read all project specification files located in the `000ProjectSpecification/` folder:

- Read all files in the folder to understand the complete project requirements
- Use `000ProjectTasks-current.md` as the primary reference for new requirements and active tasks
- The older specification files (`000ProjectTasks-old-001.md`, `000ProjectTasks-old-002.md`, etc.) contain historical context and completed work

## Image Handling

- Images will be pasted into the folder `___images for claude/`
- When the user types "image?", list the name of the most recent image in that folder

## Git Commits

- NEVER make a commit without specifically being told to
- Only commit changes when the user explicitly asks you to commit
