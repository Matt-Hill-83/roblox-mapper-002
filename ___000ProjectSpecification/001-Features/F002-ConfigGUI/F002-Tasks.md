## T153: Add Link Diameter Control

**Status**: NOT STARTED
**Priority**: Medium
**Description**: Add input field to control the diameter/thickness of connector ropes

### Tasks:

1. 🔲 [CLD7] T153.1: Add link diameter input to GUI

   1. 🔲 [CLD7] T153.1.1: Add "Link Diameter" field to Global Settings section
   2. 🔲 [CLD7] T153.1.2: Set default value to appropriate thickness
   3. 🔲 [CLD7] T153.1.3: Add input validation (min: 0.1, max: 10)

2. 🔲 [CLD7] T153.2: Update interfaces and configuration

   1. 🔲 [CLD7] T153.2.1: Add linkDiameter field to SpacingConfig interface
   2. 🔲 [CLD7] T153.2.2: Update default configurations with link diameter value
   3. 🔲 [CLD7] T153.2.3: Ensure value persists through regenerate/update operations

3. 🔲 [CLD7] T153.3: Implement link diameter in renderer
   1. 🔲 [CLD7] T153.3.1: Pass link diameter to rope creation functions
   2. 🔲 [CLD7] T153.3.2: Apply diameter value to rope thickness/radius
   3. 🔲 [CLD7] T153.3.3: Test with various diameter values

### Technical Notes:

- Link diameter affects visual appearance only
- Should scale appropriately with other spacing values
- Consider rope physics when setting thickness

## T154: Update Minimum Values for Input Fields

**Status**: NOT STARTED
**Priority**: Low
**Description**: Change minimum value for all numeric input fields to 0.1

### Tasks:

1. 🔲 [CLD7] T154.1: Update spacing control minimums

   1. 🔲 [CLD7] T154.1.1: Change Node Height minimum to 0.1
   2. 🔲 [CLD7] T154.1.2: Change Node Radius minimum to 0.1 (already 0.5)
   3. 🔲 [CLD7] T154.1.3: Change Layer Spacing minimum to 0.1
   4. 🔲 [CLD7] T154.1.4: Change Node Spacing minimum to 0.1
   5. 🔲 [CLD7] T154.1.5: Change Swimlane Spacing minimum to 0.1

2. 🔲 [CLD7] T154.2: Update validation logic
   1. 🔲 [CLD7] T154.2.1: Modify spacingControls.ts validation ranges
   2. 🔲 [CLD7] T154.2.2: Test edge cases with very small values
   3. 🔲 [CLD7] T154.2.3: Ensure renderer handles small values gracefully

### Technical Notes:

- Very small values may cause rendering issues
- Test thoroughly with minimum values
- Consider warning messages for extremely small values

## T155: Add Random X Offset Checkbox

**Status**: NOT STARTED
**Priority**: Medium
**Description**: Add checkbox to randomly offset node X positions by 20 units

### Tasks:

1. 🔲 [CLD7] T155.1: Add checkbox to visualization controls

   1. 🔲 [CLD7] T155.1.1: Add "Rand X" checkbox to visualization controls
   2. 🔲 [CLD7] T155.1.2: Set default value to unchecked/false
   3. 🔲 [CLD7] T155.1.3: Update checkbox layout if needed

2. 🔲 [CLD7] T155.2: Update interfaces

   1. 🔲 [CLD7] T155.2.1: Add randomXOffset field to VisualizationOptions
   2. 🔲 [CLD7] T155.2.2: Update all default configs

3. 🔲 [CLD7] T155.3: Implement random offset logic
   1. 🔲 [CLD7] T155.3.1: Modify node positioning logic in UnifiedDataRenderer
   2. 🔲 [CLD7] T155.3.2: Apply 50% chance of +20 or -20 unit X offset
   3. 🔲 [CLD7] T155.3.3: Ensure offset is applied during both create and update
   4. 🔲 [CLD7] T155.3.4: Test with various node configurations

### Technical Notes:

- Random offset should be deterministic per node (same seed)
- Offset direction (+20 or -20) should also be random
- Consider impact on swim lane alignment
- This affects data generation, requires regeneration to see changes

## T156: Initialize New Layer with Previous Layer Values

**Status**: NOT STARTED
**Priority**: Medium
**Description**: When adding a new layer, initialize its values to match the layer above it

### Tasks:

1. 🔲 [CLD7] T156.1: Modify add layer functionality

   1. 🔲 [CLD7] T156.1.1: Update createLayerRow in layerGrid.ts
   2. 🔲 [CLD7] T156.1.2: Get values from the last layer in the array
   3. 🔲 [CLD7] T156.1.3: Copy numNodes and connectionsPerNode values

2. 🔲 [CLD7] T156.2: Handle edge cases
   1. 🔲 [CLD7] T156.2.1: Handle case when no layers exist (use defaults)
   2. 🔲 [CLD7] T156.2.2: Ensure layer number increments correctly
   3. 🔲 [CLD7] T156.2.3: Test with various layer configurations

### Technical Notes:

- Improves user experience by reducing repetitive input
- Should only copy editable values, not layer number
- Consider copying node/link type selections when dropdowns are implemented

## T157: Implement Tab Key Navigation

**Status**: NOT STARTED
**Priority**: Low
**Description**: Allow Tab key to navigate between input fields in the GUI

### Tasks:

1. 🔲 [CLD7] T157.1: Implement tab navigation system

   1. 🔲 [CLD7] T157.1.1: Create tab index management system
   2. 🔲 [CLD7] T157.1.2: Assign tab indices to all input fields
   3. 🔲 [CLD7] T157.1.3: Handle Tab key press in UserInputService

2. 🔲 [CLD7] T157.2: Define tab order

   1. 🔲 [CLD7] T157.2.1: Global Settings fields (top to bottom)
   2. 🔲 [CLD7] T157.2.2: Node/Link Types fields
   3. 🔲 [CLD7] T157.2.3: Layer grid fields (left to right, top to bottom)
   4. 🔲 [CLD7] T157.2.4: Loop back to first field after last

3. 🔲 [CLD7] T157.3: Handle special cases
   1. 🔲 [CLD7] T157.3.1: Skip disabled/readonly fields
   2. 🔲 [CLD7] T157.3.2: Handle Shift+Tab for reverse navigation
   3. 🔲 [CLD7] T157.3.3: Ensure focus visual feedback

### Technical Notes:

- Roblox doesn't have native tab navigation for GUIs
- Will need custom implementation using UserInputService
- Consider visual focus indicators for current field
- Test with dynamically added/removed layer rows

## T158: Update Default Checkbox Values

**Status**: COMPLETED
**Priority**: High
**Description**: Update default values for visualization checkboxes to false

### Tasks:

1. ✅ [CLD8] T158.1: Update showLinkLabels default to false

   1. ✅ [CLD8] T158.1.1: Update default in makeConfigGui.ts
   2. ✅ [CLD8] T158.1.2: Update default in graphInitializer.service.ts
   3. ✅ [CLD8] T158.1.3: Update checkbox field default in visualizationControls.ts

2. ✅ [CLD8] T158.2: Update allowSameLevelLinks default to false
   1. ✅ [CLD8] T158.2.1: Update default in makeConfigGui.ts
   2. ✅ [CLD8] T158.2.2: Update default in graphInitializer.service.ts
   3. ✅ [CLD8] T158.2.3: Update checkbox field default in visualizationControls.ts

### Technical Notes:

- Ensure all places where defaults are defined are updated
- Test that new graphs start with these checkboxes unchecked

## T159: Update Node Height Minimum Value

**Status**: COMPLETED
**Priority**: Medium
**Description**: Change the minimum value for Node Height from 1 to 0.1

### Tasks:

1. ✅ [CLD8] T159.1: Update Node Height minimum in spacingControls.ts
   1. ✅ [CLD8] T159.1.1: Change min value from 1 to 0.1 in SPACING_FIELDS array
   2. ✅ [CLD8] T159.1.2: Updated all spacing fields to have min value of 0.1 and allow decimal precision

### Technical Notes:

- This allows for much smaller nodes
- May need to test rendering with very small values
- Consider impact on label visibility with small nodes

## T160: Fix Link Type Colors

**Status**: COMPLETED
**Priority**: High
**Description**: Fix issue where all link types display as red instead of their assigned colors

### Tasks:

1. ✅ [CLD9] T160.1: Identify root cause of color issue

   1. ✅ [CLD9] T160.1.1: Check link type naming in UnifiedDataRenderer
   2. ✅ [CLD9] T160.1.2: Verify color mapping in ropeCreator
   3. ✅ [CLD9] T160.1.3: Check RENDERER_CONSTANTS color definitions

2. ✅ [CLD9] T160.2: Fix link type color assignment
   1. ✅ [CLD9] T160.2.1: Update link type names to match color mapping
   2. ✅ [CLD9] T160.2.2: Added Link1, Link2, Link3 to color mappings
   3. ✅ [CLD9] T160.2.3: Fixed inconsistent type naming in update method

### Technical Notes:

- Links are showing red which is the default/fallback color
- Likely a mismatch between generated link type names and color mapping keys

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
