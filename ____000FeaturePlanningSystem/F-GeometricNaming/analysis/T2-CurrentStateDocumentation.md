# T2: Current State Documentation

## T2.1: List of Confusing Naming Patterns

### 1. Axis-Property Confusion
| Current Name | What It Actually Does | Why It's Confusing |
|-------------|----------------------|-------------------|
| `xAxis: "type"` | Groups entities by property value along X positions | "xAxis" suggests geometric X-axis, but it's a property name |
| `zAxis: "petType"` | Groups entities by property value along Z positions | "zAxis" suggests geometric Z-axis, but it's a property name |
| `XAxis_SwimLaneShadow` | Creates blocks that run parallel to Z-axis | Named "X-axis" but oriented along Z |
| `ZAxis_SwimLaneShadow` | Creates blocks that run parallel to X-axis | Named "Z-axis" but oriented along X |

### 2. Variable Naming Issues
| Variable Name | Purpose | Confusion |
|--------------|---------|-----------|
| `nodesByType` | Groups nodes by property value | "Type" is a data property, not a position |
| `typeXPositions` | Maps property values to X coordinates | Mixes data property with geometry |
| `createSwimLaneBlocks()` | Creates Z-parallel blocks | Called for "X-axis" but creates Z-oriented blocks |
| `propertyName` | Used for geometric grouping | Property name determines spatial layout |

### 3. Block Naming Patterns
| Current Pattern | Example | Issue |
|----------------|---------|-------|
| `XAxis_SwimLaneShadow_${prop}_${value}` | `XAxis_SwimLaneShadow_type_man` | Embeds data values in geometric object names |
| `ZAxis_SwimLaneShadow_${prop}_${value}` | `ZAxis_SwimLaneShadow_petType_dog` | Mixes data classification with spatial orientation |
| `${swimlaneName}_${position}Endcap` | `XAxis_SwimLaneShadow_type_man_FrontEndcap` | Long names with mixed concerns |

### 4. Buffer and Dimension Naming
| Current Name | Purpose | Confusion |
|-------------|---------|-----------|
| `X_AXIS_Z_BUFFER` | Adds Z-dimension buffer to X-axis swimlanes | Name suggests X-to-Z relationship but it's just a Z buffer |
| `swimlaneSpacing` | Space between property-based groups | Doesn't indicate which dimension |

### 5. Method Naming Issues
| Method | Purpose | Confusion |
|--------|---------|-----------|
| `updateAxisMapping(axis: "xAxis" \| "zAxis", value: string)` | Maps property to axis | Parameter is axis name but value is property name |
| `organizeByPropertyAndLayer()` | Groups nodes spatially | Uses property for geometric organization |

## T2.2: File Locations for Each Pattern

### Core Configuration Files
- `/src/client/services/configGui/stateManager.ts:37-38,243-244` - Default axis mappings
- `/src/shared/interfaces/enhancedGenerator.interface.ts:36-37` - Interface definitions

### Block Creation Files
- `/src/shared/modules/renderers/blocks/swimlaneBlockCreator.ts` - X-axis swimlane creation
- `/src/shared/modules/renderers/blocks/shadowBlockCreator.ts` - Z-axis shadow blocks
- `/src/shared/modules/renderers/blocks/endcapBlockCreator.ts` - Endcap naming

### Renderer Files
- `/src/shared/modules/renderers/unifiedDataRenderer/unifiedDataRenderer.ts` - Main renderer with axis models
- `/src/shared/modules/renderers/unifiedDataRenderer/core/positionCalculator.ts` - Position mapping by property
- `/src/shared/modules/renderers/unifiedDataRenderer/core/nodeOrganizer.ts` - Property-based organization

### Constants
- `/src/shared/modules/renderers/constants/blockConstants.ts:15` - X_AXIS_Z_BUFFER
- `/src/shared/modules/renderers/constants/positionConstants.ts` - Spacing constants

### GUI Components
- `/src/client/services/configGui/components/axisMappingControls/` - Axis mapping UI

## T2.3: Data Flow Diagram

```mermaid
graph TD
    A[User Selects Properties] -->|xAxis: "type", zAxis: "petType"| B[Config State]
    B --> C[UnifiedDataRenderer]
    
    C --> D[NodeOrganizer]
    D -->|Groups by property| E[nodesByType Map]
    
    C --> F[PositionCalculator]
    F -->|Maps property to position| G[typeXPositions Map]
    
    C --> H[SwimLaneBlockCreator]
    H -->|Creates blocks named after axis| I[XAxis_SwimLaneShadow_type_man]
    
    C --> J[ShadowBlockCreator]
    J -->|Creates blocks named after axis| K[ZAxis_SwimLaneShadow_petType_dog]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style I fill:#faa,stroke:#333,stroke-width:2px
    style K fill:#faa,stroke:#333,stroke-width:2px
```

## T2.4: Actual Geometric Behavior vs Named Behavior

### X-Axis Swimlanes (Misnomer)
**Named Behavior**: "X-axis swimlanes" suggests they run along the X-axis
**Actual Behavior**: 
- Run parallel to the Z-axis (front-to-back)
- Group entities by X position
- Have endcaps at Front and Back (Z-direction ends)
- Text labels face Front

### Z-Axis Swimlanes (Misnomer)
**Named Behavior**: "Z-axis swimlanes" suggests they run along the Z-axis
**Actual Behavior**:
- Run parallel to the X-axis (left-to-right)
- Group entities by Z position
- Have endcaps at Left and Right (X-direction ends)
- Text labels face Left

### Visual Representation
```
Top View (Looking down Y-axis):

Current Naming:            Actual Geometry:
"X-axis swimlanes"        Z-parallel lanes
     |   |   |                |   |   |
     |   |   |                |   |   |
   type1 2   3                ↓   ↓   ↓
                              Z direction

"Z-axis swimlanes"        X-parallel lanes
   ——————————              ——————————
   ——————————              ——————————
   petType1,2              ← X direction →
```

### Buffer Application
**Named**: `X_AXIS_Z_BUFFER`
**Actual**: Applies 20 units of spacing in the Z dimension to blocks grouped by X-axis property

### Summary
The fundamental issue is that naming is based on:
1. Which property controls grouping (X or Z axis property)
2. Not the actual geometric orientation of the created objects

This creates a mental translation burden where developers must remember that "X-axis swimlanes" are actually Z-oriented and vice versa.