# T3: New Naming Convention Design

## T3.1: Axis-Focused Naming Rules

### Core Principles
1. **Geometric Clarity**: Names describe actual spatial orientation, not data properties
2. **Axis Independence**: Names remain consistent regardless of which property is mapped
3. **Direction Explicit**: Use terms like "parallel", "along", "across" to indicate orientation
4. **Data Agnostic**: Avoid embedding property names in geometric object names

### Naming Rules

#### Rule 1: Swimlane Orientation
- Use geometric orientation in names: `Z_PARALLEL`, `X_PARALLEL`
- Avoid axis ownership terms like "X-axis swimlanes"

#### Rule 2: Block Names
- Format: `${Orientation}_SwimLane_${ID}`
- Example: `Z_PARALLEL_SwimLane_001` instead of `XAxis_SwimLaneShadow_type_man`

#### Rule 3: Configuration Properties
- Use descriptive names: `groupByXPosition`, `groupByZPosition`
- Instead of: `xAxis: "type"`, `zAxis: "petType"`

#### Rule 4: Method Names
- Focus on geometric action: `createZParallelLanes()`, `createXParallelLanes()`
- Instead of: `createSwimLaneBlocks()` for "X-axis"

#### Rule 5: Constants
- Clear dimension indication: `Z_DIMENSION_BUFFER`, `X_DIMENSION_SPACING`
- Instead of: `X_AXIS_Z_BUFFER`

## T3.2: Naming Mapping Table (Old → New)

### Configuration and State
| Old Name | New Name | Rationale |
|----------|----------|-----------|
| `xAxis` (property) | `xGroupingProperty` | Indicates it's for grouping, not axis |
| `zAxis` (property) | `zGroupingProperty` | Indicates it's for grouping, not axis |
| `axisMapping` | `spatialGrouping` | More accurate description |
| `updateAxisMapping()` | `updateSpatialGrouping()` | Clearer purpose |

### Block and Model Names
| Old Pattern | New Pattern | Example |
|------------|-------------|---------|
| `XAxis_SwimLaneShadow_${prop}_${val}` | `ZParallel_Lane_${laneId}` | `ZParallel_Lane_001` |
| `ZAxis_SwimLaneShadow_${prop}_${val}` | `XParallel_Lane_${laneId}` | `XParallel_Lane_001` |
| `XAxis_SwimLanes_${property}` | `ZParallel_Lanes_Group` | Removes property from name |
| `ZAxis_SwimLanes_${property}` | `XParallel_Lanes_Group` | Removes property from name |

### Method Names
| Old Name | New Name |
|----------|----------|
| `createSwimLaneBlocks()` | `createZParallelLanes()` |
| `createXAxisSwimLaneBlocks()` | `createZParallelLaneBlocks()` |
| `createZAxisShadowBlocks()` | `createXParallelShadowBlocks()` |
| `organizeByPropertyAndLayer()` | `organizeByGroupingAndLayer()` |

### Variable Names
| Old Name | New Name |
|----------|----------|
| `nodesByType` | `nodesByGroupValue` |
| `typeXPositions` | `groupValueXPositions` |
| `xAxisProperty` | `xGroupingProperty` |
| `zAxisProperty` | `zGroupingProperty` |
| `propertyName` | `groupingKey` |

### Constants
| Old Name | New Name |
|----------|----------|
| `X_AXIS_Z_BUFFER` | `Z_PARALLEL_LANE_BUFFER` |
| `Z_AXIS_SPACING` | `Z_DIMENSION_SPACING` |
| `swimlaneSpacing` | `laneSpacing` |

### Endcap Names
| Old Pattern | New Pattern |
|------------|-------------|
| `${swimlaneName}_FrontEndcap` | `${laneName}_ZNegativeEndcap` |
| `${swimlaneName}_BackEndcap` | `${laneName}_ZPositiveEndcap` |
| `${swimlaneName}_LeftEndcap` | `${laneName}_XNegativeEndcap` |
| `${swimlaneName}_RightEndcap` | `${laneName}_XPositiveEndcap` |

## T3.3: Consistent Buffer/Dimension Naming

### Buffer Naming Convention
Format: `${DIMENSION}_${PURPOSE}_BUFFER`

| Old Name | New Name | Purpose |
|----------|----------|---------|
| `X_AXIS_Z_BUFFER` | `Z_DIMENSION_LANE_BUFFER` | Buffer in Z dimension for lanes |
| `SHADOW_BUFFER` | `GENERAL_SHADOW_BUFFER` | General purpose shadow buffer |
| (implicit) | `X_DIMENSION_LANE_BUFFER` | Buffer in X dimension for lanes |
| (implicit) | `Y_DIMENSION_STACK_BUFFER` | Buffer in Y dimension for stacks |

### Spacing Constants
Format: `${DIMENSION}_${PURPOSE}_SPACING`

| Old Name | New Name | Purpose |
|----------|----------|---------|
| `Z_AXIS_SPACING` | `Z_DIMENSION_GROUP_SPACING` | Space between Z groups |
| `swimlaneSpacing` | `LANE_INTERNAL_SPACING` | Space within lanes |
| (implicit) | `X_DIMENSION_GROUP_SPACING` | Space between X groups |

## T3.4: Ensuring Clarity for Swimlane Orientation vs Grouping

### Clear Terminology
1. **Orientation Terms** (Geometric):
   - `Z_PARALLEL`: Lanes that run along the Z axis (front-to-back)
   - `X_PARALLEL`: Lanes that run along the X axis (left-to-right)
   - `Y_STACKED`: Elements stacked vertically

2. **Grouping Terms** (Data):
   - `groupingProperty`: The data property used for grouping
   - `groupValue`: A specific value of the grouping property
   - `groupPosition`: The spatial position assigned to a group

### Visual Naming Guide
```
Z-Parallel Lanes (formerly "X-axis swimlanes"):
├── Orientation: Z_PARALLEL (runs along Z)
├── Grouping: By X position (xGroupingProperty)
├── Endcaps: Z_NEGATIVE (front), Z_POSITIVE (back)
└── Example: ZParallel_Lane_001

X-Parallel Lanes (formerly "Z-axis swimlanes"):
├── Orientation: X_PARALLEL (runs along X)
├── Grouping: By Z position (zGroupingProperty)
├── Endcaps: X_NEGATIVE (left), X_POSITIVE (right)
└── Example: XParallel_Lane_001
```

### Interface Updates
```typescript
// Old
export interface AxisMapping {
  xAxis: string; // Property name for X-axis grouping
  zAxis: string; // Property name for Z-axis grouping
}

// New
export interface SpatialGrouping {
  xGroupingProperty: string; // Property that determines X position grouping
  zGroupingProperty: string; // Property that determines Z position grouping
}
```

### Comment Standards
Replace ambiguous comments:
```typescript
// Old: "Create X-axis swimlanes"
// New: "Create Z-parallel lanes grouped by X position"

// Old: "Apply Z buffer to X-axis swimlanes"  
// New: "Apply Z-dimension buffer to Z-parallel lanes"
```

## Summary

The new naming convention:
1. Describes actual geometric behavior (Z-parallel, X-parallel)
2. Separates spatial concepts from data properties
3. Uses consistent patterns for buffers and spacing
4. Makes code self-documenting about spatial relationships
5. Reduces cognitive load by matching names to behavior