# Project Tasks and Requirements - Current

## Feature Documents

| Num  | Feature Name       | Tasks | Done | Pct  | Status   | Next Task              |
| ---- | ------------------ | ----- | ---- | ---- | -------- | ---------------------- |
| F002 | Configuration GUI  | 20    | 20   | 100% | Complete | None                   |
| F003 | Web App UI         | 155   | 155  | 100% | Complete | None                   |
| F004 | Graph Optimization | 7     | 7    | 100% | Complete | None                   |
| F005 | Testing Framework  | 4     | 4    | 100% | Complete | None                   |
| F006 | Code Refactoring   | 13    | 13   | 100% | Complete | None                   |
| F007 | Roblox Graph       | 58    | 58   | 100% | Complete | None                   |
| F008 | Console Demo       | 48    | 48   | 100% | Complete | None                   |
| F001 | Data Generator     | 62    | 17   | 27%  | In Prog  | T131.1.1: Add 10 names |

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
