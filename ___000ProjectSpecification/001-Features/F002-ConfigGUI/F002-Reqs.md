# Feature 002: Configuration GUI Requirements

## R1: Configuration GUI

1. ✅ [CLD1] R1.1: The system shall provide a screen GUI positioned in the upper left corner
2. ✅ [CLD1] R1.2: The GUI shall display the current configuration parameters:
   1. ✅ [CLD1] R1.2.1: Number of groups
   2. ✅ [CLD1] R1.2.2: Number of levels
   3. ✅ [CLD1] R1.2.3: Number of branches
   4. ✅ [CLD1] R1.2.4: Number of node types
   5. ✅ [CLD1] R1.2.5: Number of link types
3. ✅ [CLD1] R1.3: The GUI shall allow users to modify configuration values through input controls
4. ✅ [CLD1] R1.4: The GUI shall have a "Regenerate" button to apply new configuration values
5. ✅ [CLD1] R1.5: The GUI shall update the 3D visualization when configuration changes are applied

## R2: Enhanced Data Generator GUI

1. ✅ [CLD3] R2.1: The GUI shall be titled "Generator Configuration"
2. ✅ [CLD5] R2.2: The GUI shall have a "Global Settings" section containing:
   1. ✅ [CLD5] R2.2.1: Node Height text input field
   2. ✅ [CLD5] R2.2.2: Node Radius text input field
   3. ✅ [CLD5] R2.2.3: Layer Spacing text input field
   4. ✅ [CLD5] R2.2.4: Node Spacing text input field
   5. ✅ [CLD5] R2.2.5: Swimlane Spacing text input field
3. ✅ [CLD3] R2.3: The GUI shall have a "Node/Link Types" section containing:
   1. ✅ [CLD3] R2.3.1: Number of Node Types text input field
   2. ✅ [CLD3] R2.3.2: Number of Link Types text input field
4. ✅ [CLD3] R2.4: The GUI shall provide a grid-based interface for layer configuration:
   1. ✅ [CLD3] R2.4.1: Each row shall represent a layer of the node group
   2. ✅ [CLD3] R2.4.2: Layer numbers shall be auto-generated and displayed
   3. ✅ [CLD3] R2.4.3: The grid shall support dynamic addition of layers via an "Add Layer" button
   4. ✅ [CLD3] R2.4.4: The grid shall support removal of individual layers via delete buttons
5. ✅ [CLD3] R2.5: Each layer row shall include the following columns:
   1. ✅ [CLD3] R2.5.1: Layer number (read-only, auto-generated)
   2. ✅ [CLD3] R2.5.2: # Nodes text input field
   3. ✅ [CLD3] R2.5.3: Connections/Node text input field
   4. ✅ [CLD3] R2.5.4: Del - Delete button [X] to remove the layer
6. ✅ [CLD3] R2.6: The GUI shall include action buttons:
   1. ✅ [CLD3] R2.6.1: "Regenerate" button to apply configuration and rebuild visualization
   2. ✅ [CLD3] R2.6.2: "Clear" button to reset all settings
   3. ✅ [CLD5] R2.6.3: "Update" button to modify existing data without recreating the entire graph
7. ✅ [CLD3] R2.7: The GUI shall display a status message area at the bottom

## R3: Graph Initializer

1. ✅ [CLD4] R3.1: The system shall provide a graph initialization service
2. ✅ [CLD4] R3.2: The initializer shall run during game startup from game.service
3. ✅ [CLD4] R3.3: The initializer shall pass configuration to the GUI:
   1. ✅ [CLD4] R3.3.1: Initial position for bottom center of graph
   2. ✅ [CLD4] R3.3.2: Default graph configuration
4. ✅ [CLD4] R3.4: The initializer shall trigger automatic graph generation on startup

## R4: Incremental Update Feature

1. 🔲 [CLD5] R4.1: The system shall support incremental updates to the graph visualization
2. 🔲 [CLD5] R4.2: The Update button shall only modify changed elements:
   1. 🔲 [CLD5] R4.2.1: Add new nodes when layer node count increases
   2. 🔲 [CLD5] R4.2.2: Remove excess nodes when layer node count decreases
   3. 🔲 [CLD5] R4.2.3: Add new layers when layers are added
   4. 🔲 [CLD5] R4.2.4: Remove layers when layers are deleted
   5. 🔲 [CLD5] R4.2.5: Update connections based on new connection counts
3. 🔲 [CLD5] R4.3: The Update operation shall preserve existing node positions where possible
4. 🔲 [CLD5] R4.4: The system shall track the current graph state to enable incremental updates

## R5: Additional Features

1. 🔲 [CLD5] R5.1: When a user adds a new layer, the row values in the GUI table shall be initialized to match the row above it
2. ✅ [CLD5] R5.2: The system shall allow the user to quit the game by pressing Esc, then P
3. 🔲 [CLD5] R5.3: The GUI shall allow Tab key to advance to the next input field
4. ✅ [CLD5] R5.4: The GUI shall use the following default values (as shown in the image):
   1. ✅ [CLD5] R5.4.1: Node Height: 1
   2. ✅ [CLD5] R5.4.2: Node Radius: 2
   3. ✅ [CLD5] R5.4.3: Layer Spacing: 4
   4. ✅ [CLD5] R5.4.4: Node Spacing: 5
   5. ✅ [CLD5] R5.4.5: Swimlane Spacing: 2
   6. ✅ [CLD5] R5.4.6: Number of Node Types: 4
   7. ✅ [CLD5] R5.4.7: Number of Link Types: 3
   8. ✅ [CLD5] R5.4.8: Layer 1: 1 node, 1 connection/node
   9. ✅ [CLD5] R5.4.9: Layer 2: 3 nodes, 2 connections/node
   10. ✅ [CLD5] R5.4.10: Layer 3: 9 nodes, 1 connection/node

## R6: Visualization Control Checkboxes

1. ✅ [CLD6] R6.1: The GUI shall include a checkbox section for visualization controls
2. ✅ [CLD6] R6.2: The section shall include the following checkboxes:
   1. ✅ [CLD6] R6.2.1: "Show link labels" checkbox (default: checked/true)
   2. ✅ [CLD6] R6.2.2: "Show connectors" checkbox (default: checked/true)
   3. ✅ [CLD6] R6.2.3: "Allow same level links" checkbox (default: checked/true) - When checked, nodes are allowed to create links with other nodes on the same layer
3. ✅ [CLD6] R6.3: Changes to checkbox states shall update the visualization immediately without requiring regeneration
