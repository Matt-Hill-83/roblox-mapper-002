# Project Tasks and Requirements - Current

## Feature Documents

- **Feature 001: Data Generator** 
  - Requirements: [Feat001-DataGenerator-Reqs.md](Feat001-DataGenerator-Reqs.md)
  - Tasks: [Feat001-DataGenerator-Tasks.md](Feat001-DataGenerator-Tasks.md)
  
- **Feature 002: Configuration GUI**
  - Requirements: [Feat002-ConfigGUI-Reqs.md](Feat002-ConfigGUI-Reqs.md)
  - Tasks: [Feat002-ConfigGUI-Tasks.md](Feat002-ConfigGUI-Tasks.md)

## Requirements

41. ✅ [CLD1] R78: Simple Data Generator Layout Adjustments:

    1. ✅ [CLD1] R78.1: The system shall set the origin point for the generated graph to coordinates (20, 20, 20)
    2. ✅ [CLD1] R78.2: The system shall reduce node spacing by 50% from the current implementation
    3. ✅ [CLD1] R78.3: The system shall organize all layout constants into a single layoutConstants object at the top of the layout service file
    4. ✅ [CLD1] R78.4: The system shall reduce vertical spacing to 2 units between hierarchical levels
    5. ✅ [CLD1] R78.5: The system shall render all nodes with the same size regardless of type
    6. ✅ [CLD1] R78.6: The system shall increase the origin Y coordinate by the total height of the structure

42. ✅ [CLD1] R79: Configuration GUI - See [Feat002-ConfigGUI-Reqs.md](Feat002-ConfigGUI-Reqs.md)

43. ⬛ R80-R81: Data Generator and Swim Lanes - See [Feat001-DataGenerator-Reqs.md](Feat001-DataGenerator-Reqs.md)

## Task List

1.  ✅ Implementation Tasks

    149.  ✅ [CLD1] T129.3: Increase origin Y by structure height (R78.6)
          1. ✅ [CLD1] T129.3.1: Calculate total structure height before layout
          2. ✅ [CLD1] T129.3.2: Adjust origin Y coordinate accordingly
    150.  ✅ [CLD1] T130: Configuration GUI - See [Feat002-ConfigGUI-Tasks.md](Feat002-ConfigGUI-Tasks.md)
    
    151.  ⬛ T131-T134: Data Generator and Swim Lanes - See [Feat001-DataGenerator-Tasks.md](Feat001-DataGenerator-Tasks.md)
