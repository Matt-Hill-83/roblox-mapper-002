# 3D Node Pivot Graph Requirements

## Functional Requirements

1. **R1**: Add petColor property to all person nodes (man, woman, child, grandparent)
   - Define available pet colors
   - Assign random pet color during node generation

2. **R2**: Add visual labels to each swimlane on both X and Z axes
   - Labels should display the property value (e.g., "Dog", "Cat" for pet types)
   - Labels must be positioned clearly at swimlane boundaries
   - Labels should update when axis properties change

3. **R3**: Create shadow blocks under Z-axis swimlanes similar to existing X-axis swimlane blocks
   - Calculate bounds for each unique value in Z-axis property
   - Apply appropriate colors and transparency
   - Ensure proper layering to avoid visual conflicts

4. **R4**: Add dropdown selectors in GUI for X and Z axis property selection
   - Dropdowns should list all available node properties
   - Default selections: X-axis = "type", Z-axis = "petType"
   - Support properties: type, petType, petColor, age

5. **R5**: Support dynamic re-rendering when axis properties are changed
   - Recalculate node positions based on new property selections
   - Update swimlane blocks and labels accordingly
   - Maintain smooth transition without full scene recreation

6. **R6**: Maintain existing Y-axis hierarchical relationships unchanged
   - Y-axis continues to represent parent-child relationships
   - No user control over Y-axis property

## Technical Constraints

- Must integrate with existing unified data renderer
- Performance must remain acceptable for graphs up to 1000 nodes
- Changes should not break existing functionality