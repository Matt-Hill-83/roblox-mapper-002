# Feature 002: Configuration GUI Tasks

## T130: Configuration GUI (R1)

1. ✅ [CLD1] T130.1: Create GUI service and basic screen GUI structure (R1.1)
   1. ✅ [CLD1] T130.1.1: Create configGUI.service.ts
   2. ✅ [CLD1] T130.1.2: Create ScreenGui with Frame positioned in upper left
   3. ✅ [CLD1] T130.1.3: Set up proper GUI styling and layout
2. ✅ [CLD1] T130.2: Display current configuration (R1.2)
   1. ✅ [CLD1] T130.2.1: Create labels for each config parameter
   2. ✅ [CLD1] T130.2.2: Display current values from config001
3. ✅ [CLD1] T130.3: Add input controls (R1.3)
   1. ✅ [CLD1] T130.3.1: Create TextBox inputs for each parameter
   2. ✅ [CLD1] T130.3.2: Add input validation for numeric values
   3. ✅ [CLD1] T130.3.3: Add min/max constraints per parameter
4. ✅ [CLD1] T130.4: Implement regenerate functionality (R1.4-R1.5)
   1. ✅ [CLD1] T130.4.1: Add "Regenerate" button
   2. ✅ [CLD1] T130.4.2: Clear existing visualization on regenerate
   3. ✅ [CLD1] T130.4.3: Generate new cluster with updated config
   4. ✅ [CLD1] T130.4.4: Render new visualization

## T131: Enhanced Data Generator GUI (R2)

1. ✅ [CLD3] T131.1: Update GUI to control new data generator (R2.1)

   1. ✅ [CLD3] T131.1.1: Refactor GUI to support both original and enhanced modes
   2. ✅ [CLD3] T131.1.2: Create interface for data generator integration
   3. ✅ [CLD3] T131.1.3: Implement mode switching mechanism

2. ✅ [CLD3] T131.2: Implement global settings controls (R2.2)

   1. ✅ [CLD3] T131.2.1: Create Number of Node Types dropdown selector (R2.2.1)
   2. ✅ [CLD3] T131.2.2: Create Number of Link Types dropdown selector (R2.2.2)
   3. ✅ [CLD3] T131.2.3: Populate dropdowns with appropriate ranges
   4. ✅ [CLD3] T131.2.4: Implement change handlers for global settings

3. ✅ [CLD3] T131.3: Create grid-based layer configuration interface (R2.3)

   1. ✅ [CLD3] T131.3.1: Design grid layout with rows representing layers (R2.3.1)
   2. ✅ [CLD3] T131.3.2: Implement auto-generated layer numbering system (R2.3.2)
   3. ✅ [CLD3] T131.3.3: Create "Add Layer" button functionality (R2.3.3)
   4. ✅ [CLD3] T131.3.4: Implement layer removal via delete buttons (R2.3.4)
   5. ✅ [CLD3] T131.3.5: Handle dynamic grid resizing and scrolling

4. ✅ [CLD3] T131.4: Implement layer row controls (R2.4)

   1. ✅ [CLD3] T131.4.1: Display read-only layer numbers (R2.4.1)
   2. ✅ [CLD3] T131.4.2: Create "Number of nodes" text input fields (R2.4.2)
   3. ✅ [CLD3] T131.4.3: Create "Connections per node" text input fields (R2.4.3)
   4. ✅ [CLD3] T131.4.4: Implement Node Type dropdown selectors (R2.4.4)
   5. ✅ [CLD3] T131.4.5: Implement Link Type dropdown selectors (R2.4.5)
   6. ✅ [CLD3] T131.4.6: Create delete [X] buttons for each row (R2.4.6)

5. ✅ [CLD3] T131.5: Implement action buttons and status area (R2.5-R2.6)
   1. ✅ [CLD3] T131.5.1: Update "Regenerate" button for new data generator (R2.5.1)
   2. ✅ [CLD3] T131.5.2: Create "Clear" button to reset all settings (R2.5.2)
   3. ✅ [CLD3] T131.5.3: Implement status message display area (R2.6)
   4. ✅ [CLD3] T131.5.4: Add status updates for user actions
   5. ✅ [CLD3] T131.5.5: Implement error handling and validation messages

## T132: Swap Data Generators to Use DataGeneratorRobloxRenderer with GUI

**Status**: COMPLETED
**Priority**: High
**Description**: Replace the current test generator with DataGeneratorRobloxRenderer which has swim lane positioning and better colors

### Tasks:

1. ✅ [CLD4] T132.1: Update ConfigGUIServerService to use DataGeneratorRobloxRenderer

   1. ✅ [CLD4] T132.1.1: Import DataGeneratorRobloxRenderer in configGUIServer.service.ts
   2. ✅ [CLD4] T132.1.2: Replace TestSimpleDataGeneratorService with DataGeneratorRobloxRenderer
   3. ✅ [CLD4] T132.1.3: Update constructor to create DataGeneratorRobloxRenderer instance instead of receiving testGenerator
   4. ✅ [CLD4] T132.1.4: Remove testGenerator parameter from ConfigGUIServerService constructor

2. ✅ [CLD4] T132.2: Update simple mode regeneration to use DataGeneratorRobloxRenderer

   1. ✅ [CLD4] T132.2.1: Replace `testGenerator.regenerateWithConfig()` with `dataGeneratorRenderer.renderGeneratedData()`
   2. ✅ [CLD4] T132.2.2: Pass the configuration object directly to renderGeneratedData
   3. ✅ [CLD4] T132.2.3: Ensure proper clearing of existing visualization before regeneration

3. ✅ [CLD4] T132.3: Update enhanced mode to use DataGeneratorRobloxRenderer with custom positions

   1. ✅ [CLD4] T132.3.1: Create a new method in DataGeneratorRobloxRenderer to accept pre-positioned cluster data
   2. ✅ [CLD4] T132.3.2: Method should skip the swim lane positioning when positions are already provided
   3. ✅ [CLD4] T132.3.3: Update enhanced mode to use this new method instead of testGenerator.renderCluster

4. ✅ [CLD4] T132.4: Update GameService to not pass testGenerator

   1. ✅ [CLD4] T132.4.1: Remove testGenerator parameter when creating ConfigGUIServerService
   2. ✅ [CLD4] T132.4.2: Remove the TestSimpleDataGeneratorService import and instance from GameService
   3. ✅ [CLD4] T132.4.3: Clean up any unused imports

5. ✅ [CLD4] T132.5: Ensure consistent visualization between modes
   1. ✅ [CLD4] T132.5.1: Verify simple mode uses swim lane positioning from DataGeneratorRobloxRenderer
   2. ✅ [CLD4] T132.5.2: Verify enhanced mode respects the layer-based positions from enhancedDataGenerator
   3. ✅ [CLD4] T132.5.3: Test switching between simple and enhanced modes maintains visual consistency
   4. ✅ [CLD4] T132.5.4: Ensure both modes use the same color schemes and node/link rendering

### Technical Notes:

- DataGeneratorRobloxRenderer already has swim lane positioning logic
- It uses SimpleDataGeneratorService internally which has better node/link generation
- The renderer creates proper folder structure and uses consistent styling
- Need to preserve enhanced mode's layer-based positioning while adopting the better rendering

## T133: Graph Initializer (R3)

**Status**: COMPLETED
**Priority**: Medium
**Description**: Create a service that initializes the graph with default configuration on game startup

### Tasks:

1. ✅ [CLD4] T133.1: Create graph initialization service (R3.1)

   1. ✅ [CLD4] T133.1.1: Create graphInitializer.service.ts in server/services
   2. ✅ [CLD4] T133.1.2: Define interface for initialization parameters
   3. ✅ [CLD4] T133.1.3: Implement service class with initialization method

2. ✅ [CLD4] T133.2: Integrate with game.service startup (R3.2)

   1. ✅ [CLD4] T133.2.1: Import GraphInitializerService in game.service.ts
   2. ✅ [CLD4] T133.2.2: Create instance during game startup
   3. ✅ [CLD4] T133.2.3: Call initialization after GUI server is ready

3. ✅ [CLD4] T133.3: Pass configuration to GUI (R3.3)

   1. ✅ [CLD4] T133.3.1: Define initial position for graph bottom center (R3.3.1)
   2. ✅ [CLD4] T133.3.2: Create default graph configuration object (R3.3.2)
   3. ✅ [CLD4] T133.3.3: Pass configuration through remote event to GUI

4. ✅ [CLD4] T133.4: Trigger automatic generation (R3.4)
   1. ✅ [CLD4] T133.4.1: Send generation request after GUI receives configuration
   2. ✅ [CLD4] T133.4.2: Ensure generation uses passed position parameter
   3. ✅ [CLD4] T133.4.3: Test automatic generation on game startup

### Technical Notes:

- Should coordinate with ConfigGUIServerService
- Initial position affects where the graph origin appears
- Default configuration should create a reasonable starter graph
- Consider making initial generation optional via configuration

## T134: Populate GUI with Default Values (R3 Enhancement)

**Status**: COMPLETED
**Priority**: High
**Description**: Modify the system so that default values from GraphInitializerService populate the GUI on startup

### Tasks:

1. ✅ [CLD5] T134.1: Update GraphInitializerService to send config before GUI creation

   1. ✅ [CLD5] T134.1.1: Modify initialization timing to send config immediately on player join
   2. ✅ [CLD5] T134.1.2: Store default configuration in ReplicatedStorage for client access
   3. ✅ [CLD5] T134.1.3: Remove the wait delays that might cause timing issues

2. ✅ [CLD5] T134.2: Update ConfigGUIController to use server defaults

   1. ✅ [CLD5] T134.2.1: Wait for initial configuration from server before creating GUI
   2. ✅ [CLD5] T134.2.2: Use server-provided config as initial values instead of hardcoded defaults
   3. ✅ [CLD5] T134.2.3: Handle timeout case if server config doesn't arrive

3. ✅ [CLD5] T134.3: Synchronize GUI state with server defaults

   1. ✅ [CLD5] T134.3.1: Ensure enhanced mode layers match server configuration
   2. ✅ [CLD5] T134.3.2: Update global settings (node/link types) from server config
   3. ✅ [CLD5] T134.3.3: Display correct values in all input fields and dropdowns

4. ✅ [CLD5] T134.4: Remove automatic generation on startup

   1. ✅ [CLD5] T134.4.1: Remove the "triggerGeneration" event from GraphInitializerService
   2. ✅ [CLD5] T134.4.2: Let user manually trigger first generation via GUI
   3. ✅ [CLD5] T134.4.3: Update status to show "Ready" instead of auto-generating

5. ✅ [CLD5] T134.5: Test and verify synchronization
   1. ✅ [CLD5] T134.5.1: Verify GUI shows server default values on startup
   2. ✅ [CLD5] T134.5.2: Test with multiple players joining at different times
   3. ✅ [CLD5] T134.5.3: Ensure no duplicate generation or timing conflicts

### Technical Notes:

- Current issue: GUI creates with hardcoded defaults before receiving server config
- Solution: Make GUI wait for server config or access shared default values
- Alternative: Store defaults in ReplicatedStorage that both client and server can access
- Consider using Attributes or Configuration objects for shared defaults

## T135: Create Unified Layer-Based Renderer with Swim Lanes

**Status**: COMPLETED
**Priority**: High
**Description**: Create a unified renderer that properly handles layer-based configuration with swim lane positioning

### Tasks:

1. ✅ [CLD4] T135.1: Create new UnifiedDataRenderer

   1. ✅ [CLD4] T135.1.1: Create unifiedDataRenderer.ts in shared/modules/renderers
   2. ✅ [CLD4] T135.1.2: Import best parts from DataGeneratorRobloxRenderer (colors, rendering)
   3. ✅ [CLD4] T135.1.3: Import swim lane positioning algorithm
   4. ✅ [CLD4] T135.1.4: Design to accept layer-based input natively

2. ✅ [CLD4] T135.2: Implement layer-aware data generation

   1. ✅ [CLD4] T135.2.1: Generate nodes based on layer configuration (not fixed hierarchy)
   2. ✅ [CLD4] T135.2.2: Use color system from SimpleDataGeneratorService
   3. ✅ [CLD4] T135.2.3: Create relationships based on connections per node
   4. ✅ [CLD4] T135.2.4: Support arbitrary number of layers

3. ✅ [CLD4] T135.3: Implement swim lane positioning for layers

   1. ✅ [CLD4] T135.3.1: Adapt calculateSwimLanePositions to work with layers
   2. ✅ [CLD4] T135.3.2: Position nodes in columns based on relationships
   3. ✅ [CLD4] T135.3.3: Handle inter-layer connections properly
   4. ✅ [CLD4] T135.3.4: Maintain visual hierarchy while using swim lanes

4. ✅ [CLD4] T135.4: Update server to use unified renderer

   1. ✅ [CLD4] T135.4.1: Replace both DataGeneratorRobloxRenderer and enhancedDataGenerator
   2. ✅ [CLD4] T135.4.2: Use UnifiedDataRenderer for all generation
   3. ✅ [CLD4] T135.4.3: Remove mode-specific code paths
   4. ✅ [CLD4] T135.4.4: Simplify to single generation method

5. ✅ [CLD4] T135.5: Clean up and remove old code
   1. ✅ [CLD4] T135.5.1: Remove simple/enhanced mode distinction
   2. ✅ [CLD4] T135.5.2: Remove old generator imports
   3. ✅ [CLD4] T135.5.3: Update GUI to remove mode selection
   4. ✅ [CLD4] T135.5.4: Test unified system thoroughly

### Technical Notes:

- This is a proper architectural solution, not a patch
- Combines the flexibility of layers with swim lane positioning
- Uses the good color system from SimpleDataGeneratorService
- Maintains clean separation of concerns
- No hacky conversions between incompatible data models

## T136: Fix Initial GUI Population and Group Positioning

**Status**: COMPLETED
**Priority**: High
**Description**: Fix GUI to show initial configuration values and position group bottom center at origin

### Tasks:

1. ✅ [CLD4] T136.1: Fix GUI initial value population

   1. ✅ [CLD4] T136.1.1: Update GraphInitializerService to wait for GUI creation
   2. ✅ [CLD4] T136.1.2: Ensure initial config is sent after GUI is ready
   3. ✅ [CLD4] T136.1.3: Update ConfigGUIController to wait for initial config before creating GUI
   4. ✅ [CLD4] T136.1.4: Test that GUI shows server default values on startup

2. ✅ [CLD4] T136.2: Position group bottom center at origin

   1. ✅ [CLD4] T136.2.1: Calculate bounding box of all nodes after swim lane positioning
   2. ✅ [CLD4] T136.2.2: Find the lowest Y position (bottom of group)
   3. ✅ [CLD4] T136.2.3: Calculate center X position of group
   4. ✅ [CLD4] T136.2.4: Offset all node positions so bottom center aligns with origin (0,0,0)

3. ✅ [CLD4] T136.3: Pass origin configuration to renderer
   1. ✅ [CLD4] T136.3.1: Add origin parameter to UnifiedDataRenderer.renderEnhancedData
   2. ✅ [CLD4] T136.3.2: Update ConfigGUIServerService to pass origin from config
   3. ✅ [CLD4] T136.3.3: Use origin as the reference point for bottom center alignment

### Technical Notes:

- GUI issue: Currently GUI creates before receiving initial config from server
- Position issue: Nodes are positioned relative to BASE_Y but not centered on origin
- Origin should be the bottom center of the entire node group

## T140: Add Update Button for Incremental Data Updates

**Status**: COMPLETED (with known issue)
**Priority**: High
**Description**: Add an Update button to the GUI that modifies existing data instead of recreating the entire graph

### Tasks:

1. ✅ [CLD5] T140.1: Add Update button to GUI interface

   1. ✅ [CLD5] T140.1.1: Add button between Regenerate and Clear buttons
   2. ✅ [CLD5] T140.1.2: Style consistently with other buttons
   3. ✅ [CLD5] T140.1.3: Add click handler for update operation
   4. ✅ [CLD5] T140.1.4: Add onUpdateRequest callback to service interface

2. ✅ [CLD5] T140.2: Create incremental update logic in UnifiedDataRenderer

   1. ✅ [CLD5] T140.2.1: Add updateEnhancedData method alongside renderEnhancedData
   2. ✅ [CLD5] T140.2.2: Track existing nodes by layer and index
   3. ✅ [CLD5] T140.2.3: Compare new config with existing state
   4. ✅ [CLD5] T140.2.4: Add/remove nodes as needed per layer

3. ✅ [CLD5] T140.3: Handle node additions and removals

   1. ✅ [CLD5] T140.3.1: When layer node count increases, add new nodes at end
   2. ✅ [CLD5] T140.3.2: When layer node count decreases, remove nodes from end
   3. ✅ [CLD5] T140.3.3: Preserve existing node positions and properties
   4. ✅ [CLD5] T140.3.4: Recalculate swim lanes only for affected layers

4. ✅ [CLD5] T140.4: Handle layer additions and removals

   1. ✅ [CLD5] T140.4.1: Add new layers with proper positioning
   2. ✅ [CLD5] T140.4.2: Remove deleted layers and their nodes
   3. ✅ [CLD5] T140.4.3: Update layer numbering for remaining layers
   4. ✅ [CLD5] T140.4.4: Maintain visual hierarchy

5. ✅ [CLD5] T140.5: Update connections incrementally
   1. ✅ [CLD5] T140.5.1: Remove connections for deleted nodes
   2. ✅ [CLD5] T140.5.2: Add connections for new nodes
   3. ✅ [CLD5] T140.5.3: Update connection counts for existing nodes
   4. ✅ [CLD5] T140.5.4: Preserve existing connections where possible

### Technical Notes:

- Update should be more efficient than full regeneration
- Preserve as much existing structure as possible
- Maintain visual continuity for user
- Store current configuration state for comparison
- Only modify what has changed
- Need to calculate group bounds after swim lane positioning
- **KNOWN ISSUE**: New nodes are created at 0,0,0 instead of proper positions

## T141: Fix Update Button - Nodes Created at 0,0,0

**Status**: COMPLETED
**Priority**: High
**Description**: Fix the issue where new nodes created by the Update button appear at origin instead of proper swim lane positions

### Tasks:

1. ✅ [CLD5] T141.1: Debug position calculation in performIncrementalUpdate

   1. ✅ [CLD5] T141.1.1: Investigate why new nodes don't get swim lane positions
   2. ✅ [CLD5] T141.1.2: Ensure calculateLayerSwimLanePositions is called properly
   3. ✅ [CLD5] T141.1.3: Verify position assignment to new hexagons

2. ✅ [CLD5] T141.2: Fix position update logic
   1. ✅ [CLD5] T141.2.1: Ensure all nodes (new and existing) participate in positioning
   2. ✅ [CLD5] T141.2.2: Update hexagon positions after swim lane calculation
   3. ✅ [CLD5] T141.2.3: Test with various update scenarios

### Technical Notes:

- Issue was that hexagons were created before swim lane positioning was calculated
- Fixed by delaying hexagon creation for new nodes until after positioning
- Existing nodes keep their hexagons and just update positions

## T142: Initialize New Layer with Values from Row Above

**Status**: COMPLETED
**Priority**: Medium
**Description**: When adding a new layer, copy values from the previous layer instead of using defaults

### Tasks:

1. ✅ [CLD5] T142.1: Update addLayer function in layerGrid.ts
   1. ✅ [CLD5] T142.1.1: Check if previous layers exist
   2. ✅ [CLD5] T142.1.2: Copy numNodes, connectionsPerNode, nodeType, linkType from previous layer
   3. ✅ [CLD5] T142.1.3: Use sensible defaults only for first layer

## T143: Replace Dropdowns with Number Input Boxes

**Status**: COMPLETED
**Priority**: Medium
**Description**: Replace the two global settings dropdowns with number input boxes for consistency

### Tasks:

1. ✅ [CLD5] T143.1: Replace node types dropdown

   1. ✅ [CLD5] T143.1.1: Remove dropdown creation code
   2. ✅ [CLD5] T143.1.2: Create TextBox input with validation
   3. ✅ [CLD5] T143.1.3: Ensure values stay within valid range (1-10)

2. ✅ [CLD5] T143.2: Replace link types dropdown

   1. ✅ [CLD5] T143.2.1: Remove dropdown creation code
   2. ✅ [CLD5] T143.2.2: Create TextBox input with validation
   3. ✅ [CLD5] T143.2.3: Ensure values stay within valid range (1-10)

3. ✅ [CLD5] T143.3: Remove unused dropdown imports
   1. ✅ [CLD5] T143.3.1: Remove createDropdown import from globalSettings.ts

## T150: Implement GUI Layout Improvements

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

**Status**: COMPLETED
**Priority**: Low
**Description**: Allow users to quit the game by pressing Esc then P

### Tasks:

1. ✅ [CLD6] T151.1: Create keyboard input handler

   1. ✅ [CLD6] T151.1.1: Create new client service for keyboard shortcuts
   2. ✅ [CLD6] T151.1.2: Detect Esc key press
   3. ✅ [CLD6] T151.1.3: Start timeout for P key after Esc
   4. ✅ [CLD6] T151.1.4: Clear timeout if different key pressed

2. ✅ [CLD6] T151.2: Implement quit functionality
   1. ✅ [CLD6] T151.2.1: Show confirmation dialog when Esc+P detected
   2. ✅ [CLD6] T151.2.2: Quit game if confirmed
   3. ✅ [CLD6] T151.2.3: Cancel on dialog dismiss or timeout

### Technical Notes:

- Use UserInputService for keyboard detection
- Consider 1-2 second window for P after Esc
- Show visual feedback when Esc pressed

## T152: Implement Visualization Control Checkboxes

**Status**: COMPLETED
**Priority**: High
**Description**: Add checkboxes to control visualization options for links and labels

### Tasks:

1. ✅ [CLD6] T152.1: Add checkbox section to GUI

   1. ✅ [CLD6] T152.1.1: Create visualization controls component
   2. ✅ [CLD6] T152.1.2: Position checkboxes in bottom-right corner
   3. ✅ [CLD6] T152.1.3: Style checkboxes with proper sizing and spacing

2. ✅ [CLD6] T152.2: Create checkbox components

   1. ✅ [CLD6] T152.2.1: "Show link labels" checkbox (default: checked/true)
   2. ✅ [CLD6] T152.2.2: "Show connectors" checkbox (default: checked/true)
   3. ✅ [CLD6] T152.2.3: "Create same-layer links" checkbox (default: checked/true)

3. ✅ [CLD6] T152.3: Add visualization flags to interfaces

   1. ✅ [CLD6] T152.3.1: Create VisualizationOptions interface
   2. ✅ [CLD6] T152.3.2: Add visualization field to EnhancedGeneratorConfig
   3. ✅ [CLD6] T152.3.3: Update all default configs with visualization options

4. ✅ [CLD6] T152.4: Implement real-time visualization updates

   1. ✅ [CLD6] T152.4.1: Handle checkbox state changes
   2. ✅ [CLD6] T152.4.2: Trigger immediate config update on change
   3. ✅ [CLD6] T152.4.3: Update status message on visualization change

5. ✅ [CLD6] T152.5: Update renderer to respect visualization flags
   1. ✅ [CLD6] T152.5.1: Modify rope creator to check showConnectors flag
   2. ✅ [CLD6] T152.5.2: Modify rope creator to check showLinkLabels flag
   3. ✅ [CLD6] T152.5.3: Modify data generator to check allowSameLevelLinks during generation
   4. ✅ [CLD6] T152.5.4: Update incremental update logic to respect same flags

### Additional Changes:

6. ✅ [CLD6] T152.6: Update default values

   1. ✅ [CLD6] T152.6.1: Change default number of node types from 3 to 4
   2. ✅ [CLD6] T152.6.2: Change default number of link types from 1 to 3
   3. ✅ [CLD6] T152.6.3: Update all checkbox defaults to true

7. ✅ [CLD6] T152.7: Remove debug print statements
   1. ✅ [CLD6] T152.7.1: Remove prints from textBoxMaker
   2. ✅ [CLD6] T152.7.2: Remove prints from hexagonMaker
   3. ✅ [CLD6] T152.7.3: Remove prints from labelGroupMaker

### Technical Notes:

- "Show connectors" controls rope visibility
- "Show link labels" controls label visibility on ropes
- "Create same-layer links" controls data generation, not just display
- Checkboxes positioned to avoid overlapping with other UI elements
- All visualization options require immediate update without full regeneration

## T153: Add Link Diameter Control

**Status**: COMPLETED
**Priority**: Medium
**Description**: Add input field to control the diameter/thickness of connector ropes

### Tasks:

1. ✅ [CLD7] T153.1: Add link diameter input to GUI

   1. ✅ [CLD7] T153.1.1: Add "Link Diameter" field to Global Settings section
   2. ✅ [CLD7] T153.1.2: Set default value to appropriate thickness
   3. ✅ [CLD7] T153.1.3: Add input validation (min: 0.1, max: 10)

2. ✅ [CLD7] T153.2: Update interfaces and configuration

   1. ✅ [CLD7] T153.2.1: Add linkDiameter field to SpacingConfig interface
   2. ✅ [CLD7] T153.2.2: Update default configurations with link diameter value
   3. ✅ [CLD7] T153.2.3: Ensure value persists through regenerate/update operations

3. ✅ [CLD7] T153.3: Implement link diameter in renderer
   1. ✅ [CLD7] T153.3.1: Pass link diameter to rope creation functions
   2. ✅ [CLD7] T153.3.2: Apply diameter value to rope thickness/radius
   3. ✅ [CLD7] T153.3.3: Test with various diameter values

### Technical Notes:

- Link diameter affects visual appearance only
- Should scale appropriately with other spacing values
- Consider rope physics when setting thickness

## T154: Update Minimum Values for Input Fields

**Status**: COMPLETED
**Priority**: Low
**Description**: Change minimum value for all numeric input fields to 0.1

### Tasks:

1. ✅ [CLD7] T154.1: Update spacing control minimums

   1. ✅ [CLD7] T154.1.1: Change Node Height minimum to 0.1
   2. ✅ [CLD7] T154.1.2: Change Node Radius minimum to 0.1 (already 0.5)
   3. ✅ [CLD7] T154.1.3: Change Layer Spacing minimum to 0.1
   4. ✅ [CLD7] T154.1.4: Change Node Spacing minimum to 0.1
   5. ✅ [CLD7] T154.1.5: Change Swimlane Spacing minimum to 0.1

2. ✅ [CLD7] T154.2: Update validation logic
   1. ✅ [CLD7] T154.2.1: Modify spacingControls.ts validation ranges
   2. ✅ [CLD7] T154.2.2: Test edge cases with very small values
   3. ✅ [CLD7] T154.2.3: Ensure renderer handles small values gracefully

### Technical Notes:

- Very small values may cause rendering issues
- Test thoroughly with minimum values
- Consider warning messages for extremely small values

## T155: Add Random X Offset Checkbox

**Status**: COMPLETED
**Priority**: Medium
**Description**: Add checkbox to randomly offset node X positions by 20 units

### Tasks:

1. ✅ [CLD7] T155.1: Add checkbox to visualization controls

   1. ✅ [CLD7] T155.1.1: Add "Rand X" checkbox to visualization controls
   2. ✅ [CLD7] T155.1.2: Set default value to unchecked/false
   3. ✅ [CLD7] T155.1.3: Update checkbox layout if needed

2. ✅ [CLD7] T155.2: Update interfaces

   1. ✅ [CLD7] T155.2.1: Add randomXOffset field to VisualizationOptions
   2. ✅ [CLD7] T155.2.2: Update all default configs

3. ✅ [CLD7] T155.3: Implement random offset logic
   1. ✅ [CLD7] T155.3.1: Modify node positioning logic in UnifiedDataRenderer
   2. ✅ [CLD7] T155.3.2: Apply 50% chance of +20 or -20 unit X offset
   3. ✅ [CLD7] T155.3.3: Ensure offset is applied during both create and update
   4. ✅ [CLD7] T155.3.4: Test with various node configurations

### Technical Notes:

- Random offset should be deterministic per node (same seed)
- Offset direction (+20 or -20) should also be random
- Consider impact on swim lane alignment
- This affects data generation, requires regeneration to see changes

## T156: Initialize New Layer with Previous Layer Values

**Status**: COMPLETED
**Priority**: Medium
**Description**: When adding a new layer, initialize its values to match the layer above it

### Tasks:

1. ✅ [CLD7] T156.1: Modify add layer functionality

   1. ✅ [CLD7] T156.1.1: Update createLayerRow in layerGrid.ts
   2. ✅ [CLD7] T156.1.2: Get values from the last layer in the array
   3. ✅ [CLD7] T156.1.3: Copy numNodes and connectionsPerNode values

2. ✅ [CLD7] T156.2: Handle edge cases
   1. ✅ [CLD7] T156.2.1: Handle case when no layers exist (use defaults)
   2. ✅ [CLD7] T156.2.2: Ensure layer number increments correctly
   3. ✅ [CLD7] T156.2.3: Test with various layer configurations

### Technical Notes:

- Improves user experience by reducing repetitive input
- Should only copy editable values, not layer number
- Consider copying node/link type selections when dropdowns are implemented

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
