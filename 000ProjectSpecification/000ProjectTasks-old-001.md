# vscode test

# Simple 2D Hierarchical Graph Console Demo Specification

## Summary

Create a minimal proof of concept that demonstrates hierarchical data analysis and 2D positioning as a Node.js console application. The system will generate fake hierarchical data, analyze it to identify connected groups, position these groups in 2D space, and display the results in table format in the console. This serves as the simplest possible validation of core hierarchical layout concepts.

## Requirements

1. ✅ Data Generation Requirements

   1. ✅ R1: The system shall generate fake hierarchical entities with parent-child relationships
   2. ✅ R2: The system shall create 2 entity types ("Parent", "Child")
   3. ✅ R3: The system shall generate 2-3 disconnected hierarchy trees
   4. ✅ R4: The system shall ensure each tree has 2-3 levels of depth

2. ✅ Analysis Requirements

   1. ✅ R5: The system shall identify all connected components in the hierarchical data
   2. ✅ R6: The system shall group entities by their connected relationships
   3. ✅ R7: The system shall calculate basic metrics for each connected group

3. ✅ Display Requirements

   1. ✅ R8: The system shall position entities in 2D coordinates (x, y)
   2. ✅ R9: The system shall display results in console table format
   3. ✅ R10: The system shall show entity ID, type, position, and parent information
   4. ✅ R11: The system shall run as a standalone Node.js script

4. ✅ Project Structure Requirements

   1. ✅ R12: The project shall be contained in a separate folder
   2. ✅ R13: The project shall be broken into separate files to compartmentalize data, visualization, and analysis

5. ✅ ASCII Output Requirements

   1. ✅ R14: The system shall save an ASCII rendering of the data map to a file
   2. ✅ R15: ASCII output files shall be saved in an output_data folder
   3. ✅ R16: Each output file shall be named using pattern: yyyy-mm-dd-seconds-stub.me

6. ✅ Next.js Web Interface Requirements

   1. ✅ R17: The project shall include a Next.js application component
   2. ✅ R18: The system shall create a new page in the (pages) folder
   3. ✅ R19: The page shall contain a test data config component with input form
   4. ✅ R20: The config form shall include number of nodes input field
   5. ✅ R21: The config form shall include number of connected chains input field
   6. ✅ R22: The config form shall include depth of longest chain input field
   7. ✅ R23: The config form shall include a submit button
   8. ✅ R24: The page shall contain a TreeDisplay component showing results

7. ✅ Advanced Graph Visualization Requirements

   1. ✅ R25: The system shall add a new output panel called "Graphs"
   2. ✅ R26: The Graphs panel shall display 3 graph visualizations side by side
   3. ✅ R27: The first graph shall use React Flow library
   4. ✅ R28: The second graph shall use Cytoscape.js library
   5. ✅ R29: The third graph shall use D3.js library
   6. ✅ R30: The system shall implement high-quality separation of concerns
   7. ✅ R31: The system shall create data transformation adapters for each graph library
   8. ✅ R32: Graph data transformers shall be easily extensible for new formats

8. ✅ User Experience Enhancement Requirements

   1. ✅ R33: The system shall execute default hierarchy generation when page loads
   2. ✅ R34: The Graphs tab shall be selected by default on page load

9. ✅ Advanced Configuration & UI Requirements

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
