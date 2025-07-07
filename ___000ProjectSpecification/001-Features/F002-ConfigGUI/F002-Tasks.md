## T161: Make Main GUI Collapsible

**Status**: COMPLETED
**Priority**: Medium
**Description**: Add ability to collapse/expand the main configuration GUI

### Tasks:

1. ✅ [CLD10] T161.1: Create collapsible frame component

   1. ✅ [CLD10] T161.1.1: Create collapsibleFrame.ts component
   2. ✅ [CLD10] T161.1.2: Add header with title and toggle button
   3. ✅ [CLD10] T161.1.3: Implement smooth collapse/expand animation

2. ✅ [CLD10] T161.2: Add dragging functionality

   1. ✅ [CLD10] T161.2.1: Make GUI draggable by header
   2. ✅ [CLD10] T161.2.2: Track mouse position for drag
   3. ✅ [CLD10] T161.2.3: Update frame position on drag

3. ✅ [CLD10] T161.3: Update ConfigGUIService

   1. ✅ [CLD10] T161.3.1: Replace createMainFrame with createCollapsibleFrame
   2. ✅ [CLD10] T161.3.2: Update content to render in contentFrame
   3. ✅ [CLD10] T161.3.3: Add animation constants

### Technical Notes:

- Collapsed state shows only header (40px height)
- Expanded state shows full GUI content
- Smooth animation using TweenService (0.3s duration)
- Toggle button shows − when expanded, + when collapsed
- GUI can be dragged by clicking and dragging the header
- Content is hidden during collapse animation for cleaner visual

## T162: Reduce Console Width

**Status**: COMPLETED
**Priority**: Medium
**Description**: Make the console output half as wide and reorganize buttons to save space

### Tasks:

1. ✅ [CLD11] T162.1: Reduce console width

   1. ✅ [CLD11] T162.1.1: Update console frame width to 50% of current size (650px → 325px)
   2. ✅ [CLD11] T162.1.2: Adjust text sizing for readability at new width (using TextScaled)
   3. ✅ [CLD11] T162.1.3: Test text wrapping and overflow behavior

2. ✅ [CLD11] T162.2: Stack node and link type buttons
   1. ✅ [CLD11] T162.2.1: Reorganize layout to stack buttons vertically
   2. ✅ [CLD11] T162.2.2: Adjust spacing between stacked buttons
   3. ✅ [CLD11] T162.2.3: Update overall GUI layout to accommodate changes

### Technical Notes:

- GUI width reduced from 650px to 325px (50%)
- Node and Link type inputs now stacked vertically (increased section height from 70px to 110px)
- Button widths reduced from 120px to 90px
- Grid column widths adjusted to fit narrower GUI
- Visualization controls repositioned above buttons instead of to the right
- All text uses TextScaled for automatic size adjustment

## T163: Add Z Offset Input for Random Z Function

**Status**: COMPLETED
**Priority**: Medium
**Description**: Add numeric input field to control the Z offset amount when Random Z is enabled

### Tasks:

1. ✅ [CLD11] T163.1: Add Z offset input field

   1. ✅ [CLD11] T163.1.1: Add "Z Offset" numeric input to visualization controls
   2. ✅ [CLD11] T163.1.2: Position near Random Z checkbox
   3. ✅ [CLD11] T163.1.3: Set default value to 20
   4. ✅ [CLD11] T163.1.4: Add validation (min: 0, max: 100)

2. ✅ [CLD11] T163.2: Update interfaces and logic
   1. ✅ [CLD11] T163.2.1: Add zOffsetAmount field to VisualizationOptions
   2. ✅ [CLD11] T163.2.2: Update random offset logic to use configurable amount
   3. ✅ [CLD11] T163.2.3: Apply offset as +/- zOffsetAmount instead of fixed 20

### Technical Notes:

- Input should be disabled when Random Z checkbox is unchecked
- Offset direction (+/-) remains random, only magnitude changes

## T164: Add Y Offset Input for Origin

**Status**: COMPLETED
**Priority**: Medium
**Description**: Add numeric input to control the Y (vertical) offset of the origin/starting position

### Tasks:

1. ✅ [CLD11] T164.1: Add origin Y offset input

   1. ✅ [CLD11] T164.1.1: Add "Origin Y Offset" input to Global Settings
   2. ✅ [CLD11] T164.1.2: Set default value to 0
   3. ✅ [CLD11] T164.1.3: Add validation (min: -100, max: 100)

2. ✅ [CLD11] T164.2: Implement origin offset logic
   1. ✅ [CLD11] T164.2.1: Add originYOffset to SpacingConfig interface
   2. ✅ [CLD11] T164.2.2: Apply offset to origin position calculation
   3. ✅ [CLD11] T164.2.3: Update all node positioning to account for offset

### Technical Notes:

- Affects the vertical starting position of the entire graph
- Positive values move graph up, negative values move down

## T165: Add Export Config Button

**Status**: COMPLETED
**Priority**: High
**Description**: Add button to output current configuration to console in a readable format

### Tasks:

1. ✅ [CLD11] T165.1: Create export button

   1. ✅ [CLD11] T165.1.1: Add "Export Config" button to GUI
   2. ✅ [CLD11] T165.1.2: Position button in action buttons area
   3. ✅ [CLD11] T165.1.3: Style consistently with other buttons

2. ✅ [CLD11] T165.2: Implement export functionality

   1. ✅ [CLD11] T165.2.1: Clear console output before writing
   2. ✅ [CLD11] T165.2.2: Format configuration data as readable text
   3. ✅ [CLD11] T165.2.3: Include all settings: spacing, layers, visualization options
   4. ✅ [CLD11] T165.2.4: Output to console with proper formatting

3. ✅ [CLD11] T165.3: Add formatting options
   1. ✅ [CLD11] T165.3.1: Use indentation for nested properties
   2. ✅ [CLD11] T165.3.2: Group related settings together
   3. ✅ [CLD11] T165.3.3: Include timestamp in output

### Technical Notes:

- Format should be human-readable and potentially copy-pasteable
- Consider JSON-like format for easy parsing
- Include all configuration values, even defaults

## T166: Reduce Origin Block Font Size

**Status**: COMPLETED
**Priority**: Low
**Description**: Reduce the font size on the origin block by 25% for better visual balance

### Tasks:

1. ✅ [CLD11] T166.1: Update origin block text size
   1. ✅ [CLD11] T166.1.1: Locate makeOriginBlock function
   2. ✅ [CLD11] T166.1.2: Identify current font size setting
   3. ✅ [CLD11] T166.1.3: Reduce font size by 25%
   4. ✅ [CLD11] T166.1.4: Test visibility at new size

### Technical Notes:

- Origin block is the reference cube at the center of the visualization
- Font size reduction should maintain readability
- Affects axis labels (X, Y, Z) on the origin block
