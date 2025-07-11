# F002 Refactoring Plan

## Overview
This plan outlines specific refactoring tasks for improving code quality, removing magic numbers, enhancing type safety, and optimizing performance in the F002-3dNodePivotGraph feature implementation.

## Priority Levels
- 🔴 **High**: Critical for maintainability and bug prevention
- 🟡 **Medium**: Important for code quality and performance
- 🟢 **Low**: Nice-to-have improvements

## Refactoring Tasks

### 1. Extract Magic Numbers and Constants

#### 🔴 T1: Create Centralized Constants File
**File**: Create `src/shared/modules/renderers/constants/blockConstants.ts`
```typescript
export const BLOCK_CONSTANTS = {
  DIMENSIONS: {
    DEFAULT_HEIGHT: 3,
    DEFAULT_WIDTH: 200,
    DEFAULT_DEPTH: 200,
    PLATFORM_SIZE: 100,
    SHADOW_BUFFER: 2,
    Z_FIGHTING_OFFSET: 0.1,
    SHADOW_BLOCK_HEIGHT: 2,
    MIN_BLOCK_SIZE: 1
  },
  COLORS: {
    SHADOW: new Color3(0.5, 0.7, 1),
    PLATFORM: new Color3(0.5, 1, 0.5),
    Z_AXIS_COLORS: [
      new Color3(0.8, 0.2, 0.2), // Red
      new Color3(0.2, 0.8, 0.2), // Green
      // ... etc
    ]
  },
  TRANSPARENCY: {
    OPAQUE: 0,
    FORCE_FIELD: 0.8
  }
};
```

#### 🔴 T2: Extract Position Calculator Constants
**File**: Update `positionCalculator.ts`
- Replace hardcoded values:
  - `5` (ground clearance) → `POSITION_CONSTANTS.MIN_GROUND_CLEARANCE`
  - `5` (Z-axis spacing) → `POSITION_CONSTANTS.Z_AXIS_SPACING`
  - Age range values → `AGE_RANGES` constant object

### 2. Improve Type Safety

#### 🔴 T3: Define Proper Node Type Union
**File**: Update `simpleDataGenerator.interface.ts`
```typescript
export type NodeType = "man" | "woman" | "child" | "grandparent" | "Animals";

export interface Node {
  type: NodeType;  // Remove 'string' type
  // ... rest of interface
}
```

#### 🔴 T4: Create Property Access Type Guards
**File**: Create `src/shared/utils/nodePropertyHelpers.ts`
```typescript
export function isPeopleNode(node: Node): node is Node & { 
  properties: { age: number; petType: string; petColor: string } 
} {
  return ["man", "woman", "child", "grandparent"].includes(node.type);
}

export function getNodeProperty<K extends keyof Node['properties']>(
  node: Node, 
  property: K
): Node['properties'][K] | undefined {
  return node.properties?.[property];
}
```

### 3. Modularize Complex Functions

#### 🟡 T5: Split Position Calculator Methods
**File**: Refactor `positionCalculator.ts`
- Extract `NodeOrganizer` class for organization logic
- Extract `PositionMapper` class for position mapping
- Extract `BoundsCalculator` utility class

```typescript
// New file structure:
src/shared/modules/renderers/unifiedDataRenderer/core/
├── positionCalculator.ts (main orchestrator)
├── nodeOrganizer.ts
├── positionMapper.ts
└── boundsCalculator.ts
```

#### 🟡 T6: Refactor Block Creation Functions
**File**: Split `flatBlockCreator.ts`
```typescript
// New file structure:
src/shared/modules/renderers/blocks/
├── platformBlockCreator.ts
├── shadowBlockCreator.ts
├── swimlaneBlockCreator.ts
└── blockDimensionCalculator.ts
```

### 4. Remove Code Duplication

#### 🔴 T7: Consolidate Block Creation Logic
**File**: Create base class `BaseBlockCreator`
```typescript
export abstract class BaseBlockCreator {
  protected createBasePart(name: string, size: Vector3, position: Vector3): Part {
    const part = new Instance("Part");
    part.Name = name;
    part.Size = size;
    part.Position = position;
    part.Anchored = true;
    part.TopSurface = Enum.SurfaceType.Smooth;
    part.BottomSurface = Enum.SurfaceType.Smooth;
    return part;
  }
  
  protected applyMaterial(part: Part, material: Enum.Material, color: Color3, transparency: number): void {
    part.Material = material;
    part.Color = color;
    part.Transparency = transparency;
  }
}
```

#### 🟡 T8: Create Property Value Resolver
**File**: Extract property resolution logic
```typescript
export class PropertyValueResolver {
  private propertyExtractors: Map<string, (node: Node) => string>;
  
  constructor() {
    this.propertyExtractors = new Map([
      ["type", (node) => node.type],
      ["age", (node) => this.getAgeRange(node)],
      ["petType", (node) => node.properties?.petType || "None"],
      ["petColor", (node) => node.properties?.petColor || "None"]
    ]);
  }
  
  public getPropertyValue(node: Node, propertyName: string): string {
    const extractor = this.propertyExtractors.get(propertyName);
    return extractor ? extractor(node) : "Unknown";
  }
}
```

### 5. Performance Optimizations

#### 🟡 T9: Implement Position Caching
**File**: Add caching to `positionCalculator.ts`
```typescript
export class PositionCalculator {
  private positionCache = new Map<string, Vector3>();
  private propertyMapCache = new Map<string, Map<string, number>>();
  
  public clearCache(): void {
    this.positionCache.clear();
    this.propertyMapCache.clear();
  }
}
```

#### 🟢 T10: Optimize Node Sorting
**File**: Update sorting algorithms
- Replace multiple sorts with single pass
- Use typed comparators
- Cache sort keys

### 6. Add Comprehensive Documentation

#### 🟡 T11: Add JSDoc Comments
**Files**: All refactored files
```typescript
/**
 * Calculates 3D positions for nodes based on their properties and axis mappings
 * @param cluster - The cluster containing all nodes to position
 * @param config - Configuration including axis mappings and spacing
 * @example
 * const calculator = new PositionCalculator();
 * calculator.calculateLayerSwimLanePositions(cluster, config);
 */
```

#### 🟢 T12: Create Architecture Documentation
**File**: Create `F002-Architecture.md`
- Document the relationship between components
- Explain axis mapping system
- Provide usage examples

### 7. Add Error Handling

#### 🔴 T13: Add Validation and Guards
**File**: Add to all public methods
```typescript
public calculateLayerSwimLanePositions(cluster: Cluster, config: EnhancedGeneratorConfig): void {
  if (!cluster || !cluster.groups || cluster.groups.size() === 0) {
    warn("[PositionCalculator] Invalid cluster provided");
    return;
  }
  
  if (!config || !config.layers) {
    warn("[PositionCalculator] Invalid configuration provided");
    return;
  }
  
  // ... rest of method
}
```

### 8. Create Unit Tests

#### 🔴 T14: Add Test Suite
**File**: Create test files
```
src/shared/modules/renderers/__tests__/
├── positionCalculator.test.ts
├── flatBlockCreator.test.ts
└── propertyValueResolver.test.ts
```

### 9. Completed Bug Fixes and Features

#### ✅ T15: Fix Non-Functional Dropdowns (COMPLETED)
**Status**: Completed in commit bd7ca7a
- Fixed dropdown click handling with proper state management
- Connected dropdown change handlers properly
- Verified RemoteEvent communication for axis mapping updates
- Tested with all property options including new firstName/lastName

#### ✅ T8.1: Fix Z-Fighting Issues (COMPLETED)
**Status**: Completed in commit ab8520b
- First hexagon bar raised by 0.001 units when it has a top label
- Prevents z-fighting between bar and label

#### ✅ T16: Add First and Last Name Properties (COMPLETED)
**Status**: Completed in commit bd7ca7a
- Added FIRST_NAMES and LAST_NAMES arrays to constants
- Updated all person types (man, woman, child, grandparent) with name properties
- Names displayed on hexagon labels instead of generic names

#### ✅ T17: Update Property Selectors (COMPLETED)
**Status**: Completed in commit bd7ca7a
- Added "firstName" and "lastName" to dropdown options
- Property resolution handles name fields correctly
- Full axis mapping support for name-based grouping

## Implementation Order

### ✅ Phase 0 (Immediate) - Critical Fixes (COMPLETED)
1. ✅ T15: Fix non-functional dropdowns
2. ✅ T16: Add first and last name properties
3. ✅ T17: Update property selectors

### Phase 1 (Week 1) - Critical Foundation
1. [x] T1: Create centralized constants file
   - ✅ Created `blockConstants.ts` with all block-related constants
   - ✅ Created `positionConstants.ts` with position calculation constants
2. [x] T3: Define proper node type union
   - ✅ Created `nodeTypes.ts` with type unions and type guards
   - ✅ Defined PersonNodeType, AnimalNodeType, and AxisPropertyName types
3. [x] T4: Create property access type guards
   - ✅ Created `nodePropertyHelpers.ts` with type-safe property access
   - ✅ Implemented isPersonNode, isAnimalNode, getNodeProperty, resolvePropertyValue
4. [x] T7: Consolidate block creation logic
   - ✅ Created `BaseBlockCreator` abstract class with common functionality
   - ✅ Consolidated createBasePart, applyMaterial, calculateBlockDimensions
5. [x] T13: Add validation and guards
   - ✅ Created `positionCalculatorWithValidation.ts` with comprehensive validation
   - ✅ Added validateCluster, validateConfig, and error handling throughout

### Phase 2 (Week 2) - Modularization
1. [x] T5: Split position calculator methods
   - ✅ Created `BoundsCalculator` for bounds calculation logic
   - ✅ Created `NodeOrganizer` for node organization and sorting
   - ✅ Created `PositionMapper` for position calculations and mapping
2. [x] T6: Refactor block creation functions
   - ✅ Created `PlatformBlockCreator` for platform blocks
   - ✅ Created `ShadowBlockCreator` for shadow and Z-axis blocks
   - ✅ Created `SwimLaneBlockCreator` for swimlane blocks
   - ✅ Created `BlockDimensionCalculator` for dimension calculations
3. [x] T8: Create property value resolver
   - ✅ Created `PropertyValueResolver` with extensible property extraction
   - ✅ Supports all current properties: type, age, petType, petColor, firstName, lastName
   - ✅ Includes custom extractor registration capability
4. [x] T2: Extract position calculator constants
   - ✅ Created `positionCalculatorRefactored.ts` demonstrating constant usage
   - ✅ All magic numbers replaced with POSITION_CONSTANTS references

### Phase 3 (Week 3) - Optimization & Documentation
1. [ ] T9: Implement position caching
2. [ ] T11: Add JSDoc comments
3. [ ] T10: Optimize node sorting
4. [ ] T12: Create architecture documentation
5. [ ] T14: Add test suite

## Success Metrics

- ✅ Zero magic numbers in code
- ✅ All functions < 50 lines
- ✅ No `any` types
- ✅ 100% of public methods have JSDoc
- ✅ All constants centralized
- ✅ Test coverage > 80%

## Migration Guide

### Before:
```typescript
const z = (index - sortedValues.size() / 2) * 5;
if (minFinalY < 5) { /* ... */ }
```

### After:
```typescript
const z = (index - sortedValues.size() / 2) * POSITION_CONSTANTS.Z_AXIS_SPACING;
if (minFinalY < POSITION_CONSTANTS.MIN_GROUND_CLEARANCE) { /* ... */ }
```

## Risk Mitigation

1. **Backwards Compatibility**: Maintain existing public APIs during refactoring
2. **Incremental Changes**: Test each phase before proceeding
3. **Feature Flag**: Add temporary flag to switch between old/new implementation
4. **Performance Testing**: Benchmark before/after each optimization

## Notes

- Priority should be given to type safety and constant extraction as these prevent bugs
- Modularization can be done incrementally without breaking existing functionality
- Consider using a linter rule to prevent new magic numbers from being introduced
- Recent improvements have already completed:
  - ✅ All Phase 0 critical fixes (dropdowns, name properties)
  - ✅ All Phase 7 GUI and visualization improvements
  - ✅ All Phase 8 label visibility and z-fighting fixes
  - ✅ All Phase 9 dropdown functionality and name properties
  - ✅ Full 3D pivot graph functionality with dynamic axis mapping
  
## Current State

The F002-3dNodePivotGraph feature is now fully functional with:
- Dynamic X and Z axis property mapping
- Support for type, petType, petColor, age, firstName, and lastName grouping
- Fixed dropdown controls with proper state management
- Resolved z-fighting and label visibility issues
- Person nodes with full name display

The refactoring tasks in this document focus on improving code quality, maintainability, and performance of the already working implementation.