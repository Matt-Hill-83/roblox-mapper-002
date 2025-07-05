# Feature 001: Data Generator Requirements

## R80: Update Data Generator

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

## R81: Organize Node Types into Swim Lanes

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