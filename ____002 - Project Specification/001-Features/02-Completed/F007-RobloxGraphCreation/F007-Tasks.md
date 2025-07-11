# Feature 007: Roblox Graph Creation Tasks

## T126: Create Small Graphs in Roblox (R76)

126. ✅ [CLD1] T126: Create Small Graphs in Roblox (R76)
     1. ✅ [CLD1] T126.1: Move the existing asset creation code from game.service.ts to a service called makeOldStuff.ts and import it (R76.1)
     2. ✅ [CLD1] T126.2: Create simple input data with parent-child relationships (R76.2)
        1. ✅ [CLD1] T126.2.1: Analyze existing data format in shared/data folder
        2. ✅ [CLD1] T126.2.2: Create 3 entity blocks (1 parent, 2 children)
        3. ✅ [CLD1] T126.2.3: Create 2 relations linking parent to each child
        4. ✅ [CLD1] T126.2.4: Store data in appropriate format for use by graph system

## T127: Create Simple Data Generator (R77)

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

## T128-T129: Simple Data Generator Layout Adjustments (R78)

128. ✅ [CLD1] T128: Simple Data Generator Layout Adjustments (R78)
     1. ✅ [CLD1] T128.1: Set origin point to (20, 20, 20) for generated graph (R78.1)
     2. ✅ [CLD1] T128.2: Reduce node spacing by 50% to 10 units (R78.2)
     3. ✅ [CLD1] T128.3: Reduce group spacing by 50% to 25 units
     4. ✅ [CLD1] T128.4: Update circular layout to use origin point
     5. ✅ [CLD1] T128.5: Remove hardcoded Y position in node generation
     6. ✅ [CLD1] T128.6: Organize all layout constants into layoutConstants object (R78.3)

129. ✅ [CLD1] T129: Additional Simple Data Generator Layout Adjustments (R78.4-R78.6)
     1. ✅ [CLD1] T129.1: Reduce vertical spacing to 2 units between levels (R78.4)
     2. ✅ [CLD1] T129.2: Make all nodes the same size regardless of type (R78.5)
        1. ✅ [CLD1] T129.2.1: Update node renderer to use uniform size
        2. ✅ [CLD1] T129.2.2: Remove type-based size logic
     3. ✅ [CLD1] T129.3: Increase origin Y by structure height (R78.6)
        1. ✅ [CLD1] T129.3.1: Calculate total structure height before layout
        2. ✅ [CLD1] T129.3.2: Adjust origin Y coordinate accordingly