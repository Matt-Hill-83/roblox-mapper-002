# Feature 001: Data Generator Tasks

## T131: Update Data Generator (R80)

1. ⬛ T131.1: Expand name pools (R80.1)
   1. ⬛ T131.1.1: Add 10 people names to the data generator (R80.1.1)
   2. ⬛ T131.1.2: Add 10 animal names to the data generator (R80.1.2)
2. ⬛ T131.2: Expand animal types (R80.2)
   1. ⬛ T131.2.1: Update animal type pool to include 10 different types
   2. ⬛ T131.2.2: Ensure proper distribution of animal types in generation
3. ⬛ T131.3: Update configuration limits (R80.3)
   1. ⬛ T131.3.1: Update maximum levels from current limit to 10 (R80.3.1)
   2. ⬛ T131.3.2: Update maximum node types from current limit to 10 (R80.3.2)
   3. ⬛ T131.3.3: Update GUI input validation to reflect new limits
   4. ⬛ T131.3.4: Test generator with maximum configuration values
4. ✅ [CLD1] T131.4: Create Data Generator Test Script
   1. ✅ [CLD1] T131.4.1: Create testDataGenerator.js script
   2. ✅ [CLD1] T131.4.2: Implement Mermaid diagram visualization output
   3. ✅ [CLD1] T131.4.3: Add level-based node grouping for proper hierarchy display
   4. ✅ [CLD1] T131.4.4: Generate markdown output with summary statistics
   5. ✅ [CLD1] T131.4.5: Add node details table to output

## T132: Create Draw.io Diagram Generator for Test Data

1. ✅ [CLD1] T132.1: Research coordinate support in visualization tools
2. ✅ [CLD1] T132.2: Implement draw.io XML generator with precise positioning
3. ✅ [CLD1] T132.3: Fix layout issues with equal-width level boxes
4. ✅ [CLD1] T132.4: Center nodes within level containers
5. ✅ [CLD1] T132.5: Generate both Mermaid and draw.io outputs

## T133: Implement Swim Lane Organization (R81)

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
   1. ⬛ T133.5.1: Calculate coordinates using 2-unit spacing (x = column _ 2, z = level _ 2, y = 0)
   2. ⬛ T133.5.2: Format labels as "FirstName LastName x,y,z typeNN"
   3. ⬛ T133.5.3: Track global numbering for each type (person01, person02, etc.)
   4. ⬛ T133.5.4: Update draw.io XML to show multi-line labels
6. ⬛ T133.6: Add visual swim lane elements (R81.5)
   1. ⬛ T133.6.1: Create vertical separator lines between type columns
   2. ⬛ T133.6.2: Add type labels at top of each swim lane
   3. ⬛ T133.6.3: Style swim lanes with subtle background colors

## T134: Update Data Generator with Names (R80.1.3-R80.1.4)

1. ✅ T134.1: Add last names array to generator constants
2. ✅ T134.2: Modify person name generation to combine first and last names
3. ✅ T134.3: Update test scripts to handle full names
4. ✅ T134.4: Ensure proper name display in visualizations

## T135: Update Draw.io Scaling for Better Visualization

1. ⬛ T135.1: Use Roblox scale units in generator
2. ✅ T135.2: Add drawIoScaling object to top of testDataGenerator.js
   1. ✅ T135.2.1: Define NODE_WIDTH_SCALE = 5 (5x wider nodes)
   2. ✅ T135.2.2: Define NODE_HEIGHT_SCALE = 2 (2x taller nodes)
   3. ✅ T135.2.3: Define LEVEL_SPACING_SCALE = 2 (2x vertical spacing)
3. ✅ T135.3: Update draw.io XML generation to use scaling constants
   1. ✅ T135.3.1: Apply width scaling to node boxes
   2. ✅ T135.3.2: Apply height scaling to node boxes
   3. ✅ T135.3.3: Apply spacing scaling to level separation

## T136: Integrate Generated Data into Roblox 3D Graph

1. ✅ T136.1: confirm Data generator returns correctly scaled x,y,z data
2. ✅ T136.2: Create entity instances in Roblox
   1. ✅ T136.2.1: Generate hexagon models for each entity
   2. ✅ T136.2.2: Apply entity type colors (blue for People, orange for Animals)
   3. ✅ T136.2.3: Position entities at calculated 3D coordinates
   4. ✅ T136.2.4: Add entity labels with name and type identifier
3. ✅ [CLD1] T136.3: Create relationship connections
   1. ✅ [CLD1] T136.3.1: Generate rope/beam objects for all links
   2. ✅ [CLD1] T136.3.2: Color ropes based on link type
   3. ✅ [CLD1] T136.3.3: Add rope labels showing relationship type
   4. ✅ [CLD1] T136.3.4: Eliminate rope sag for cleaner visualization

## T137: Create Object Generator

1. ✅ [CLD1] T137.1: Create DataGeneratorRobloxRenderer service
   1. ✅ [CLD1] T137.1.1: Use actual data generator instead of mock data
   2. ✅ [CLD1] T137.1.2: Implement swim lane positioning from JS test
   3. ✅ [CLD1] T137.1.3: Generate draw.io diagram on each run
   4. ✅ [CLD1] T137.1.4: Refactor into clean modular structure

## T138: Add Label Scaling Features

1. ⬛ T138.1: Add scaling factor to rope label creation
   1. ⬛ T138.1.1: Add font size scaling parameter
   2. ⬛ T138.1.2: Scale label block width (perpendicular to rope direction)
   3. ⬛ T138.1.3: Keep label block length constant
   4. ⬛ T138.1.4: Test with different scaling values

## T139: Create Label Block Primitive

1. ✅ [CLD1] T139.1: Design label block primitive
   1. ✅ [CLD1] T139.1.1: Create new primitive modeled after makeBar primitive
   2. ✅ [CLD1] T139.1.2: Support cube dimensions (n×n×n)
   3. ✅ [CLD1] T139.1.3: Accept labels configuration object with face-specific properties:
      ```typescript
      labels: {
        top: { ...textBoxProps },
        bottom: { ...textBoxProps },
        front: { ...textBoxProps },
        back: { ...textBoxProps },
        left: { ...textBoxProps },
        right: { ...textBoxProps }
      }
      ```
2. ✅ [CLD1] T139.2: Implement multi-face labeling
   1. ✅ [CLD1] T139.2.1: Create label interface supporting all six faces (top, bottom, front, back, left, right)
   2. ✅ [CLD1] T139.2.2: Each face accepts standard textBox properties
   3. ✅ [CLD1] T139.2.3: Handle label positioning and orientation for each face
3. ✅ [CLD1] T139.3: Test label block primitive
   1. ✅ [CLD1] T139.3.1: Create unit tests for different configurations
   2. ✅ [CLD1] T139.3.2: Verify labels render correctly on all faces
   3. ✅ [CLD1] T139.3.3: Test with various cube sizes

## T140: Add Row Label Blocks to Data Generator

1. ⬛ T140.1: Integrate label blocks with positioning system
   1. ⬛ T140.1.1: Calculate row width for each level
   2. ⬛ T140.1.2: Position label block at the end of each row of nodes
   3. ⬛ T140.1.3: Set block dimensions to match hex width (n×n×n where n = hex width)
2. ⬛ T140.2: Configure level number display
   1. ⬛ T140.2.1: Add level number to each face of the block
   2. ⬛ T140.2.2: Style text to be clearly visible
   3. ⬛ T140.2.3: Ensure proper text orientation on each face
3. ⬛ T140.3: Update renderer to include row labels
   1. ⬛ T140.3.1: Modify dataGeneratorRobloxRenderer to create row label blocks
   2. ⬛ T140.3.2: Ensure proper parent-child relationships in scene hierarchy
   3. ⬛ T140.3.3: Test with different numbers of levels and node configurations
