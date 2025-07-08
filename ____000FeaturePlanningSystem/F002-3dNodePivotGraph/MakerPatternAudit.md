# Maker Pattern Audit

## Current Maker Functions Analysis

### 1. makeHexagon (hexagonMaker.ts)
```typescript
export function makeHexagon({
  id = 1,
  centerPosition = HEXAGON_CONSTANTS.DEFAULT_CENTER_POSITION,
  width = HEXAGON_CONSTANTS.DEFAULT_WIDTH,
  height = HEXAGON_CONSTANTS.DEFAULT_HEIGHT,
  barProps = {},
  labels = HEXAGON_CONSTANTS.DEFAULT_LABELS,
  stackIndex = 1,
  hexIndex = 1,
  guid,
}: HexagonConfig): Model
```
- **Pattern**: Function with config object
- **Return**: Model
- **Position Format**: Array `[x, y, z]`
- **Naming**: `makeHexagon`
- **Issues**: 
  - Uses arrays instead of Vector3
  - Mixed parameter types (id as number, guid as string)
  - Inconsistent with IMaker interface

### 2. makeBar (barMaker.ts)
```typescript
export function makeBar({
  id,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: -30, z: 0 },
  props = {},
  label = "Bar",
  stackIndex = 1,
  hexIndex = 1,
  barIndex = 1,
}: BarConfig): Part
```
- **Pattern**: Function with config object
- **Return**: Part
- **Position Format**: Object `{ x, y, z }`
- **Naming**: `makeBar`
- **Issues**:
  - Uses object for position instead of Vector3
  - Has rotation parameter not in IMaker interface
  - Props pattern is inconsistent

### 3. makeHexStack (hexStackMaker.ts)
```typescript
export function makeHexStack({
  id = 1,
  centerPosition = HEX_STACK_CONSTANTS.DEFAULT_CENTER_POSITION,
  width = HEX_STACK_CONSTANTS.DEFAULT_WIDTH,
  height = HEX_STACK_CONSTANTS.DEFAULT_HEIGHT,
  count = HEX_STACK_CONSTANTS.DEFAULT_COUNT,
  colors = [],
  stackIndex = 1,
}: HexStackConfig): Model
```
- **Pattern**: Function with config object
- **Return**: Model
- **Position Format**: Array `[x, y, z]`
- **Naming**: `makeHexStack`
- **Issues**:
  - Uses arrays for position
  - Colors as array instead of standardized format

### 4. makeLabelBlock (labelBlockMaker.ts)
```typescript
export function makeLabelBlock({
  id,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  props = {},
  labels = {},
  textBoxOverrides = {},
  parent,
}: LabelBlockConfig): Part
```
- **Pattern**: Function with config object
- **Return**: Part
- **Position Format**: Object `{ x, y, z }`
- **Naming**: `makeLabelBlock`
- **Issues**:
  - Object position format
  - Complex nested configuration

### 5. createRopeLabel (ropeLabelMaker.ts)
```typescript
export function createRopeLabel(props: RopeLabelProps): Model
```
- **Pattern**: Function with props object
- **Return**: Model
- **Naming**: `createRopeLabel` (inconsistent with 'make' prefix)
- **Issues**:
  - Different naming convention
  - Different parameter structure

### 6. createTextBox (TextBoxMaker.ts)
```typescript
export function createTextBox({
  part,
  face,
  text,
  parent,
  backgroundColor,
  borderColor,
  textColor
}: TextBoxConfig): TextBox
```
- **Pattern**: Function with config object
- **Return**: TextBox
- **Naming**: `createTextBox` (inconsistent with 'make' prefix)
- **Issues**:
  - Different naming convention
  - Requires existing part instead of creating one

### 7. createTextLabel (TextLabelMaker.ts)
```typescript
export function createTextLabel({
  part,
  face,
  text,
  parent,
  backgroundColor,
  borderColor,
  textColor
}: TextLabelConfig): TextLabel
```
- **Pattern**: Function with config object
- **Return**: TextLabel
- **Naming**: `createTextLabel` (inconsistent with 'make' prefix)
- **Issues**:
  - Different naming convention
  - Requires existing part

### 8. createLabelGroup (labelGroupMaker.ts)
```typescript
export function createLabelGroup({
  ropeIndex,
  sourceText,
  relationText,
  targetText,
  sourceAttachment,
  targetAttachment,
  parent,
  props = {},
}: LabelGroupConfig): Model
```
- **Pattern**: Function with config object
- **Return**: Model
- **Naming**: `createLabelGroup` (inconsistent with 'make' prefix)
- **Issues**:
  - Different naming convention
  - Very specific to rope labels

### 9. makeOriginBlock (makeOriginBlock.ts)
```typescript
export function makeOriginBlock({
  origin,
  parent,
  offset = { x: 0, y: 0, z: 0 },
  size = 4
}: OriginBlockConfig): Part
```
- **Pattern**: Function with config object
- **Return**: Part
- **Position Format**: Object `{ x, y, z }` (for origin and offset)
- **Naming**: `makeOriginBlock`
- **Issues**:
  - Uses 'origin' instead of 'position'
  - Object format for positions

## Standardization Recommendations

### 1. Unified Naming Convention
- Use `make` prefix for all maker functions
- Rename: 
  - `createRopeLabel` → `makeRopeLabel`
  - `createTextBox` → `makeTextBox`
  - `createTextLabel` → `makeTextLabel`
  - `createLabelGroup` → `makeLabelGroup`

### 2. Position Standardization
- Use Vector3 for all positions
- Convert from:
  - Arrays `[x, y, z]` → `new Vector3(x, y, z)`
  - Objects `{ x, y, z }` → `new Vector3(x, y, z)`

### 3. Configuration Interface Alignment
All makers should extend `IMakerConfig` or appropriate sub-interface:
- Visual makers → `IVisualMakerConfig`
- Label makers → `ILabelMakerConfig`
- Connector makers → `IConnectorMakerConfig`

### 4. Return Type Standardization
Consider using `IMakerResult<T>` for complex makers that create multiple instances:
```typescript
interface IMakerResult<T extends Instance> {
  instance: T;
  children?: Instance[];
  cleanup?: () => void;
}
```

### 5. Parameter Patterns
Standardize common parameters:
- `id`: string | number
- `parent`: Instance
- `position`: Vector3
- `size`: Vector3
- `color`: Color3
- `material`: Enum.Material
- `transparency`: number (0-1)

### 6. Props Pattern
Replace generic `props` objects with explicit parameters in the config interface.

## Priority Order for Standardization

1. **High Priority** (Core visual makers):
   - makeHexagon
   - makeBar
   - makeHexStack
   - makeLabelBlock

2. **Medium Priority** (Supporting makers):
   - makeOriginBlock
   - createRopeLabel → makeRopeLabel
   - createLabelGroup → makeLabelGroup

3. **Low Priority** (Utility makers that augment existing parts):
   - createTextBox → makeTextBox
   - createTextLabel → makeTextLabel

## Next Steps

1. Create standardized config interfaces extending IMaker interfaces
2. Update function signatures to match standardized patterns
3. Convert position formats to Vector3
4. Update calling code to use new signatures
5. Add validation methods where appropriate
6. Document the standardized patterns