# Swimlane Positioning Flow

## Problem Statement
Swimlane shadow blocks are positioned at completely different X coordinates than their actual node groups. The shadow blocks are off by approximately 25-30 units in the X direction.

## Current Data Flow

### 1. Node Initial Positioning
- **File**: `positionCalculator.ts`
- **Method**: `calculateLayerSwimLanePositions()`
- Nodes are positioned based on their type (X-axis) and layer
- Example: woman nodes get X positions around -7 to -11

### 2. Centering Adjustment
- **File**: `positionCalculator.ts`
- **Method**: `centerBottomAtOrigin()`
- All node positions are adjusted to center the entire cluster at the origin
- This shifts all X positions

### 3. Z-Axis Adjustment (Pet Lanes)
- **File**: `unifiedDataRenderer.ts` (lines 74-88)
- **Method**: `calculatePetLaneZOffset()` and apply offset
- Adjusts Z positions only, X positions remain unchanged
- Example: Z -12.5 → -10

### 4. Swimlane Creation
- **File**: `unifiedDataRenderer.ts` (lines 197-298)
- **Method**: `createZParallelLaneBlocks()`
- **Issue**: Uses fixed lane positioning based on total width calculation
  ```typescript
  const totalWidth = (totalLanes * laneWidth) + ((totalLanes - 1) * laneSpacing);
  const startX = origin.X - totalWidth / 2;
  const centerX = startX + (swimlaneIndex * (laneWidth + laneSpacing)) + laneWidth / 2;
  ```
- **Result**: Swimlanes positioned at -37.5, -12.5, 12.5, 37.5

### 5. Node Bounds Calculation
- Calculates bounds AFTER nodes are positioned
- Example for woman: minX=-11, maxX=-7
- But swimlane is created at X=-37.5

## Root Cause
The swimlane X positions are calculated using a fixed grid layout starting from the origin, completely ignoring where the nodes actually ended up after positioning. The code calculates theoretical positions instead of using the actual node positions.

## Fix Required
Instead of:
```typescript
const centerX = startX + (swimlaneIndex * (laneWidth + laneSpacing)) + laneWidth / 2;
```

Should be:
```typescript
const centerX = (bounds.minX + bounds.maxX) / 2;  // Use actual node bounds
```

## Verification Data from Logs
- Woman swimlane: X=-37.5, but nodes at X=[-11, -7] (center should be ~-9)
- Grandparent swimlane: X=-12.5, but nodes at X=[1, 5] (center should be ~3)
- Man swimlane: X=12.5, but nodes at X=[-5, -1] (center should be ~-3)
- Child swimlane: X=37.5, but nodes at X=[7, 11] (center should be ~9)