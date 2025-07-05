# Feature 007: Roblox Graph Creation Requirements

## R76: Create Small Graphs in Roblox

1. ✅ [CLD1] R76.1: The system shall move the existing asset creation code from game.service.ts to a service called makeOldStuff.ts and import it
2. ✅ [CLD1] R76.2: The system shall create a set of simple input data that includes 3 blocks, where 1 is the parent of the other 2, with 2 relations linking the parent to each child

## R77: Create Simple Data Generator

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

## R78: Simple Data Generator Layout Adjustments

1. ✅ [CLD1] R78.1: The system shall set the origin point for the generated graph to coordinates (20, 20, 20)
2. ✅ [CLD1] R78.2: The system shall reduce node spacing by 50% from the current implementation
3. ✅ [CLD1] R78.3: The system shall organize all layout constants into a single layoutConstants object at the top of the layout service file
4. ✅ [CLD1] R78.4: The system shall reduce vertical spacing to 2 units between hierarchical levels
5. ✅ [CLD1] R78.5: The system shall render all nodes with the same size regardless of type
6. ✅ [CLD1] R78.6: The system shall increase the origin Y coordinate by the total height of the structure