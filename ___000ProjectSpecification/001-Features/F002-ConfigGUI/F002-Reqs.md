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

1. ✅ [CLD3] R2.1: The GUI shall be updated to control the new data generator
2. ✅ [CLD3] R2.2: The GUI shall maintain global settings controls:
   1. ✅ [CLD3] R2.2.1: Number of Node Types dropdown selector
   2. ✅ [CLD3] R2.2.2: Number of Link Types dropdown selector
3. ✅ [CLD3] R2.3: The GUI shall provide a grid-based interface for layer configuration:
   1. ✅ [CLD3] R2.3.1: Each row shall represent a layer of the node group
   2. ✅ [CLD3] R2.3.2: Layer numbers shall be auto-generated and displayed
   3. ✅ [CLD3] R2.3.3: The grid shall support dynamic addition of layers via an "Add Layer" button
   4. ✅ [CLD3] R2.3.4: The grid shall support removal of individual layers via delete buttons
4. ✅ [CLD3] R2.4: Each layer row shall include the following column controls:
   1. ✅ [CLD3] R2.4.1: Layer number (read-only, auto-generated)
   2. ✅ [CLD3] R2.4.2: Number of nodes text input field
   3. ✅ [CLD3] R2.4.3: Connections per node text input field
   4. ✅ [CLD3] R2.4.4: Node Type dropdown selector
   5. ✅ [CLD3] R2.4.5: Link Type dropdown selector
   6. ✅ [CLD3] R2.4.6: Delete button [X] to remove the layer
5. ✅ [CLD3] R2.5: The GUI shall include action buttons:
   1. ✅ [CLD3] R2.5.1: "Regenerate" button to apply configuration and rebuild visualization
   2. ✅ [CLD3] R2.5.2: "Clear" button to reset all settings
6. ✅ [CLD3] R2.6: The GUI shall display a status message area

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
│ Layer Configuration (R2 - New Features)                              │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ Layer │ # Nodes │ Connections │ Node Type │ Link Type  │ Del │   │
│ │       │         │  per Node   │           │            │     │   │
│ ├───────┼─────────┼─────────────┼───────────┼────────────┼─────┤   │
│ │   1   │ [1    ] │ [2       ]  │ [Type A▼] │ [Parent ▼] │ [X] │   │
│ ├───────┼─────────┼─────────────┼───────────┼────────────┼─────┤   │
│ │   2   │ [1    ] │ [3       ]  │ [Type B▼] │ [Child  ▼] │ [X] │   │
│ ├───────┼─────────┼─────────────┼───────────┼────────────┼─────┤   │
│ │   3   │ [5    ] │ [1       ]  │ [Type C▼] │ [Sibling▼] │ [X] │   │
│ ├───────┼─────────┼─────────────┼───────────┼────────────┼─────┤   │
│ │  [+] Add Layer                                                 │   │
│ └──────────────────────────────────────────────────────────────┘   │
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
- [X] = Delete button for removing a layer
- [+] Add Layer = Button to add a new layer row
- Layer numbers are auto-generated
```
