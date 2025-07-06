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
**Status**: TODO
**Priority**: Medium
**Description**: Create a service that initializes the graph with default configuration on game startup

### Tasks:

1. ⬜ T133.1: Create graph initialization service (R3.1)
   1. ⬜ T133.1.1: Create graphInitializer.service.ts in server/services
   2. ⬜ T133.1.2: Define interface for initialization parameters
   3. ⬜ T133.1.3: Implement service class with initialization method

2. ⬜ T133.2: Integrate with game.service startup (R3.2)
   1. ⬜ T133.2.1: Import GraphInitializerService in game.service.ts
   2. ⬜ T133.2.2: Create instance during game startup
   3. ⬜ T133.2.3: Call initialization after GUI server is ready

3. ⬜ T133.3: Pass configuration to GUI (R3.3)
   1. ⬜ T133.3.1: Define initial position for graph bottom center (R3.3.1)
   2. ⬜ T133.3.2: Create default graph configuration object (R3.3.2)
   3. ⬜ T133.3.3: Pass configuration through remote event to GUI

4. ⬜ T133.4: Trigger automatic generation (R3.4)
   1. ⬜ T133.4.1: Send generation request after GUI receives configuration
   2. ⬜ T133.4.2: Ensure generation uses passed position parameter
   3. ⬜ T133.4.3: Test automatic generation on game startup

### Technical Notes:
- Should coordinate with ConfigGUIServerService
- Initial position affects where the graph origin appears
- Default configuration should create a reasonable starter graph
- Consider making initial generation optional via configuration