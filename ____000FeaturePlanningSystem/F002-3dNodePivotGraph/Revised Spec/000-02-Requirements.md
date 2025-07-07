# 3D Node Pivot Graph Requirements

## Functional Requirements

1. ✅ **R1**: Add petColor property to all person nodes (man, woman, child, grandparent)
   - ✅ Define available pet colors
   - ✅ Assign random pet color during node generation

2. ✅ **R2**: Add visual labels to each swimlane on both X and Z axes
   - ✅ Labels should display the property value (e.g., "Dog", "Cat" for pet types)
   - ✅ Labels must be positioned clearly at swimlane boundaries
   - ✅ Labels should update when axis properties change

3. ✅ **R3**: Create shadow blocks under Z-axis swimlanes similar to existing X-axis swimlane blocks
   - ✅ Calculate bounds for each unique value in Z-axis property
   - ✅ Apply appropriate colors and transparency
   - ✅ Ensure proper layering to avoid visual conflicts

4. ✅ **R4**: Add dropdown selectors in GUI for X and Z axis property selection
   - ✅ Dropdowns should list all available node properties
   - ✅ Default selections: X-axis = "type", Z-axis = "petType"
   - ✅ Support properties: type, petType, petColor, age, firstName, lastName

5. ✅ **R5**: Support dynamic re-rendering when axis properties are changed
   - ✅ Recalculate node positions based on new property selections
   - ✅ Update swimlane blocks and labels accordingly
   - ✅ Maintain smooth transition without full scene recreation

6. ✅ **R6**: Maintain existing Y-axis hierarchical relationships unchanged
   - ✅ Y-axis continues to represent parent-child relationships
   - ✅ No user control over Y-axis property

## New Feature Requirements

7. ⬛ **R7**: Node Properties Inspector GUI
   - ⬛ Display node properties when clicking on a node
   - ⬛ Position in upper right of screen
   - ⬛ Click to show/hide functionality
   - ⬛ Show all node properties in a formatted list

8. ⬛ **R8**: Advanced Node Visual Customization
   - ⬛ Add dropdown to assign node textbox background color to a property
   - ⬛ Add dropdown to assign node textbox border color to a property
   - ⬛ Update node rendering based on selected property mappings

9. ⬛ **R9**: Add Geographic Properties
   - ⬛ Add countryOfBirth property to person nodes
   - ⬛ Add countryOfResidence property to person nodes
   - ⬛ Create list of countries for random assignment
   - ⬛ Add to available axis properties

10. ⬛ **R10**: Y-Axis Toggle Feature
    - ⬛ Add toggle to switch Y-axis between layer and properties
    - ⬛ Create vertical walls around platform
    - ⬛ Display swimlane shadows on vertical walls
    - ⬛ Update positioning logic for property-based Y-axis

11. ⬛ **R11**: Node Connectivity Requirement
    - ⬛ Ensure every node has at least one connection
    - ⬛ Update data generator to validate connectivity
    - ⬛ Add fallback connection creation for isolated nodes
