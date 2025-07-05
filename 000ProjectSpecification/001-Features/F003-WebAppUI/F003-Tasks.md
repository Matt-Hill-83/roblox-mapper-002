# Feature 003: Web App UI Enhancement Tasks

## T31-T48: Suggestions Table and UI Layout (R49-R53)

31. ✅ T31: Create suggestions table with MUI Advanced Data Grid (R49)
32. ✅ T32: Generate 10 interesting preset configurations (R49)
33. ✅ T33: Implement configuration index click handling (R49)
34. ✅ T34: Split configuration table columns and optimize display (R50)
35. ✅ T35: Refactor configuration form layout for vertical inputs (R51)
36. ✅ T36: Configure React Flow node spacing to 2px minimum (R52)
37. ✅ T37: Add info icons to configuration input fields (R52)
38. ✅ T38: Create and style tooltips for configuration fields (R52)
39. ✅ T39: Define GraphConfig database schema with UUID and favorite fields (R53)
40. ✅ T40: Create GraphConfig model and database migration (R53)
41. ✅ T41: Add star button component to configuration rows (R53)
42. ✅ T42: Implement save/unsave favorite configuration functionality (R53)
43. ✅ T43: Create API endpoint for favorite configurations (R53)
44. ✅ T44: Update table to display favorites section with star status (R53)
45. ✅ T45: Implement UUID generation for system configurations (R53)
46. ✅ T46: Add configuration sorting (favorites first, then system configs) (R53)
47. ✅ T47: Move total entities count to metrics box in column 1 (R52.4)
48. ✅ T48: Move two additional output metrics to metrics box (R52.4)
49. ✅ T49: Position metrics box below config box in column 1 (R52.4)
50. ✅ T50: Increase table height by 10% (R52.5)
51. ✅ T51: Expand page content width to 90vw (R52.5)
52. ✅ T52: Set column 2 to fill available space (R52.5)

## T53-T60: Enhanced Graph Type Configuration (R54)

53. ✅ T53: Add input field for number of entity types (R54.1.1)
54. ✅ T54: Assign unique color to each entity type (R54.1.2)
55. ✅ T55: Apply entity-specific colors to graph nodes (R54.1.3)
56. ✅ T56: Add input field for number of connector types (R54.2.1)
57. ✅ T57: Apply distinct visual styles per connector type (R54.2.2)
58. ✅ T58: Update graph edges to reflect connector types (R54.2.3)
59. ✅ [C] T59: Add input field for number of connector types (R54.2.1)
60. ✅ [C] T60: Update connector lines to have a different color for each connector type (R54.2.4)

## T61-T63: UI Restructure (R55)

61. ✅ [G] T61: Change table and graph from vertical to horizontal layout in column 2 (R55.1)
62. ✅ [G] T62: Add Maximize/Minimize button to upper-left corner of each panel (R55.2)
63. ✅ [G] T63: Implement panel collapse functionality - clicked panel collapses to 50px width (R55.3)

## T71-T73: Minor Node Adjustments (R59)

71. ✅ [GPT] T71: Put an index number in each node (R59.1)
72. ✅ [GPT] T72: Color the background of each node the same color as its border (R59.2)
73. ✅ [GPT] T73: Implement node deletion on click via popup (R59.3)

## T74-T75: Table Tweaks (R60)

74. ✅ [GEM] T74: Make the suggested configurations table expand vertically to show all rows (R60.1)
75. ✅ [GEM] T75: When a node is deleted, delete its connectors also (R59.3)

## T76-T79: Additional UI Changes (R61-R62)

76. ✅ [GEM] T76: Add the cyto and d3 graphs to similar panes, each with a min/max button (R61.1)
77. ✅ [GEM] T77: Remove the mini versions of all 3 graphs (R61.2)
78. ✅ [GEM] T78: Remove the page increment buttons from the bottom of the suggested configurations table (R62.1)
79. ✅ [GEM] T79: Make the suggested configurations table always show all rows (R62.2)

## T80: Layout Refactoring (R63)

80. ✅ [GEM] T80: Refactor the layout to move column 6 into a collapsible tab as column 7 (R63)
    80.1. ✅ [GEM] T80.1: Remove VisualMap's independent panel from `hierarchy-tester/page.tsx`
    80.2. ✅ [GEM] T80.2: Adjust width calculations for remaining collapsible sections in `hierarchy-tester/page.tsx`
    80.3. ✅ [GEM] T80.3: Add VisualMap import to `_webapp/src/components/TreeDisplay.tsx`
    80.4. ✅ [GEM] T80.4: Add a new 'Visual Map' tab to the `Tabs` component in `_webapp/src/components/TreeDisplay.tsx`
    80.5. ✅ [GEM] T80.5: Add a corresponding `TabPanel` for 'Visual Map' in `_webapp/src/components/TreeDisplay.tsx`
    80.6. ✅ [GEM] T80.6: Ensure `tabValue` state and `TabPanel` indices are correctly aligned in `_webapp/src/components/TreeDisplay.tsx`
    80.7. ✅ [GEM] T80.7: Wrap the entire tabbed interface in `_webapp/src/components/TreeDisplay.tsx` with the `GraphContainer` component

## T91: MUI Accordion Implementation (R69)

91. ✅ [GEM] T91: Implement a horizontal collapsible panel set (R70)
    91.1. ✅ [GEM] T91.1: Create a container with a row of 5 boxes in `hierarchy-tester/page.tsx` (R70.1)
    91.2. ✅ [GEM] T91.2: Integrate existing components (Configuration, Suggestions, React Flow, Cytoscape.js, D3.js) into these boxes (R70.2)
    91.3. ✅ [GEM] T91.3: Add minimize/maximize buttons to each box (R70.3)
    91.4. ✅ [GEM] T91.4: Implement logic for boxes to collectively take up full parent width (R70.4)
    91.5. ✅ [GEM] T91.5: Implement logic for minimized box width to be 50px (R70.5)
    91.6. ✅ [GEM] T91.6: Implement logic for other boxes to expand proportionally (R70.6)

## T92-T97: UI Fixes and Improvements (R70-R72)

92. ✅ [CLD] T92: UI collapser fixes (R33)
    1. ✅ [CLD] Revert incorrect changes made to SuggestionsTable component
    2. ✅ [CLD] Change Grid item at line 141 in hierarchy-tester/page.tsx from lg={9} to lg={12}
    3. ✅ [CLD] Add 10px red border to the Grid item at line 141

93. ✅ [CLD] T93: Adjust panel widths for better layout
    1. ✅ [CLD] Update HorizCollapsibleSetChild component to accept minWidth and maxWidth props
    2. ✅ [CLD] Add minWidth="400px" to React Flow, Cytoscape.js, and D3.js graph panels
    3. ✅ [CLD] Add maxWidth="600px" to Suggested Configurations panel

94. ✅ [CLD] T94: Fix panel expansion when collapsing panels
    1. ✅ [CLD] Remove getFlexValues() function and related flex calculation logic
    2. ✅ [CLD] Remove flexValues state and calculation from render logic
    3. ✅ [CLD] Update HorizCollapsibleSetChild to use standard flex values
    4. ✅ [CLD] Remove the flex prop from HorizCollapsibleSetChild interface
    5. ✅ [CLD] Add width: '100%' to parent Box in HorizCollapsibleSetParent
    6. ✅ [CLD] Test that panels properly expand to fill available space

95. ✅ [CLD] T95: Layout changes for collapsible panels (R71)
    1. ✅ [CLD] Darken light font in collapsible columns
    2. ✅ [CLD] Move minimize/maximize icon from upper left to upper right
    3. ✅ [CLD] Replace icons with more common expand/collapse icons

96. ✅ [CLD] T96: Apply compact styling to entity table (R71.4)
    1. ✅ [CLD] Find the entity table component in TreeDisplay.tsx
    2. ✅ [CLD] Apply density="compact" prop to DataGrid component
    3. ✅ [CLD] Verify compact styling is applied consistently

97. ✅ [CLD] T97: Standardize graph colors across visualization components (R72)
    1. ✅ [CLD] Copy colorTokens.js to _webapp/src/config/colorTokens.ts
    2. ✅ [CLD] Update CytoscapeGraph to use colorTokens colors
    3. ✅ [CLD] Update ReactFlowGraph to use colorTokens colors
    4. ✅ [CLD] Update D3Graph to use colorTokens colors
    5. ✅ [CLD] Ensure nodes use level-based colors
    6. ✅ [CLD] Ensure edges use defined edge color array

## T102-T104: Component Reorganization (R74)

102. ✅ [CLD1] T102: Move suggestions component to TreeDisplay tabs (R74)
     1. ✅ [CLD1] Remove SuggestionsTable from hierarchy-tester/page.tsx
     2. ✅ [CLD1] Import SuggestionsTable component in TreeDisplay.tsx
     3. ✅ [CLD1] Add "Suggestions" as the first tab in the Tabs component
     4. ✅ [CLD1] Create corresponding TabPanel for Suggestions tab
     5. ✅ [CLD1] Pass necessary props to SuggestionsTable
     6. ✅ [CLD1] Update tab indices to accommodate new first tab
     7. ✅ [CLD1] Set default tabValue state to 0
     8. ✅ [CLD1] Test suggestions table displays correctly
     9. ✅ [CLD1] Verify clicking suggestion updates configuration

103. ✅ [CLD1] T103: Change React Flow edge type to straight
     1. ✅ [CLD1] Modified edge type from "smoothstep" to "straight" in graphAdapters.ts

104. ✅ [CLD1] T104: Remove stats widgets from all graph components
     1. ✅ [CLD1] Remove info panel from ReactFlowGraph
     2. ✅ [CLD1] Remove info panel from CytoscapeGraph
     3. ✅ [CLD1] Remove info panel from D3Graph
     4. ✅ [CLD1] Clean up unused imports and state variables