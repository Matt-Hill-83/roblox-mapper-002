# Simple 2D Hierarchical Graph Console Demo Specification

## Summary

Create a minimal proof of concept that demonstrates hierarchical data analysis and 2D positioning as a Node.js console application. The system will generate fake hierarchical data, analyze it to identify connected groups, position these groups in 2D space, and display the results in table format in the console. This serves as the simplest possible validation of core hierarchical layout concepts.

## Requirements

1. ⬛ Data Generation Requirements

   1. ⬛ R1: The system shall generate fake hierarchical entities with parent-child relationships
   2. ⬛ R2: The system shall create 2 entity types ("Parent", "Child")
   3. ⬛ R3: The system shall generate 2-3 disconnected hierarchy trees
   4. ⬛ R4: The system shall ensure each tree has 2-3 levels of depth

2. ⬛ Analysis Requirements

   1. ⬛ R5: The system shall identify all connected components in the hierarchical data
   2. ⬛ R6: The system shall group entities by their connected relationships
   3. ⬛ R7: The system shall calculate basic metrics for each connected group

3. ⬛ Display Requirements

   1. ⬛ R8: The system shall position entities in 2D coordinates (x, y)
   2. ⬛ R9: The system shall display results in console table format
   3. ⬛ R10: The system shall show entity ID, type, position, and parent information
   4. ⬛ R11: The system shall run as a standalone Node.js script

4. ⬛ Project Structure Requirements

   1. ⬛ R12: The project shall be contained in a separate folder
   2. ⬛ R13: The project shall be broken into separate files to compartmentalize data, visualization, and analysis

5. ⬛ ASCII Output Requirements

   1. ✅ R14: The system shall save an ASCII rendering of the data map to a file
   2. ✅ R15: ASCII output files shall be saved in an output_data folder
   3. ✅ R16: Each output file shall be named using pattern: yyyy-mm-dd-seconds-stub.me

6. ⬛ Next.js Web Interface Requirements

   1. ✅ R17: The project shall include a Next.js application component
   2. ✅ R18: The system shall create a new page in the (pages) folder
   3. ✅ R19: The page shall contain a test data config component with input form
   4. ✅ R20: The config form shall include number of nodes input field
   5. ✅ R21: The config form shall include number of connected chains input field
   6. ✅ R22: The config form shall include depth of longest chain input field
   7. ✅ R23: The config form shall include a submit button
   8. ✅ R24: The page shall contain a TreeDisplay component showing results

7. ⬛ Advanced Graph Visualization Requirements

   1. ✅ R25: The system shall add a new output panel called "Graphs"
   2. ✅ R26: The Graphs panel shall display 3 graph visualizations side by side
   3. ✅ R27: The first graph shall use React Flow library
   4. ✅ R28: The second graph shall use Cytoscape.js library
   5. ✅ R29: The third graph shall use D3.js library
   6. ✅ R30: The system shall implement high-quality separation of concerns
   7. ✅ R31: The system shall create data transformation adapters for each graph library
   8. ✅ R32: Graph data transformers shall be easily extensible for new formats

8. ⬛ User Experience Enhancement Requirements

   1. ✅ R33: The system shall execute default hierarchy generation when page loads
   2. ✅ R34: The Graphs tab shall be selected by default on page load

9. ⬛ Advanced Configuration & UI Requirements

   1. ✅ R35: The system shall support advanced data complexity parameters
   2. ✅ R36: The config form shall include total nodes parameter (1-1000)
   3. ✅ R37: The config form shall include maximum tree depth parameter (1-15)
   4. ✅ R38: The config form shall include branching factor range (min/max)
   5. ✅ R39: The config form shall include cross-tree connections percentage
   6. ✅ R40: The config form shall include entity types count parameter
   7. ✅ R41: The input panel shall be positioned on the left side
   8. ✅ R42: The input panel shall use a more compact design
   9. ✅ R43: The system shall remove comparison tips from graphs panel
   10. ✅ R44: The system shall remove individual graph descriptions
   11. ✅ R45: The system shall remove graph visualization titles
   12. ✅ R46: The system shall implement a three-column layout:
       1. ✅ Column 1: Configuration box
       2. ✅ Column 2: Main output area with summary data above large graph
       3. ✅ Column 3: Three small graphs stacked vertically
   13. ✅ R47: The system shall implement graph switching functionality:

       1. ✅ When user clicks a small graph, it becomes the large graph in column 2

   14. ✅ R48: The system shall implement responsive layout:

       1. ✅ The page width shall expand to 80vh
       2. ✅ Column 2 (main output area) shall occupy 80% of page width

   15. ✅ R49: The system shall implement a suggestions table:

       1. ✅ Add table row above main output area
       2. ✅ Use MUI Advanced Data Grid for table display
       3. ✅ Table columns shall match configuration properties
       4. ✅ First column shall be a clickable configuration index
       5. ✅ Clicking index shall update graph config and display
       6. ✅ Include 10 rows of interesting preset configurations

   16. ✅ R50: The system shall implement table display refinements:

       1. ✅ Split configuration column into separate title and description columns
       2. ✅ Use compact density mode for MUI Data Grid
       3. ✅ Optimize column widths for maximum data visibility

   17. ✅ R51: The system shall implement configuration form refinements:

       1. ✅ Display each input field on a new row
       2. ✅ Remove all side-by-side input layouts
       3. ✅ Maintain consistent vertical spacing between inputs

   18. ✅ R52: The system shall implement UI enhancements:

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

   19. ✅ R53: The system shall implement configuration persistence:

       1. ✅ Create GraphConfig table in existing database
       2. ✅ Add UUID field for each configuration
       3. ✅ Add favorite/star button to each configuration row
       4. ✅ Save starred configurations to database
       5. ✅ Load and display favorite configurations at top of suggestions table
       6. ✅ Display system-generated configurations below favorites
       7. ✅ Auto-generate UUID for each system configuration

   20. ✅ R54: The system shall implement enhanced graph type configuration:

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

   21. ✅ R55: The system shall restructure the UI:

       1. ✅ [G] In column 2, change the table and graph from a vertical to a horizontal layout, where each component occupies 50% of the available width and fills the container's height.
       2. ✅ [G] Add a Maximize/Minimize button to the upper-left corner of each panel.
       3. ✅ [G] When the button is clicked, the corresponding panel shall collapse to a width of 50px, while the other panel expands to fill the remaining space.

   22. ✅ R56: The system shall implement graph layout optimization:

       1. ✅ [GPT] Implement barycentric crossing minimization algorithm for hierarchical node positioning
       2. ✅ [GPT] Add intelligent node spacing with 120px gaps between levels
       3. ✅ [GPT] Integrate parent-position-based sorting to reduce edge crossings in React Flow graphs

   23. ✅ [GPT] R57: The system shall modify React Flow connector styles:

       1. ✅ Connectors shall be twice as thick.
       2. ✅ Connectors shall be solid lines, not dashed.

   24. ⬛ R58: The system shall implement horizontal type-based node positioning:

       1. ⬛ [GPT] Nodes shall be positioned horizontally based on their entity type
       2. ⬛ [GPT] Each entity type shall occupy a distinct horizontal lane/zone with defined X-coordinate ranges
       3. ⬛ [GPT] Node positioning shall maintain hierarchical relationships within each type zone
       4. ⬛ [GPT] Cross-type connections shall be visually clear despite horizontal separation
       5. ⬛ [GPT] Type zones shall be evenly distributed across the available horizontal space

   25. ⬛ R59: The system shall implement minor node adjustments:

       1. ⬛ Put an index number in each node
       2. ⬛ Color the background of each node the same color as its border
       3. ⬛ If the user clicks on a node, show a popup with a delete button that will delete the node

   26. ⬛ R60: The system shall implement table tweaks:
       1. ⬛ Make the suggested configurations table expand vertically to show all rows

## Task List

1. ⬛ Implementation Tasks
   1. ✅ T1: Create fake data generator that produces simple hierarchical entities
   2. ✅ T2: Implement basic connection analysis to identify separate trees
   3. ✅ T3: Create simple 2D positioning algorithm
   4. ✅ T4: Build console table display system
   5. ✅ T5: Create main Node.js script that runs the complete demo
   6. ✅ T6: Test with sample data and verify console output
   7. ✅ T7: Create ASCII rendering system for data map visualization
   8. ✅ T8: Implement file output system with timestamp naming
   9. ✅ T9: Run 3 tests to verify ASCII output functionality
   10. ✅ T10: Create new page in Next.js (pages) folder
   11. ✅ T11: Build test data config component with input form
   12. ✅ T12: Implement TreeDisplay component for visualization
   13. ✅ T13: Integrate hierarchy demo logic with Next.js frontend
   14. ✅ T14: Install graph visualization libraries (React Flow, Cytoscape.js, D3.js)
   15. ✅ T15: Create data transformation layer with adapter pattern
   16. ✅ T16: Implement React Flow graph component
   17. ✅ T17: Implement Cytoscape.js graph component
   18. ✅ T18: Implement D3.js graph component
   19. ✅ T19: Create Graphs tab panel in TreeDisplay component
   20. ✅ T20: Integrate all three graph visualizations with responsive layout
   21. ✅ T21: Implement default hierarchy generation on page load
   22. ✅ T22: Set Graphs tab as default selected tab
   23. ✅ T23: Implement advanced data complexity parameters
   24. ✅ T24: Update API to support advanced configuration options
   25. ✅ T25: Redesign input panel with compact layout and advanced controls
   26. ✅ T26: Restructure page layout to position input panel on lefthow
   27. ✅ T27: Remove comparison tips and descriptions from graphs panel
   28. ✅ T28: Implement three-column layout (R46)
   29. ✅ T29: Implement graph switching functionality (R47)
   30. ✅ T30: Implement responsive layout with expanded width (R48)
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
   53. ✅ T53: Add input field for number of entity types (R54.1.1)
   54. ✅ T54: Assign unique color to each entity type (R54.1.2)
   55. ✅ T55: Apply entity-specific colors to graph nodes (R54.1.3)
   56. ✅ T56: Add input field for number of connector types (R54.2.1)
   57. ✅ T57: Apply distinct visual styles per connector type (R54.2.2)
   58. ✅ T58: Update graph edges to reflect connector types (R54.2.3)
   59. ✅ [C] T59: Add input field for number of connector types (R54.2.1)
   60. ✅ [C] T60: Update connector lines to have a different color for each connector type (R54.2.4)
   61. ✅ [G] T61: Change table and graph from vertical to horizontal layout in column 2 (R55.1)
   62. ✅ [G] T62: Add Maximize/Minimize button to upper-left corner of each panel (R55.2)
   63. ✅ [G] T63: Implement panel collapse functionality - clicked panel collapses to 50px width (R55.3)
   64. ✅ [GPT] T64: Implement barycentric crossing minimization algorithm in ReactFlowAdapter (R56.1)
   65. ✅ [GPT] T65: Add intelligent node spacing and parent-position-based sorting (R56.2, R56.3)
   66. ✅ [GPT] T66: Modify React Flow connectors to be thicker and solid (R57)
   67. ⬛ [GPT] T67: Create entity type to X-coordinate range mapping system (R58.1, R58.2)
   68. ⬛ [GPT] T68: Implement horizontal type-based positioning algorithm in ReactFlowAdapter (R58.1, R58.3)
   69. ⬛ [GPT] T69: Ensure cross-type connections remain visually clear and properly routed (R58.4)
   70. ⬛ [GPT] T70: Implement dynamic type zone distribution across available horizontal space (R58.5)
   71. ✅ [GPT] T71: Put an index number in each node (R59.1)
   72. ✅ [GPT] T72: Color the background of each node the same color as its border (R59.2)
   73. ⬛ [GPT] T73: Implement node deletion on click via popup (R59.3)
   74. ⬛ T74: Make the suggested configurations table expand vertically to show all rows (R60.1)
