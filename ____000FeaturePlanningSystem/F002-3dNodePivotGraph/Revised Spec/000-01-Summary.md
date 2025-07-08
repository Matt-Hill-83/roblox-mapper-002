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
Looking down from above:

Z axis ↑
       │
       │  ┌─────────────────┬─────────────────┐
       │  │                 │                 │
       │  │    Cat Lane     │    Cat Lane     │
       │  │    (Pink)       │    (Pink)       │
       │  │                 │                 │
       │  ├─────────────────┼─────────────────┤
       │  │                 │                 │
       │  │    Dog Lane     │    Dog Lane     │
       │  │   (Yellow)      │   (Yellow)      │
       │  │                 │                 │
       │  └─────────────────┴─────────────────┘
       │       Man (Blue)      Woman (Pink)
       └────────────────────────────────────────→ X axis

Each cell shows the overlap of:
- Z-axis swimlane (horizontal bands: Cat/Dog)
- X-axis swimlane (vertical bands: Man/Woman)

The blue group shadow block sits beneath all swimlanes,
and the grey platform block is at the base.
```

### Top View

```
                                          Platform
              ┌───────────────────────────────────────────────────────────────────────┐
              │                                                                       │
              │                            Group Shadow                               │
              │      ┌───────────────────────────────────────────────────────────┐    │
              │      │                  Swimlane Shadows with End Caps           │    │
              │      │                                                           │    │
              │      │                 1        2        3        4              │    │
              │      │               ┌───┐    ┌───┐    ┌───┐    ┌───┐            │    │
              │      │               └───┘    └───┘    └───┘    └───┘            │    │
              │      │               ┌───┐    ┌───┐    ┌───┐    ┌───┐            │    │
              │      │               │   │    │   │    │   │    │   │            │    │
              │      │      ┌─┐ ┌────┼───┼────┼───┼────┼───┼────┼───┼────┐ ┌─┐   │    │
              │      │      │ │ │    │   │    │   │  Bird  │    │   │    │ │ │ 4 │    │
              │      │      └─┘ └────┼───┼────┼───┼────┼───┼────┼───┼────┘ └─┘   │    │
              │      │               │   │    │   │    │   │    │   │            │    │
              │      │      ┌─┐ ┌────┼───┼────┼───┼────┼───┼────┼───┼────┐ ┌─┐   │    │
              │      │      │ │ │    │   │    │   │  Fish  │    │   │    │ │ │ 3 │    │
              │      │      └─┘ └────┼───┼────┼───┼────┼───┼────┼───┼────┘ └─┘   │    │
              │      │               │   │    │   │    │   │    │   │            │    │
              │      │      ┌─┐ ┌────┼───┼────┼───┼────┼───┼────┼───┼────┐ ┌─┐   │    │
              │      │      │ │ │    │   │    │   │  Dog   │    │   │    │ │ │ 2 │    │
              │      │      └─┘ └────┼───┼────┼───┼────┼───┼────┼───┼────┘ └─┘   │    │
              │      │               │   │    │   │    │   │    │   │            │    │
              │      │      ┌─┐ ┌────┼───┼────┼───┼────┼───┼────┼───┼────┐ ┌─┐   │    │
              │      │      │ │ │    │   │    │   │  Cat   │    │   │    │ │ │ 1 │    │
              │      │      └─┘ └────┼───┼────┼───┼────┼───┼────┼───┼────┘ └─┘   │    │
              │      │               │   │    │   │    │   │    │   │            │    │
              │      │               └───┘    └───┘    └───┘    └───┘            │    │
              │      │               ┌───┐    ┌───┐    ┌───┐    ┌───┐            │    │
              │      │               └───┘    └───┘    └───┘    └───┘            │    │
              │      └───────────────────────────────────────────────────────────┘    │
              │                                                                       │
              └───────────────────────────────────────────────────────────────────────┘
```

### Layer Stack (Side View)
```
Side view showing vertical layers:

Y axis ↑
       │
       │  [Nodes/Hexagons at various heights]
       │  ─────────────────────────────────────
       │  [Z-axis swimlanes: Cat, Dog]
       │  ─────────────────────────────────────
       │  [X-axis swimlanes: Man, Woman]  
       │  ─────────────────────────────────────
       │  [Group Shadow Block (Blue)]
       │  ─────────────────────────────────────
       └─ [Platform Block (Grey)] ──────────────→ X/Z plane
```