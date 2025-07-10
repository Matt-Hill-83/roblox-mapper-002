# T1: Code Audit and Analysis - Findings

## T1.1: X-axis and Z-axis Related Naming

### Key Files with Axis Naming:
1. **stateManager.ts**: Default mappings `xAxis: "type"`, `zAxis: "petType"`
2. **swimlaneBlockCreator.ts**: Creates `XAxis_SwimLaneShadow_${propertyName}_${typeName}` blocks
3. **shadowBlockCreator.ts**: Creates `ZAxis_SwimLaneShadow_${propertyName}_${propertyValue}` blocks
4. **endcapBlockCreator.ts**: Uses `isZAxis` parameter to determine endcap placement
5. **unifiedDataRenderer.ts**: Creates models named `XAxis_SwimLanes_${xAxisProperty}`

### Naming Confusion Patterns:
- "X-axis swimlanes" actually run parallel to the Z-axis
- "Z-axis swimlanes" actually run parallel to the X-axis
- Block names embed property values: `XAxis_SwimLaneShadow_type_man`

## T1.2: Property-Based Naming

### Properties Used for Grouping:
- Default X-axis property: `"type"` (person types like man, woman, child)
- Default Z-axis property: `"petType"` (animal types like dog, cat, hamster)
- Y-axis can use property or layer hierarchy

### Files with Heavy Property Naming:
1. `/src/shared/modules/renderers/unifiedDataRenderer/unifiedDataRenderer.ts`
2. `/src/shared/modules/renderers/unifiedDataRenderer/core/positionCalculator.ts`
3. `/src/shared/modules/renderers/unifiedDataRenderer/core/nodeOrganizer.ts`
4. `/src/shared/modules/renderers/blocks/swimlaneBlockCreator.ts`
5. `/src/shared/modules/renderers/blocks/shadowBlockCreator.ts`

### Variable Names Mixing Data and Geometry:
- `nodesByType` - groups by property, not geometric position
- `typeXPositions` - X positions for property values
- `propertyName` parameters throughout

## T1.3: Swimlane-Related Code

### 27 Files Contain Swimlane References:
Primary files:
- `swimlaneBlockCreator.ts` - Main creator for X-axis swimlanes
- `shadowBlockCreator.ts` - Creates Z-axis shadow blocks
- `endcapBlockCreator.ts` - Creates swimlane endcaps
- `labelRenderer.ts` - Adds labels to swimlanes
- `blockDimensionCalculator.ts` - Calculates swimlane dimensions

### Swimlane Naming Patterns:
- X-axis: `XAxis_SwimLaneShadow_${propertyName}_${propertyValue}`
- Z-axis: `ZAxis_SwimLaneShadow_${propertyName}_${propertyValue}`
- Endcaps: `${swimlaneName}_${position}Endcap` (Front/Back or Left/Right)

## T1.4: Axis Labeling and Orientation

### Label Placement:
- X-axis swimlanes: Labels on "Front" face
- Z-axis swimlanes: Labels on "Left" face
- Endcap labels: On all 6 faces

### Text Rotation:
- Only X-axis endcaps rotate text 90° on top face
- All other labels maintain default orientation

### Orientation Reference:
- `makeOriginBlock.ts` creates reference cube with axis labels
- CLAUDE.md confirms: X=left/right, Z=forward/backward, Y=up/down

## T1.5: Buffer and Dimension Naming

### Current Buffer Names:
```typescript
DIMENSIONS: {
  SHADOW_BUFFER: 2,
  X_AXIS_Z_BUFFER: 20, // Extra Z-axis buffer for all X-axis swimlanes
}
```

### Problematic Naming:
- `X_AXIS_Z_BUFFER` - Confusing name mixing axis references
- Applied to X-axis swimlanes (which run in Z direction)
- Should be renamed to clarify it's a Z-dimension buffer

### Other Dimension Constants:
- `BLOCK_CONSTANTS.DIMENSIONS.BASE_Y_LEVEL`
- `POSITION_CONSTANTS.Z_AXIS_SPACING`
- `swimlaneSpacing` in multiple files

## Summary of Findings

The audit reveals pervasive naming confusion where:
1. Data properties ("type", "petType") are used to name geometric structures
2. Axis names don't match geometric orientation (X-axis swimlanes run along Z)
3. Variable and function names embed property values
4. Buffer names mix axis references confusingly
5. The naming makes it difficult to understand actual geometric behavior

This confirms the need for a comprehensive renaming to use geometric terms that clearly indicate spatial orientation rather than data properties.