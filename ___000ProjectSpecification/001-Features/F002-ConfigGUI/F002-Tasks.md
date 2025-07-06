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
**Status**: TODO
**Priority**: High
**Description**: Modify the system so that default values from GraphInitializerService populate the GUI on startup

### Tasks:

1. ⬜ T134.1: Update GraphInitializerService to send config before GUI creation
   1. ⬜ T134.1.1: Modify initialization timing to send config immediately on player join
   2. ⬜ T134.1.2: Store default configuration in ReplicatedStorage for client access
   3. ⬜ T134.1.3: Remove the wait delays that might cause timing issues

2. ⬜ T134.2: Update ConfigGUIController to use server defaults
   1. ⬜ T134.2.1: Wait for initial configuration from server before creating GUI
   2. ⬜ T134.2.2: Use server-provided config as initial values instead of hardcoded defaults
   3. ⬜ T134.2.3: Handle timeout case if server config doesn't arrive

3. ⬜ T134.3: Synchronize GUI state with server defaults
   1. ⬜ T134.3.1: Ensure enhanced mode layers match server configuration
   2. ⬜ T134.3.2: Update global settings (node/link types) from server config
   3. ⬜ T134.3.3: Display correct values in all input fields and dropdowns

4. ⬜ T134.4: Remove automatic generation on startup
   1. ⬜ T134.4.1: Remove the "triggerGeneration" event from GraphInitializerService
   2. ⬜ T134.4.2: Let user manually trigger first generation via GUI
   3. ⬜ T134.4.3: Update status to show "Ready" instead of auto-generating

5. ⬜ T134.5: Test and verify synchronization
   1. ⬜ T134.5.1: Verify GUI shows server default values on startup
   2. ⬜ T134.5.2: Test with multiple players joining at different times
   3. ⬜ T134.5.3: Ensure no duplicate generation or timing conflicts

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
**Status**: TODO
**Priority**: High
**Description**: Fix the issue where new nodes created by the Update button appear at origin instead of proper swim lane positions

### Tasks:

1. ⬜ T141.1: Debug position calculation in performIncrementalUpdate
   1. ⬜ T141.1.1: Investigate why new nodes don't get swim lane positions
   2. ⬜ T141.1.2: Ensure calculateLayerSwimLanePositions is called properly
   3. ⬜ T141.1.3: Verify position assignment to new hexagons

2. ⬜ T141.2: Fix position update logic
   1. ⬜ T141.2.1: Ensure all nodes (new and existing) participate in positioning
   2. ⬜ T141.2.2: Update hexagon positions after swim lane calculation
   3. ⬜ T141.2.3: Test with various update scenarios

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