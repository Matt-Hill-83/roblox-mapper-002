# 3D Node Pivot Graph Summary

Upgrade the existing 3D graph layout to function like a pivot table, allowing users to dynamically select which node properties are represented on the X and Z axes through the GUI. Currently, the Y axis depicts hierarchical relationships (which remains unchanged), X axis shows node type, and Z axis shows pet type. This feature adds flexibility for users to pivot the data visualization by different properties.

## Key Features

- Add petColor property to all person nodes
- Add visual labels to X and Z axis swimlanes
- Create shadow blocks under Z-axis swimlanes
- Add dropdown selectors in GUI for dynamic axis property selection
- Support real-time re-rendering when axis properties change

## Visual Concept

The graph will display nodes organized in a 3D grid where:
- Y-axis: Hierarchical relationships (unchanged)
- X-axis: User-selected property (default: node type)
- Z-axis: User-selected property (default: pet type)

Users can pivot the visualization by selecting different properties for X and Z axes via dropdown menus in the GUI.

## Platform and Shadow Block Layout (Top-Down View)

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─────────────┐       ┌─────────────┐     │
│  │   Cat Lane  │       │   Dog Lane  │     │  ← Z-axis swimlane shadows
│  │   (Pink)    │       │   (Yellow)  │     │     (Pet types)
│  └─────────────┘       └─────────────┘     │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │  ┌────────┐  ┌────────┐            │  │
│  │  │  Man   │  │ Woman  │            │  │  ← X-axis swimlane blocks
│  │  │ (Blue) │  │ (Pink) │            │  │     (Node types)
│  │  └────────┘  └────────┘            │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                             │
│               Group Shadow Block            │  ← Main shadow block
│                   (Blue)                    │     (All nodes)
└─────────────────────────────────────────────┘
                Platform Block
                   (Grey)

Legend:
- Platform Block: Base platform at ground level
- Group Shadow Block: Blue shadow representing all nodes
- X-axis swimlanes: Colored blocks for each node type (Man, Woman)
- Z-axis swimlanes: Colored blocks for each pet type (Cat, Dog)
- All swimlane blocks are centered over the group shadow
```

### Layer Stack (Side View)
```
Y ↑
  │  Nodes (hexagons at various heights)
  │  ─────────────────────────────────────
  │  Z-axis swimlane shadows (Pet types)
  │  ─────────────────────────────────────
  │  X-axis swimlane blocks (Node types)
  │  ─────────────────────────────────────
  │  Group Shadow Block
  │  ─────────────────────────────────────
  └─ Platform Block ────────────────────► X/Z
```