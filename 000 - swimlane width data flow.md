# Swimlane Width Data Flow

## Problem Statement
The Z-parallel swimlane shadow blocks are too wide compared to the actual node stacks they represent. The shadow blocks appear to be using a fixed width rather than matching the actual width of the node groups.

## Current Data Flow

### 1. Fixed Width Definition
- **File**: `layoutConstants.ts`
- **Constant**: `LAYOUT_CONSTANTS.LANE_DIMENSIONS.Z_PARALLEL_LANE_WIDTH = 20`
- This is a fixed width used for all Z-parallel lanes

### 2. Node Stack Width
- **File**: `positionCalculator.ts`
- **Method**: `calculateTypeColumnPositions()`
- Nodes are positioned with spacing: `RENDERER_CONSTANTS.POSITIONING.NODE_SPACING`
- Actual node stack width depends on:
  - Number of nodes in the widest layer
  - Node spacing (typically much smaller than lane width)

### 3. Swimlane Width Assignment
- **File**: `unifiedDataRenderer.ts` (line 254)
- **Code**:
  ```typescript
  const blockWidth = LAYOUT_CONSTANTS.LANE_DIMENSIONS.Z_PARALLEL_LANE_WIDTH;
  ```
- **Issue**: Uses fixed width of 20 units regardless of actual node content

### 4. Actual Node Bounds
- From logs: 
  - Woman nodes: X range [-11, -7] = width of 4 units
  - Grandparent nodes: X range [1, 5] = width of 4 units
  - Man nodes: X range [-5, -1] = width of 4 units
  - Child nodes: X range [7, 11] = width of 4 units
- But swimlanes are all 20 units wide!

## Visual Impact
- Node stacks are approximately 4 units wide
- Swimlane shadows are 20 units wide
- Result: Shadow blocks are 5x wider than the actual content

## Root Cause
The code uses a predefined constant width for all swimlanes instead of calculating the width based on the actual node bounds.

## Fix Required
Instead of:
```typescript
const blockWidth = LAYOUT_CONSTANTS.LANE_DIMENSIONS.Z_PARALLEL_LANE_WIDTH;
```

Should be:
```typescript
const blockWidth = bounds.maxX - bounds.minX + BLOCK_CONSTANTS.DIMENSIONS.X_BUFFER * 2;
```

Where X_BUFFER provides a small padding around the actual content width.

## Data Flow Summary
1. Nodes positioned → Width determined by node count and spacing
2. Bounds calculated → Actual width = maxX - minX
3. Swimlane created → ❌ Uses fixed width instead of actual width
4. Visual result → Shadow blocks much wider than node stacks