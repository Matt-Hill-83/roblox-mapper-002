## T150: Implement GUI Layout Improvements

**Status**: COMPLETED
**Priority**: High
**Description**: Reorganize GUI layout to match the ASCII mockup with separate sections for Global Settings and Node/Link Types

### Tasks:

1. ✅ [CLD5] T150.1: Restructure GUI layout sections

   1. ✅ [CLD5] T150.1.1: Update GUI title from "Enhanced Data Generator" to "Generator Configuration"
   2. ✅ [CLD5] T150.1.2: Create separate "Global Settings" section with visual border
   3. ✅ [CLD5] T150.1.3: Create separate "Node/Link Types" section with visual border
   4. ✅ [CLD5] T150.1.4: Move Number of Node Types and Number of Link Types to new section
   5. ✅ [CLD5] T150.1.5: Update section spacing and alignment to match mockup

2. ✅ [CLD5] T150.2: Add spacing control fields to Global Settings

   1. ✅ [CLD5] T150.2.1: Add Node Height text input field with default value 10
   2. ✅ [CLD5] T150.2.2: Add Node Radius text input field with default value 2
   3. ✅ [CLD5] T150.2.3: Add Layer Spacing text input field with default value 20
   4. ✅ [CLD5] T150.2.4: Add Node Spacing text input field with default value 8
   5. ✅ [CLD5] T150.2.5: Add Swimlane Spacing text input field with default value 12

3. ✅ [CLD5] T150.3: Implement spacing controls in renderer

   1. ✅ [CLD5] T150.3.1: Update UnifiedDataRenderer to accept spacing parameters
   2. ✅ [CLD5] T150.3.2: Apply node height to hexagon creation
   3. ✅ [CLD5] T150.3.3: Apply node radius to hexagon width/size
   4. ✅ [CLD5] T150.3.4: Apply layer spacing to Y-axis separation between layers
   5. ✅ [CLD5] T150.3.5: Apply node spacing to X-axis separation within layers
   6. ✅ [CLD5] T150.3.6: Apply swimlane spacing to column separation

4. ✅ [CLD5] T150.4: Add input validation for spacing controls

   1. ✅ [CLD5] T150.4.1: Validate Node Height (min: 1, max: 100)
   2. ✅ [CLD5] T150.4.2: Validate Node Radius (min: 0.5, max: 20)
   3. ✅ [CLD5] T150.4.3: Validate Layer Spacing (min: 1, max: 200)
   4. ✅ [CLD5] T150.4.4: Validate Node Spacing (min: 1, max: 100)
   5. ✅ [CLD5] T150.4.5: Validate Swimlane Spacing (min: 1, max: 100)

5. ✅ [CLD5] T150.5: Update configuration interfaces
   1. ✅ [CLD5] T150.5.1: Add spacing fields to EnhancedGeneratorConfig interface
   2. ✅ [CLD5] T150.5.2: Update GraphInitializerService default config with spacing values
   3. ✅ [CLD5] T150.5.3: Ensure spacing values persist through regenerate/update operations
   4. ✅ [CLD5] T150.5.4: Pass spacing config from GUI to server via remote events

### Additional Improvements:

6. ✅ [CLD5] T150.6: Update GUI height to 90% of screen to prevent scrolling

### Technical Notes:

- Spacing controls affect visual layout only, not data generation
- Must maintain backward compatibility with existing saved configurations
- Default values should match current hardcoded constants in renderer
- Consider creating a SpacingConfig interface for cleaner parameter passing

## T151: Implement Quit Game Shortcut

**Status**: NOT STARTED
**Priority**: Low
**Description**: Allow users to quit the game by pressing Esc then P

### Tasks:

1. 🔲 [CLD5] T151.1: Create keyboard input handler

   1. 🔲 [CLD5] T151.1.1: Create new client service for keyboard shortcuts
   2. 🔲 [CLD5] T151.1.2: Detect Esc key press
   3. 🔲 [CLD5] T151.1.3: Start timeout for P key after Esc
   4. 🔲 [CLD5] T151.1.4: Clear timeout if different key pressed

2. 🔲 [CLD5] T151.2: Implement quit functionality
   1. 🔲 [CLD5] T151.2.1: Show confirmation dialog when Esc+P detected
   2. 🔲 [CLD5] T151.2.2: Quit game if confirmed
   3. 🔲 [CLD5] T151.2.3: Cancel on dialog dismiss or timeout

### Technical Notes:

- Use UserInputService for keyboard detection
- Consider 1-2 second window for P after Esc
- Show visual feedback when Esc pressed
