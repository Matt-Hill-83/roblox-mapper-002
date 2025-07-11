# Maker Pattern Migration Guide

## Overview

This guide documents the migration from legacy maker patterns to the standardized IMaker pattern. The new pattern provides consistent interfaces, better type safety, and improved maintainability.

## Migration Status

### ✅ Completed
- **hexagonMaker**: Standardized version created with backward compatibility adapter
- **barMaker**: Standardized version created with backward compatibility adapter

### 🔄 In Progress
- **hexStackMaker**: Needs standardization
- **labelBlockMaker**: Needs standardization

### ⏳ Pending
- **makeOriginBlock**: Needs standardization
- **createRopeLabel**: Needs standardization and rename
- **createLabelGroup**: Needs standardization and rename
- **createTextBox**: Utility function (lower priority)
- **createTextLabel**: Utility function (lower priority)

## Migration Examples

### Example 1: Hexagon Maker

#### Before (Legacy)
```typescript
import { makeHexagon } from "./hexagonMaker";

const hexagon = makeHexagon({
  id: 1,
  centerPosition: [10, 5, 20],
  width: 8,
  height: 2,
  barProps: {
    Color: [0.5, 0.5, 0.8],
    Material: "Neon",
    Transparency: 0.2
  },
  labels: ["Node1", "Connection", "Data"],
  stackIndex: 1,
  hexIndex: 1
});
```

#### After (Standardized)
```typescript
import { makeHexagonStandardized } from "./hexagonMaker";

const hexagon = makeHexagonStandardized({
  id: 1,
  position: new Vector3(10, 5, 20),
  width: 8,
  height: 2,
  barColor: new Color3(0.5, 0.5, 0.8),
  barMaterial: Enum.Material.Neon,
  barTransparency: 0.2,
  labels: ["Node1", "Connection", "Data"],
  stackIndex: 1,
  hexIndex: 1
});
```

### Example 2: Bar Maker

#### Before (Legacy)
```typescript
import { makeBar } from "./barMaker";

const bar = makeBar({
  id: "bar_1",
  position: { x: 10, y: 5, z: 20 },
  rotation: { x: 0, y: 45, z: 0 },
  props: {
    Size: [0.5, 0.5, 4],
    Color: [1, 0, 0],
    Material: "SmoothPlastic",
    Transparency: 0
  },
  label: "Connection",
  stackIndex: 1,
  hexIndex: 1,
  barIndex: 1
});
```

#### After (Standardized)
```typescript
import { makeBarStandardized } from "./barMaker";

const bar = makeBarStandardized({
  id: "bar_1",
  position: new Vector3(10, 5, 20),
  rotation: new Vector3(0, 45, 0),
  size: new Vector3(0.5, 0.5, 4),
  color: new Color3(1, 0, 0),
  material: Enum.Material.SmoothPlastic,
  transparency: 0,
  label: "Connection",
  stackIndex: 1,
  hexIndex: 1,
  barIndex: 1
});
```

## Key Changes

### 1. Position Format
- **Legacy**: Arrays `[x, y, z]` or objects `{ x, y, z }`
- **Standardized**: `Vector3` instances

### 2. Color Format
- **Legacy**: Arrays `[r, g, b]` with values 0-1
- **Standardized**: `Color3` instances

### 3. Material Format
- **Legacy**: String names like `"SmoothPlastic"`
- **Standardized**: `Enum.Material` values

### 4. Props Pattern
- **Legacy**: Generic `props` object with mixed types
- **Standardized**: Explicit properties in the config interface

### 5. Naming Convention
- **Legacy**: Mixed `make*` and `create*` prefixes
- **Standardized**: Consistent `make*` prefix for all makers

## Backward Compatibility

All migrated makers maintain backward compatibility through adapter functions:

```typescript
// Legacy code continues to work
import { makeHexagon } from "./hexagonMaker"; // Uses adapter

// New code should use standardized version
import { makeHexagonStandardized } from "./hexagonMaker";
```

The legacy functions are marked as `@deprecated` and will be removed in a future version.

## Benefits of Standardization

1. **Type Safety**: Better TypeScript type checking and IntelliSense
2. **Consistency**: All makers follow the same patterns
3. **Maintainability**: Easier to add new features across all makers
4. **Performance**: Direct use of Roblox types without conversion
5. **Documentation**: Interfaces provide clear contracts

## Next Steps for Remaining Makers

### hexStackMaker
1. Create `IHexStackMakerConfig` extending `IVisualMakerConfig`
2. Create `makeHexStackStandardized` function
3. Create adapter for backward compatibility
4. Update exports in index.ts

### labelBlockMaker
1. Create `ILabelBlockMakerConfig` extending `ILabelMakerConfig`
2. Create `makeLabelBlockStandardized` function
3. Create adapter for backward compatibility
4. Update exports in index.ts

### Rename and Standardize
1. `createRopeLabel` → `makeRopeLabel`
2. `createLabelGroup` → `makeLabelGroup`
3. Follow same standardization pattern

## Testing Migration

When migrating code:
1. Replace imports to use standardized versions
2. Update configuration objects to use Vector3/Color3
3. Test that visual output remains the same
4. Remove deprecated imports once migration is complete