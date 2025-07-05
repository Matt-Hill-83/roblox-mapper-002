37. ✅ [CLD1] R74: Suggestions Component Relocation:

    1. ✅ [CLD1] R74.1: The system shall move the suggestions component into TreeDisplay as a tab
    2. ✅ [CLD1] R74.2: The suggestions tab shall be positioned as the first tab
    3. ✅ [CLD1] R74.3: The suggestions tab shall be the default selected tab on page load

38. ✅ [CLD2] R75: Route.js Refactoring:

    1. ✅ [CLD2] R75.1: The system shall move logic to a folder lib/generateData/ and a file generateData
    2. ✅ [CLD2] R75.2: The system shall separate files for constants
    3. ✅ [CLD2] R75.3: The system shall separate files for interfaces
    4. ✅ [CLD2] R75.4: The system shall separate files for utils

39. ✅ [CLD1] R76: Create Small Graphs in Roblox:

    1. ✅ [CLD1] R76.1: The system shall move the existing asset creation code from game.service.ts to a service called makeOldStuff.ts and import it
    2. ✅ [CLD1] R76.2: The system shall create a set of simple input data that includes 3 blocks, where 1 is the parent of the other 2, with 2 relations linking the parent to each child

40. ⬛ [CLD1] R77: Create Simple Data Generator:

    1. ⬛ [CLD1] R77.1: Data Structure:
        1. ⬛ [CLD1] R77.1.1: Data Types:
            1. ⬛ [CLD1] R77.1.1.1: Cluster Definition:
                1. ⬛ [CLD1] R77.1.1.1.1: Cluster object shall contain:
                    1. ⬛ [CLD1] R77.1.1.1.1.1: groups array (each group represents a hierarchical tree with parent-child relationships)
                    2. ⬛ [CLD1] R77.1.1.1.1.2: relations array
                2. ⬛ [CLD1] R77.1.1.1.2: Node object shall contain:
                    1. ⬛ [CLD1] R77.1.1.1.2.1: uuid property (e.g., h-1234, persistent across spatial configurations)
                    2. ⬛ [CLD1] R77.1.1.1.2.2: name property
                    3. ⬛ [CLD1] R77.1.1.1.2.3: type property (People or Animals)
                    4. ⬛ [CLD1] R77.1.1.1.2.4: color property
                    5. ⬛ [CLD1] R77.1.1.1.2.5: position property (x, y, z)
                    6. ⬛ [CLD1] R77.1.1.1.2.6: attachment names array
                3. ⬛ [CLD1] R77.1.1.1.3: Link object shall contain:
                    1. ⬛ [CLD1] R77.1.1.1.3.1: uuid property
                    2. ⬛ [CLD1] R77.1.1.1.3.2: type property (Owns, Wants, or Eats)
                    3. ⬛ [CLD1] R77.1.1.1.3.3: source node uuid
                    4. ⬛ [CLD1] R77.1.1.1.3.4: target node uuid
                    5. ⬛ [CLD1] R77.1.1.1.3.5: color property
    2. ⬛ [CLD1] R77.2: Configuration:
        1. ⬛ [CLD1] R77.2.1: Accept input parameters:
            1. ⬛ [CLD1] R77.2.1.1: Number of groups
            2. ⬛ [CLD1] R77.2.1.2: Number of levels
            3. ⬛ [CLD1] R77.2.1.3: Number of branches
            4. ⬛ [CLD1] R77.2.1.4: Number of node types
            5. ⬛ [CLD1] R77.2.1.5: Number of link types
    3. ⬛ [CLD1] R77.3: Generation Process:
        1. ⬛ [CLD1] R77.3.1: Pre-calculate all data before rendering
            1. ⬛ [CLD1] R77.3.1.1: Refer to existing code to understand the naming of attachments, hexes and bars
        2. ⬛ [CLD1] R77.3.2: Store complete structure for animation capabilities
            1. ⬛ [CLD1] R77.3.2.1: Assign colors based on existing centralized color assignment system
            2. ⬛ [CLD1] R77.3.2.2: Maintain node UUIDs across different spatial configurations to enable animation between layouts
        3. ⬛ [CLD1] R77.3.3: Generate test data in separate file
            1. ⬛ [CLD1] R77.3.3.1: Create a set of options for each non-specified property (name, color, etc) and a function that randomly assigns them
    4. ⬛ [CLD1] R77.4: Rendering:
        1. ⬛ [CLD1] R77.4.1: Render each node type with different colors
        2. ⬛ [CLD1] R77.4.2: Render each link type with different colors
        3. ⬛ [CLD1] R77.4.3: All connections shall attach to the center attachment point of each hexagon
    5. ⬛ [CLD1] R77.5: Test Dataset:
        1. ⬛ [CLD1] R77.5.1: Create demonstration dataset with People and Animals
            1. ⬛ [CLD1] R77.5.1.1: People nodes shall include:
                1. ⬛ [CLD1] R77.5.1.1.1: color property
                2. ⬛ [CLD1] R77.5.1.1.2: name property
                3. ⬛ [CLD1] R77.5.1.1.3: age property
            2. ⬛ [CLD1] R77.5.1.2: Animals nodes shall include:
                1. ⬛ [CLD1] R77.5.1.2.1: name property (e.g., Fifi, Bongo)
                2. ⬛ [CLD1] R77.5.1.2.2: type property (e.g., cat, bird, dog)
        2. ⬛ [CLD1] R77.5.2: Include Owns, Wants, and Eats relationships

41. ✅ [CLD1] R78: Simple Data Generator Layout Adjustments:

    1. ✅ [CLD1] R78.1: The system shall set the origin point for the generated graph to coordinates (20, 20, 20)
    2. ✅ [CLD1] R78.2: The system shall reduce node spacing by 50% from the current implementation

## Task List

1.  ✅ Implementation Tasks

    119.  ✅ [CLD1] Modified edge type from "smoothstep" to "straight" in graphAdapters.ts
    120.  ✅ [CLD1] T104: Remove stats widgets from all graph components
    121.  ✅ [CLD1] Remove info panel from ReactFlowGraph showing node/edge counts
    122.  ✅ [CLD1] Remove info panel from CytoscapeGraph showing node/edge counts
    123.  ✅ [CLD1] Remove info panel from D3Graph showing node/link counts
    124.  ✅ [CLD1] Clean up unused imports and state variables in all three components
    125. ✅ [CLD2] T125: Route.js Refactoring (R75)
        1. ✅ [CLD2] Move logic to lib/generateData/ folder and create generateData file (R75.1)
        2. ✅ [CLD2] Extract constants to separate constants file (R75.2)
        3. ✅ [CLD2] Extract interfaces to separate interfaces file (R75.3)
        4. ✅ [CLD2] Extract utils to separate utils file (R75.4)
    126. ✅ [CLD1] T126: Create Small Graphs in Roblox (R76)
        1. ✅ [CLD1] T126.1: Move the existing asset creation code from game.service.ts to a service called makeOldStuff.ts and import it (R76.1)
        2. ✅ [CLD1] T126.2: Create simple input data with parent-child relationships (R76.2)
            1. ✅ [CLD1] T126.2.1: Analyze existing data format in shared/data folder
            2. ✅ [CLD1] T126.2.2: Create 3 entity blocks (1 parent, 2 children)
            3. ✅ [CLD1] T126.2.3: Create 2 relations linking parent to each child
            4. ✅ [CLD1] T126.2.4: Store data in appropriate format for use by graph system
    127. ✅ [CLD1] T127: Create Simple Data Generator (R77)
        1. ✅ [CLD1] T127.1: Define Data Structure (R77.1)
            1. ✅ [CLD1] T127.1.1: Create TypeScript interfaces for Cluster, Node, and Link objects
            2. ✅ [CLD1] T127.1.2: Implement Node interface with uuid, name, type, color, position, and attachments
            3. ✅ [CLD1] T127.1.3: Implement Link interface with uuid, type, source/target uuids, and color
            4. ✅ [CLD1] T127.1.4: Implement Cluster interface with groups array (hierarchical trees) and relations array
        2. ✅ [CLD1] T127.2: Create Configuration System (R77.2)
            1. ✅ [CLD1] T127.2.1: Create configuration interface accepting numGroups, numLevels, numBranches, numNodeTypes, numLinkTypes
            2. ✅ [CLD1] T127.2.2: Implement configuration validation
        3. ✅ [CLD1] T127.3: Implement Generation Process (R77.3)
            1. ✅ [CLD1] T127.3.1: Study existing code for attachment/hex/bar naming conventions
            2. ✅ [CLD1] T127.3.2: Implement pre-calculation of all node positions before rendering
            3. ✅ [CLD1] T127.3.3: Integrate with existing centralized color assignment system
            4. ✅ [CLD1] T127.3.4: Create UUID generation system that persists across spatial configurations
            5. ✅ [CLD1] T127.3.5: Create randomization functions for non-specified properties
        4. ✅ [CLD1] T127.4: Implement Rendering System (R77.4)
            1. ✅ [CLD1] T127.4.1: Create rendering function that uses different colors for each node type
            2. ✅ [CLD1] T127.4.2: Implement different colors for each link type
            3. ✅ [CLD1] T127.4.3: Ensure all connections attach to center attachment points
        5. ✅ [CLD1] T127.5: Create Test Dataset (R77.5)
            1. ✅ [CLD1] T127.5.1: Create People nodes with color, name, and age properties
            2. ✅ [CLD1] T127.5.2: Create Animals nodes with name (Fifi, Bongo, etc.) and type (cat, bird, dog) properties
            3. ✅ [CLD1] T127.5.3: Create Owns, Wants, and Eats relationships
            4. ✅ [CLD1] T127.5.4: Store test data in separate file
            5. ✅ [CLD1] T127.5.5: Test the complete generator with sample data
    128. ✅ [CLD1] T128: Simple Data Generator Layout Adjustments (R78)
        1. ✅ [CLD1] T128.1: Set origin point to (20, 20, 20) for generated graph (R78.1)
        2. ✅ [CLD1] T128.2: Reduce node spacing by 50% to 10 units (R78.2)
        3. ✅ [CLD1] T128.3: Reduce group spacing by 50% to 25 units
        4. ✅ [CLD1] T128.4: Update circular layout to use origin point
        5. ✅ [CLD1] T128.5: Remove hardcoded Y position in node generation
