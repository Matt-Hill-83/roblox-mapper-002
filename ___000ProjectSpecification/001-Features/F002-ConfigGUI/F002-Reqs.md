# Feature 002: Configuration GUI Requirements

## R1: Configuration GUI

1. ✅ [CLD1] R1.1: The system shall provide a screen GUI positioned in the upper left corner
2. ✅ [CLD1] R1.2: The GUI shall display the current configuration parameters:
   1. ✅ [CLD1] R1.2.1: Number of groups
   2. ✅ [CLD1] R1.2.2: Number of levels
   3. ✅ [CLD1] R1.2.3: Number of branches
   4. ✅ [CLD1] R1.2.4: Number of node types
   5. ✅ [CLD1] R1.2.5: Number of link types
3. ✅ [CLD1] R1.3: The GUI shall allow users to modify configuration values through input controls
4. ✅ [CLD1] R1.4: The GUI shall have a "Regenerate" button to apply new configuration values
5. ✅ [CLD1] R1.5: The GUI shall update the 3D visualization when configuration changes are applied

## R2: Enhanced Data Generator GUI

1. ⬛ R2.1: The GUI shall be updated to control the new data generator
2. ⬛ R2.2: The GUI shall provide a grid-based interface for layer configuration:
   1. ⬛ R2.2.1: Each row shall represent a layer of the node group
   2. ⬛ R2.2.2: The grid shall support dynamic addition/removal of layers
3. ⬛ R2.3: Each layer row shall include the following column controls:
   1. ⬛ R2.3.1: Number of nodes in the layer
   2. ⬛ R2.3.2: Number of connections per node
   3. ⬛ R2.3.3: Node type selection (if applicable)
   4. ⬛ R2.3.4: Connection type selection (if applicable)

## GUI Mockup

```
┌─────────────────────────────────────────────────────────────────┐
│ Configuration GUI                                          [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Global Settings (R1 - Original Features)                        │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ Number of Node Types:  [3    ▼]                          │   │
│ │ Number of Link Types:  [3    ▼]                          │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Layer Configuration (R2 - New Features)                         │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ Layer │ # Nodes │ Connections │ Node Type │ Link Type   │   │
│ │       │         │  per Node   │           │             │   │
│ ├───────┼─────────┼─────────────┼───────────┼─────────────┤   │
│ │   1   │ [1    ] │ [2       ]  │ [Type A▼] │ [Parent  ▼] │   │
│ ├───────┼─────────┼─────────────┼───────────┼─────────────┤   │
│ │   2   │ [1    ] │ [3       ]  │ [Type B▼] │ [Child   ▼] │   │
│ ├───────┼─────────┼─────────────┼───────────┼─────────────┤   │
│ │   3   │ [5    ] │ [1       ]  │ [Type C▼] │ [Sibling ▼] │   │
│ ├───────┼─────────┼─────────────┼───────────┼─────────────┤   │
│ │  [+] Add Layer                                            │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐                      │
│ │   Regenerate    │  │     Clear       │                      │
│ └─────────────────┘  └─────────────────┘                      │
│                                                                 │
│ Status: Ready                                                   │
└─────────────────────────────────────────────────────────────────┘

Legend:
- [    ] = Text input field
- [  ▼] = Dropdown selection
- Layer numbers are auto-generated
- Each layer can be removed with an [X] button (not shown for clarity)
```
