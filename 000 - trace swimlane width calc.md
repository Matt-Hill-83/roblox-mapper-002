# Swimlane Width Calculation Trace

This document traces the data flow for swimlane width calculations from node creation to Z-parallel shadow creation.

## Overview

The issue: Z-parallel shadow lane widths do not match the widths of the actual swimlanes (the colored vertical blocks).

## Data Flow Trace

### 1. Node Creation and Positioning
**File:** `src/shared/modules/renderers/unifiedDataRenderer/core/dataGenerator.ts`
- Nodes are created with positions based on their properties
- Node positions determine the bounds of each swimlane

### 2. Position Calculation
**File:** `src/shared/modules/renderers/unifiedDataRenderer/core/positionCalculator.ts`
- `calculateLayerSwimLanePositions()` - Calculates positions for nodes within swimlanes
- Uses spacing constants from `LAYOUT_CONSTANTS`
- Key spacing values:
  - `nodeSpacing`: Space between nodes
  - `swimlaneSpacing`: Space between swimlanes

### 3. Z-Parallel Lane Creation (Vertical Colored Blocks)
**File:** `src/shared/modules/renderers/unifiedDataRenderer/unifiedDataRenderer.ts`
- `createZParallelLaneBlocks()` method (lines 269-398)
- Process:
  1. Groups nodes by X-axis property (e.g., service)
  2. Calculates bounds for each group:
     ```typescript
     bounds.minX = math.min(bounds.minX, node.position.x);
     bounds.maxX = math.max(bounds.maxX, node.position.x);
     ```
  3. Calculates lane width:
     ```typescript
     const maxWidth = math.max(maxWidth, bounds.maxX - bounds.minX);
     ```
  4. Creates swimlane blocks using the **actual node bounds**
  5. All lanes use the same `maxWidth` for consistency

### 4. Swimlane Block Creation
**File:** `src/shared/modules/renderers/blocks/swimlaneBlockCreator.ts`
- `createSwimLaneBlock()` receives:
  - `width`: The calculated width from node bounds
  - `depth`: The full Z extent of nodes
  - Creates the actual colored block with these dimensions

### 5. X-Parallel Shadow Creation (Horizontal Shadow Blocks)
**File:** `src/shared/modules/renderers/unifiedDataRenderer/unifiedDataRenderer.ts`
- `createXParallelLaneBlocks()` method (lines 554-627)
- Process:
  1. Calculates X extent from Z-parallel lanes:
     ```typescript
     zParallelLanes.forEach((lane) => {
       const halfWidth = lane.Size.X / 2;
       fullMinX = math.min(fullMinX, lane.Position.X - halfWidth);
       fullMaxX = math.max(fullMaxX, lane.Position.X + halfWidth);
     });
     ```
  2. Sets bounds for shadow blocks:
     ```typescript
     propertyBounds.set(propertyValue, {
       minX: fullMinX,
       maxX: fullMaxX,
       minZ: position.minZ,
       maxZ: position.maxZ,
     });
     ```

### 6. Shadow Block Creation
**File:** `src/shared/modules/renderers/blocks/shadowBlockCreator.ts`
- `createXParallelBlock()` method
- Adds buffer to width:
  ```typescript
  const xBuffer = BLOCK_CONSTANTS.DIMENSIONS.X_PARALLEL_LANE_BUFFER; // 4 units
  const width = bounds.maxX - bounds.minX + xBuffer * 2;
  ```

## Key Constants

### Block Constants (`src/shared/modules/renderers/constants/blockConstants.ts`)
- `Z_PARALLEL_LANE_BUFFER`: 4 units - Extra buffer for Z-parallel lanes
- `X_PARALLEL_LANE_BUFFER`: 4 units - Extra buffer for X-parallel lanes

### Layout Constants (`src/shared/modules/renderers/constants/layoutConstants.ts`)
- `Z_PARALLEL_LANE_WIDTH`: 20 units - Fixed width for Z-parallel lanes
- `X_PARALLEL_LANE_DEPTH`: 4 units - Fixed depth for X-parallel lanes
- `LANE_SPACING.Z_PARALLEL_LANE_SPACING`: 5 units - Space between Z-parallel lanes

## Potential Issues

1. **Width Calculation Mismatch**:
   - Z-parallel lanes use actual node bounds to calculate width
   - But the width might not account for node radius
   - Nodes have a radius (from `spacing.nodeRadius`)
   - The bounds might only capture node centers, not their full extent

2. **Buffer Application**:
   - X-parallel shadows add buffer: `width + xBuffer * 2`
   - Z-parallel lanes might not be adding the same buffer

3. **Fixed vs Dynamic Width**:
   - Some code references `Z_PARALLEL_LANE_WIDTH` (20 units) as fixed
   - But actual implementation uses dynamic width from node bounds

## Recommended Fix

Check if Z-parallel lane width calculation includes:
1. Node radius in the bounds calculation
2. Consistent buffer application
3. Whether the "maxWidth" approach is correctly capturing all node extents