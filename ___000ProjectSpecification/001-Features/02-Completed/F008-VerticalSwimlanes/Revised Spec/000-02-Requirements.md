# Vertical Swimlanes - Requirements

## Functional Requirements

1. **R1: Repurpose Y dimension from hierarchical layers to property-based positioning**
   - Replace the current layer-based Y positioning system
   - Use property values to determine Y coordinates

2. **R2: Use the Y group dropdown value from GUI to determine vertical positioning**
   - Connect existing Y group dropdown to data flow
   - Y property selection should control vertical grouping

3. **R3: Create Y-parallel shadow blocks (70% transparent) that float at each Y level**
   - Shadow blocks should float above the base platform
   - Must be 70% transparent for visibility

4. **R4: Shadow blocks should have the same X,Z footprint as their group shadow**
   - Calculate footprint from all nodes at that Y level
   - Maintain consistent sizing with group boundaries

5. **R5: Apply Y positioning after X,Z positioning is complete**
   - Ensure X,Z positions are finalized first
   - Y positioning is the final spatial adjustment

6. **R6: Add swimlane shadows on the vertical walls**
   - Project Y swimlanes onto existing vertical walls
   - Include labels for Y property values

7. **R7: Maintain visual consistency with existing X and Z parallel swimlanes**
   - Use similar visual styling
   - Follow established patterns for shadows and labels

## Technical Constraints

- Must integrate with existing unified data renderer
- Should not break existing X,Z swimlane functionality
- Performance must remain acceptable with additional shadows
- Transparency levels must allow node visibility