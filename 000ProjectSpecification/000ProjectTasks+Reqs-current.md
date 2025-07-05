# Project Tasks and Requirements - Current

## Feature Documents

- **Feature 001: Data Generator** 
  - Summary: [001-Features/F001-DataGenerator/F001-Summary.md](001-Features/F001-DataGenerator/F001-Summary.md)
  - Requirements: [001-Features/F001-DataGenerator/F001-Reqs.md](001-Features/F001-DataGenerator/F001-Reqs.md)
  - Tasks: [001-Features/F001-DataGenerator/F001-Tasks.md](001-Features/F001-DataGenerator/F001-Tasks.md)
  
- **Feature 002: Configuration GUI**
  - Summary: [001-Features/F002-ConfigGUI/F002-Summary.md](001-Features/F002-ConfigGUI/F002-Summary.md)
  - Specification: [001-Features/F002-ConfigGUI/F002-Spec.md](001-Features/F002-ConfigGUI/F002-Spec.md)
  - Requirements: [001-Features/F002-ConfigGUI/F002-Reqs.md](001-Features/F002-ConfigGUI/F002-Reqs.md)
  - Tasks: [001-Features/F002-ConfigGUI/F002-Tasks.md](001-Features/F002-ConfigGUI/F002-Tasks.md)

- **Feature 003: Web App UI Enhancements**
  - Summary: [001-Features/F003-WebAppUI/F003-Summary.md](001-Features/F003-WebAppUI/F003-Summary.md)
  - Requirements: [001-Features/F003-WebAppUI/F003-Reqs.md](001-Features/F003-WebAppUI/F003-Reqs.md)
  - Tasks: [001-Features/F003-WebAppUI/F003-Tasks.md](001-Features/F003-WebAppUI/F003-Tasks.md)

- **Feature 004: Graph Layout Optimization**
  - Summary: [001-Features/F004-GraphOptimization/F004-Summary.md](001-Features/F004-GraphOptimization/F004-Summary.md)
  - Requirements: [001-Features/F004-GraphOptimization/F004-Reqs.md](001-Features/F004-GraphOptimization/F004-Reqs.md)
  - Tasks: [001-Features/F004-GraphOptimization/F004-Tasks.md](001-Features/F004-GraphOptimization/F004-Tasks.md)

- **Feature 005: Testing Framework**
  - Summary: [001-Features/F005-TestingFramework/F005-Summary.md](001-Features/F005-TestingFramework/F005-Summary.md)
  - Requirements: [001-Features/F005-TestingFramework/F005-Reqs.md](001-Features/F005-TestingFramework/F005-Reqs.md)
  - Tasks: [001-Features/F005-TestingFramework/F005-Tasks.md](001-Features/F005-TestingFramework/F005-Tasks.md)

- **Feature 006: Code Refactoring**
  - Summary: [001-Features/F006-CodeRefactoring/F006-Summary.md](001-Features/F006-CodeRefactoring/F006-Summary.md)
  - Requirements: [001-Features/F006-CodeRefactoring/F006-Reqs.md](001-Features/F006-CodeRefactoring/F006-Reqs.md)
  - Tasks: [001-Features/F006-CodeRefactoring/F006-Tasks.md](001-Features/F006-CodeRefactoring/F006-Tasks.md)

- **Feature 007: Roblox Graph Creation**
  - Summary: [001-Features/F007-RobloxGraphCreation/F007-Summary.md](001-Features/F007-RobloxGraphCreation/F007-Summary.md)
  - Requirements: [001-Features/F007-RobloxGraphCreation/F007-Reqs.md](001-Features/F007-RobloxGraphCreation/F007-Reqs.md)
  - Tasks: [001-Features/F007-RobloxGraphCreation/F007-Tasks.md](001-Features/F007-RobloxGraphCreation/F007-Tasks.md)

- **Feature 008: Console Demo and Early Web Interface**
  - Summary: [001-Features/F008-ConsoleDemo/F008-Summary.md](001-Features/F008-ConsoleDemo/F008-Summary.md)
  - Requirements: [001-Features/F008-ConsoleDemo/F008-Reqs.md](001-Features/F008-ConsoleDemo/F008-Reqs.md)
  - Tasks: [001-Features/F008-ConsoleDemo/F008-Tasks.md](001-Features/F008-ConsoleDemo/F008-Tasks.md)

## Requirements

41. ✅ [CLD1] R78: Simple Data Generator Layout Adjustments:

    1. ✅ [CLD1] R78.1: The system shall set the origin point for the generated graph to coordinates (20, 20, 20)
    2. ✅ [CLD1] R78.2: The system shall reduce node spacing by 50% from the current implementation
    3. ✅ [CLD1] R78.3: The system shall organize all layout constants into a single layoutConstants object at the top of the layout service file
    4. ✅ [CLD1] R78.4: The system shall reduce vertical spacing to 2 units between hierarchical levels
    5. ✅ [CLD1] R78.5: The system shall render all nodes with the same size regardless of type
    6. ✅ [CLD1] R78.6: The system shall increase the origin Y coordinate by the total height of the structure

42. ✅ [CLD1] R79: Configuration GUI - See [001-Features/F002-ConfigGUI/F002-Reqs.md](001-Features/F002-ConfigGUI/F002-Reqs.md)

43. ⬛ R80-R81: Data Generator and Swim Lanes - See [001-Features/F001-DataGenerator/F001-Reqs.md](001-Features/F001-DataGenerator/F001-Reqs.md)

## Task List

1.  ✅ Implementation Tasks

    149.  ✅ [CLD1] T129.3: Increase origin Y by structure height (R78.6)
          1. ✅ [CLD1] T129.3.1: Calculate total structure height before layout
          2. ✅ [CLD1] T129.3.2: Adjust origin Y coordinate accordingly
    150.  ✅ [CLD1] T130: Configuration GUI - See [001-Features/F002-ConfigGUI/F002-Tasks.md](001-Features/F002-ConfigGUI/F002-Tasks.md)
    
    151.  ⬛ T131-T134: Data Generator and Swim Lanes - See [001-Features/F001-DataGenerator/F001-Tasks.md](001-Features/F001-DataGenerator/F001-Tasks.md)
