## R5: Additional Features

1. ✅ [CLD5] R5.1: When a user adds a new layer, the row values in the GUI table shall be initialized to match the row above it
2. ✅ [CLD5] R5.2: The system shall allow the user to quit the game by pressing Esc, then P
3. ✅ [CLD5] R5.4: The GUI shall use the following default values (as shown in the image):
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

## R7: GUI Improvements

1. ✅ [CLD7] R7.1: The GUI shall include an input field for link diameter control
2. ✅ [CLD7] R7.2: The minimum value for all numeric input fields shall be 0.1
3. ✅ [CLD7] R7.3: The GUI shall include a "Rand Z" checkbox that gives each node a 50% chance of having their Z value offset by 20 units when created

## R8: Default Value Updates

1. ✅ [CLD8] R8.1: The default value for "Show link labels" checkbox shall be false
2. ✅ [CLD8] R8.2: The default value for "Create same-layer links" checkbox shall be false
3. ✅ [CLD8] R8.3: The minimum value for Node Height shall be 0.1

## R9: Link Color Fix

1. ✅ [CLD9] R9.1: Link types shall display with their assigned colors instead of all appearing red

## R10: Console and Layout Improvements

1. 🔲 [CLD11] R10.1: The console output shall be reduced to half its current width
2. 🔲 [CLD11] R10.2: Node type and link type buttons shall be stacked vertically to save horizontal space

## R11: Additional Input Controls

1. 🔲 [CLD11] R11.1: The GUI shall include a numeric input field for Z offset amount used by the Random Z function
   1. 🔲 [CLD11] R11.1.1: Default value shall be 20
   2. 🔲 [CLD11] R11.1.2: Valid range shall be 0 to 100
   3. 🔲 [CLD11] R11.1.3: Input shall be positioned near the Random Z checkbox
2. 🔲 [CLD11] R11.2: The GUI shall include a numeric input field for Y offset of the origin position
   1. 🔲 [CLD11] R11.2.1: Default value shall be 0
   2. 🔲 [CLD11] R11.2.2: Valid range shall be -100 to 100
   3. 🔲 [CLD11] R11.2.3: Input shall be in the Global Settings section

## R12: Configuration Export

1. 🔲 [CLD11] R12.1: The GUI shall include an "Export Config" button that outputs the current configuration to the console
2. 🔲 [CLD11] R12.2: The export function shall clear the console before outputting configuration data
3. 🔲 [CLD11] R12.3: The exported configuration shall include all settings in a human-readable format
   1. 🔲 [CLD11] R12.3.1: Spacing configuration values
   2. 🔲 [CLD11] R12.3.2: Layer configuration for each layer
   3. 🔲 [CLD11] R12.3.3: Visualization options and checkbox states
   4. 🔲 [CLD11] R12.3.4: Timestamp of export
