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
    2. ⬛ R80.2: The system shall support 10 different animal types
    3. ⬛ R80.3: The system shall allow configuration of up to:
       1. ⬛ R80.3.1: 10 hierarchical levels in the generated structure
       2. ⬛ R80.3.2: 10 different node types
    4. ⬛ R80.4: The system shall remove hard-coded limits in the data generator:
       1. ⬛ R80.4.1: Remove hard-coded check for numNodeTypes > 2
       2. ⬛ R80.4.2: Make all configuration limits data-driven rather than hard-coded

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
