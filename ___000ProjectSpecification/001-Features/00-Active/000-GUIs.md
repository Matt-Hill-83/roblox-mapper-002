
#### 1. Graph Configuration (Left side)
```
┌─────────────────────────────────────────────────────────┐
│ Graph Configuration                               [−]    │
├─────────────────────────────────────────────────────────┤
│ ┌─── Global Settings ─────────────────────────────────┐ │
│ │ Node Height:    [0.5  ] ▼  Radius: [0.5  ] ▼       │ │
│ │ Layer Spacing: [0.5  ] ▼  Node Spacing: [1.0  ] ▼  │ │
│ │ Swimlane Spacing: [1.0] ▼  Link Diameter: [0.1 ] ▼ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─── Node/Link Types ─────────────────────────────────┐ │
│ │ Node Types: [4] ▼  Link Types: [3] ▼  Pet Types: [5]│ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─── Layer Configuration (Scrollable) ────────────────┐ │
│ │ Layer │ Nodes │ Conn │ Node Type │ Link Type │ [X] │ │
│ │   1   │  4    │  0   │   Auto    │   Auto    │     │ │
│ │   2   │  8    │  1   │   Auto    │   Auto    │     │ │
│ │   3   │  12   │  0   │   Auto    │   Auto    │     │ │
│ │   4   │  16   │  2   │   Auto    │   Auto    │     │ │
│ │   5   │  20   │  0   │   Auto    │   Auto    │     │ │
│ │ [+ Add Layer]                                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ [Regenerate] [Update] [Clear] [Export]                  │
│                                                          │
│ Status: Ready                                            │
└─────────────────────────────────────────────────────────┘
```

#### 2. Visualization Controls (Right side top)
```
┌─────────────────────────────────────────────────────────┐
│ Visualization Controls                            [−]    │
├─────────────────────────────────────────────────────────┤
│ ☑ Show nodes          ☐ Show link labels               │
│ ☑ Show connectors     ☑ Create same-layer links        │
└─────────────────────────────────────────────────────┘
```

#### 3. Compact Axis Controls (Right side center)
```
┌─────────────────────────────────────────────────────────┐
│ Axis Mapping                                            │
│ x-axis: [type      ] ▼     z-axis: [petType    ] ▼     │
│                                                          │
│ Visual Customization                                     │
│ background: [none  ] ▼     border: [none       ] ▼     │
│                                                          │
│ Y-Axis Configuration                                     │
│ ◉ Use Layer for Y Position                              │
│ ○ Use Property: [Select Property                ] ▼     │
└─────────────────────────────────────────────────────────┘
```

#### 4. Node Properties Inspector (Dynamic - appears on node click)
```
┌─────────────────────────────────┐
│ Node Properties           [X]   │
├─────────────────────────────────┤
│ Node: grandpa1Node1             │
│ ─────────────────────────────── │
│ id: grandpa1Node1               │
│ UUID: node_1_1                  │
│ Type: grandpa1                  │
│ Layer: 1                        │
│ Properties:                     │
│   • age: None                   │
│   • petType: iguana             │
│   • petColor: purple            │
│   • firstName: Sofia            │
│   • lastName: Garcia            │
│   • countryOfBirth: Brazil     │
│   • countryOfResidence: Mexico │
│                                 │
│ Connections:                    │
│   • Links to 4 nodes            │
│   • Links from 0 nodes          │
└─────────────────────────────────┘
```
