Requirements:

41. ✅ [CLD1] R78: Simple Data Generator Layout Adjustments:

    1. ✅ [CLD1] R78.1: The system shall set the origin point for the generated graph to coordinates (20, 20, 20)
    2. ✅ [CLD1] R78.2: The system shall reduce node spacing by 50% from the current implementation
    3. ✅ [CLD1] R78.3: The system shall organize all layout constants into a single layoutConstants object at the top of the layout service file
    4. ✅ [CLD1] R78.4: The system shall reduce vertical spacing to 2 units between hierarchical levels
    5. ✅ [CLD1] R78.5: The system shall render all nodes with the same size regardless of type
    6. ✅ [CLD1] R78.6: The system shall increase the origin Y coordinate by the total height of the structure

42. ✅ [CLD1] R79: Configuration GUI:

    1. ✅ [CLD1] R79.1: The system shall provide a screen GUI positioned in the upper left corner
    2. ✅ [CLD1] R79.2: The GUI shall display the current configuration parameters:
       1. ✅ [CLD1] R79.2.1: Number of groups
       2. ✅ [CLD1] R79.2.2: Number of levels
       3. ✅ [CLD1] R79.2.3: Number of branches
       4. ✅ [CLD1] R79.2.4: Number of node types
       5. ✅ [CLD1] R79.2.5: Number of link types
    3. ✅ [CLD1] R79.3: The GUI shall allow users to modify configuration values through input controls
    4. ✅ [CLD1] R79.4: The GUI shall have a "Regenerate" button to apply new configuration values
    5. ✅ [CLD1] R79.5: The GUI shall update the 3D visualization when configuration changes are applied

43. ⬛ R80: Update Data Generator:

    1. ⬛ R80.1: The system shall expand the name pools for test data generation:
       1. ⬛ R80.1.1: Include 10 people names for human entities
       2. ⬛ R80.1.2: Include 10 animal names for animal entities
       3. ⬛ R80.1.3: Include 10 last names for human entities
       4. ⬛ R80.1.4: Combine first and last names for each human entity
    2. ⬛ R80.2: The system shall support 10 different animal types
    3. ⬛ R80.3: The system shall allow configuration of up to:
       1. ⬛ R80.3.1: 10 hierarchical levels in the generated structure
       2. ⬛ R80.3.2: 10 different node types
    4. ⬛ R80.4: The system shall remove hard-coded limits in the data generator:
       1. ⬛ R80.4.1: Remove hard-coded check for numNodeTypes > 2
       2. ⬛ R80.4.2: Make all configuration limits data-driven rather than hard-coded

44. ⬛ R81: Organize Node Types into Swim Lanes:

    1. ⬛ R81.1: The system shall organize nodes by type into vertical swim lanes in the draw.io diagram
    2. ⬛ R81.2: The system shall use an invisible grid system for column layout
       1. ⬛ R81.2.1: Set node boxes to 1 unit wide
       2. ⬛ R81.2.2: Set columns to 2 units wide (providing 1 unit horizontal spacing)
       3. ⬛ R81.2.3: Add 3 units of spacing between different type groups
       4. ⬛ R81.2.4: Calculate swim lane width as (node_count × 2) units
    3. ⬛ R81.3: The system shall sort nodes within each row by their type
       1. ⬛ R81.3.1: Group all nodes of the same type together
       2. ⬛ R81.3.2: Maintain consistent type ordering across all rows
    4. ⬛ R81.4: The system shall create type-specific grouping columns
       1. ⬛ R81.4.1: Calculate the maximum number of nodes for each type across all rows
       2. ⬛ R81.4.2: Set each type's column width to accommodate its largest group
       3. ⬛ R81.4.3: Ensure consistent column positioning across all levels
       4. ⬛ R81.4.4: Order columns from left to right in descending width order (largest group first)
    5. ⬛ R81.5: The system shall visually distinguish swim lanes
       1. ⬛ R81.5.1: Add vertical separators between type groups
       2. ⬛ R81.5.2: Include type labels at the top of each swim lane
    6. ⬛ R81.6: The system shall organize nodes within each swim lane
       1. ⬛ R81.6.1: Sort nodes alphabetically by name within each type group
       2. ⬛ R81.6.2: Assign sequential numbers across all nodes of each type (not per row)
    7. ⬛ R81.7: The system shall display node information in specific format
       1. ⬛ R81.7.1: Format: "FirstName LastName x,y,z typeNN" (e.g., "Bob Smith 2,2,0 person01")
       2. ⬛ R81.7.2: Use spacing value of 2 units for coordinate calculations
       3. ⬛ R81.7.3: Generate coordinates for use in both draw.io and Roblox

## Task List

1.  ✅ Implementation Tasks

    149.  ✅ [CLD1] T129.3: Increase origin Y by structure height (R78.6)
          1. ✅ [CLD1] T129.3.1: Calculate total structure height before layout
          2. ✅ [CLD1] T129.3.2: Adjust origin Y coordinate accordingly
    150.  ✅ [CLD1] T130: Configuration GUI (R79)
    151.  ✅ [CLD1] T130.1: Create GUI service and basic screen GUI structure (R79.1)
          1. ✅ [CLD1] T130.1.1: Create configGUI.service.ts
          2. ✅ [CLD1] T130.1.2: Create ScreenGui with Frame positioned in upper left
          3. ✅ [CLD1] T130.1.3: Set up proper GUI styling and layout
    152.  ✅ [CLD1] T130.2: Display current configuration (R79.2)
          1. ✅ [CLD1] T130.2.1: Create labels for each config parameter
          2. ✅ [CLD1] T130.2.2: Display current values from config001
    153.  ✅ [CLD1] T130.3: Add input controls (R79.3)
          1. ✅ [CLD1] T130.3.1: Create TextBox inputs for each parameter
          2. ✅ [CLD1] T130.3.2: Add input validation for numeric values
          3. ✅ [CLD1] T130.3.3: Add min/max constraints per parameter
    154.  ✅ [CLD1] T130.4: Implement regenerate functionality (R79.4-R79.5)
          1. ✅ [CLD1] T130.4.1: Add "Regenerate" button
          2. ✅ [CLD1] T130.4.2: Clear existing visualization on regenerate
          3. ✅ [CLD1] T130.4.3: Generate new cluster with updated config
          4. ✅ [CLD1] T130.4.4: Render new visualization
    155.  ⬛ T131: Update Data Generator (R80)
    156.  ⬛ T131.1: Expand name pools (R80.1)
          1. ⬛ T131.1.1: Add 10 people names to the data generator (R80.1.1)
          2. ⬛ T131.1.2: Add 10 animal names to the data generator (R80.1.2)
    157.  ⬛ T131.2: Expand animal types (R80.2)
          1. ⬛ T131.2.1: Update animal type pool to include 10 different types
          2. ⬛ T131.2.2: Ensure proper distribution of animal types in generation
    158.  ⬛ T131.3: Update configuration limits (R80.3)
          1. ⬛ T131.3.1: Update maximum levels from current limit to 10 (R80.3.1)
          2. ⬛ T131.3.2: Update maximum node types from current limit to 10 (R80.3.2)
          3. ⬛ T131.3.3: Update GUI input validation to reflect new limits
          4. ⬛ T131.3.4: Test generator with maximum configuration values
    159.  ✅ [CLD1] T131.4: Create Data Generator Test Script
          1. ✅ [CLD1] T131.4.1: Create testDataGenerator.js script
          2. ✅ [CLD1] T131.4.2: Implement Mermaid diagram visualization output
          3. ✅ [CLD1] T131.4.3: Add level-based node grouping for proper hierarchy display
          4. ✅ [CLD1] T131.4.4: Generate markdown output with summary statistics
          5. ✅ [CLD1] T131.4.5: Add node details table to output
    160.  ✅ [CLD1] T132: Create Draw.io Diagram Generator for Test Data
          1. ✅ [CLD1] T132.1: Research coordinate support in visualization tools
          2. ✅ [CLD1] T132.2: Implement draw.io XML generator with precise positioning
          3. ✅ [CLD1] T132.3: Fix layout issues with equal-width level boxes
          4. ✅ [CLD1] T132.4: Center nodes within level containers
          5. ✅ [CLD1] T132.5: Generate both Mermaid and draw.io outputs
    161.  ⬛ T133: Implement Swim Lane Organization (R81)
          1. ⬛ T133.1: Calculate swim lane structure (R81.1-R81.2)
                1. ⬛ T133.1.1: Analyze all levels to find row with most nodes
                2. ⬛ T133.1.2: Calculate optimal column width based on canvas and node count
                3. ⬛ T133.1.3: Determine number of swim lane columns needed
          2. ⬛ T133.2: Group nodes by type (R81.3)
                1. ⬛ T133.2.1: Sort nodes within each level by type
                2. ⬛ T133.2.2: Create consistent type ordering across all levels
          3. ⬛ T133.3: Create type-specific columns (R81.4)
                1. ⬛ T133.3.1: Calculate max nodes per type across all levels
                2. ⬛ T133.3.2: Sort columns by width (descending, largest first)
                3. ⬛ T133.3.3: Calculate column positions and widths
          4. ⬛ T133.4: Implement node organization within columns (R81.6)
                1. ⬛ T133.4.1: Sort nodes alphabetically by name within type groups
                2. ⬛ T133.4.2: Assign sequential numbers to nodes in each group
          5. ⬛ T133.5: Implement coordinate and label system (R81.7)
                1. ⬛ T133.5.1: Calculate coordinates using 2-unit spacing (x = column * 2, z = level * 2, y = 0)
                2. ⬛ T133.5.2: Format labels as "FirstName LastName x,y,z typeNN"
                3. ⬛ T133.5.3: Track global numbering for each type (person01, person02, etc.)
                4. ⬛ T133.5.4: Update draw.io XML to show multi-line labels
          6. ⬛ T133.6: Add visual swim lane elements (R81.5)
                1. ⬛ T133.6.1: Create vertical separator lines between type columns
                2. ⬛ T133.6.2: Add type labels at top of each swim lane
                3. ⬛ T133.6.3: Style swim lanes with subtle background colors
    162.  ⬛ T134: Update Data Generator with Names (R80.1.3-R80.1.4)
          1. ⬛ T134.1: Add last names array to generator constants
          2. ⬛ T134.2: Modify person name generation to combine first and last names
          3. ⬛ T134.3: Update test scripts to handle full names
          4. ⬛ T134.4: Ensure proper name display in visualizations
