# Feature 003: Web App UI Enhancements Requirements

## R49: Suggestions Table

1. ✅ Add table row above main output area
2. ✅ Use MUI Advanced Data Grid for table display
3. ✅ Table columns shall match configuration properties
4. ✅ First column shall be a clickable configuration index
5. ✅ Clicking index shall update graph config and display
6. ✅ Include 10 rows of interesting preset configurations

## R50: Table Display Refinements

1. ✅ Split configuration column into separate title and description columns
2. ✅ Use compact density mode for MUI Data Grid
3. ✅ Optimize column widths for maximum data visibility

## R51: Configuration Form Refinements

1. ✅ Display each input field on a new row
2. ✅ Remove all side-by-side input layouts
3. ✅ Maintain consistent vertical spacing between inputs

## R52: UI Enhancements

1. ✅ Enforce 2px minimum separation between nodes in React Flow chart
2. ✅ Add info icons with tooltips to all configuration input fields
3. ✅ Display explanatory text for each configuration option
4. ✅ Relocate metrics display:
   1. ✅ Move total entities count to metrics box
   2. ✅ Move two additional output metrics to metrics box
   3. ✅ Position metrics box in column 1 below config box
5. ✅ Implement layout adjustments:
   1. ✅ Increase table height by 10%
   2. ✅ Expand page content width to 90vw
   3. ✅ Set column 2 to fill available space

## R53: Configuration Persistence

1. ✅ Create GraphConfig table in existing database
2. ✅ Add UUID field for each configuration
3. ✅ Add favorite/star button to each configuration row
4. ✅ Save starred configurations to database
5. ✅ Load and display favorite configurations at top of suggestions table
6. ✅ Display system-generated configurations below favorites
7. ✅ Auto-generate UUID for each system configuration

## R54: Enhanced Graph Type Configuration

1. ✅ Entity type configuration:
   1. ✅ Add input field for number of entity types
   2. ✅ Assign unique color to each entity type
   3. ✅ Apply entity-specific colors to graph nodes
2. ✅ Connector type configuration:
   1. ✅ [C] Add input field for number of connector types
   2. ✅ [C] Update connector lines to have a different color for each connector type
3. ✅ Graph enhancements:
   1. ✅ Update graph metrics to display connector types
   2. ✅ Update graph metrics to use compact styling

## R55: UI Restructure

1. ✅ [G] In column 2, change the table and graph from a vertical to a horizontal layout, where each component occupies 50% of the available width and fills the container's height
2. ✅ [G] Add a Maximize/Minimize button to the upper-left corner of each panel
3. ✅ [G] When the button is clicked, the corresponding panel shall collapse to a width of 50px, while the other panel expands to fill the remaining space

## R59: Minor Node Adjustments

1. ✅ Put an index number in each node
2. ✅ Color the background of each node the same color as its border
3. ✅ If the user clicks on a node, show a popup with a delete button that will delete the node

## R60: Table Tweaks

1. ✅ Make the suggested configurations table expand vertically to show all rows

## R61: Add 2 More Columns to Main Layout

1. ✅ [GEM] Currently the react flow chart is in a large pane with a min/max button. Add the cyto and d3 graphs to similar panes, each with a min/max button
2. ✅ [GEM] Remove the mini versions of all 3 graphs

## R62: Suggested Configurations Table Tweaks

1. ✅ [GEM] Remove the page increment buttons from the bottom of the table
2. ✅ [GEM] Always show all rows

## R63: Layout Refactoring

1. ✅ [GEM] The system shall refactor the layout to move column 6 into a collapsible tab as column 7

## R69: MUI Accordion Implementation

1. ✅ [GEM] Replace `CollapsibleGraphPanel` with MUI `Accordion`, `AccordionSummary`, and `AccordionDetails`
2. ✅ [GEM] Update imports in `hierarchy-tester/page.tsx` to include MUI Accordion components
3. ✅ [GEM] Map `isCollapsed` and `onToggle` from `usePanelCollapse` to `expanded` and `onChange` props of `Accordion`
4. ✅ [GEM] Place content previously rendered by `CollapsibleGraphPanel`'s `switch` case directly into `AccordionDetails`
5. ✅ [GEM] Adjust layout and styling to ensure visual consistency with the new Accordion structure
6. ✅ [GEM] Remove the `CollapsibleGraphPanel.tsx` component file

## R70: UI Collapser Fixes

1. ✅ [CLD] Make element shown in image expand to fill the width of the container
2. ✅ [CLD] Give the element a 10px red border

## R71: Layout Changes

1. ✅ [CLD] Darken light font in collapsible columns
2. ✅ [CLD] Move max/min icon to upper right instead of upper left
3. ✅ [CLD] Change max/min to more common icon
4. ✅ [CLD] Apply compact styling to entity table

## R72: Graph Colors

1. ✅ [CLD] Fix colors on nodes and edges on cytoscape graph
2. ✅ [CLD] Make colors consistent across all 3 graphs
3. ✅ [CLD] Create a centralized location in the code to store colors

## R74: Suggestions Component Relocation

1. ✅ [CLD1] The system shall move the suggestions component into TreeDisplay as a tab
2. ✅ [CLD1] The suggestions tab shall be positioned as the first tab
3. ✅ [CLD1] The suggestions tab shall be the default selected tab on page load