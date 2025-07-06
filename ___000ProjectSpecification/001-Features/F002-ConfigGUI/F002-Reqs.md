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

## R7: GUI Improvements

1. 🔲 [CLD7] R7.1: The GUI shall include an input field for link diameter control
2. 🔲 [CLD7] R7.2: The minimum value for all numeric input fields shall be 0.1
3. 🔲 [CLD7] R7.3: The GUI shall include a "Rand X" checkbox that gives each node a 50% chance of having their X value offset by 20 units when created

- set show link labels to false
- same layer links to false
