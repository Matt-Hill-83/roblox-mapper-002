# Flat Block Under Nodes Summary

Create a multi-layered block system positioned under the node tree as part of the node creation process in the Roblox game. This system serves as a visual foundation with separate blocks for platform, shadow, and swimlanes.

## Block Hierarchy Visualization

```
                    🔷 Nodes (Hexagons)
                         |
    ┌────────────────────┴─────────────────────┐
    │                                           │
    │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │  Layer 3
    │  │Node │  │Node │  │Node │  │Node │    │
    │  └─────┘  └─────┘  └─────┘  └─────┘    │
    │                                           │
    │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │  Layer 2
    │  │Node │  │Node │  │Node │  │Node │    │
    │  └─────┘  └─────┘  └─────┘  └─────┘    │
    │                                           │
    │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │  Layer 1
    │  │Node │  │Node │  │Node │  │Node │    │
    └──┴─────┴──┴─────┴──┴─────┴──┴─────┴────┘
         │         │         │         │
    ╔════╧════╦════╧════╦════╧════╦════╧════╗
    ║ People  ║ Animals ║Buildings║Vehicles ║  ← Swimlane Shadow Blocks (Opaque)
    ║ (Blue)  ║(Orange) ║ (Green) ║(Magenta)║    Height: 3 units, Y: 1.6
    ╚═════════╩═════════╩═════════╩═════════╝    Parent: Group Shadow Block
         │         │         │         │
    ┏━━━━┷━━━━━━━━┷━━━━━━━━┷━━━━━━━━┷━━━━━┓
    ┃                                       ┃  ← Group Shadow Block (Light Blue)
    ┃      GROUP SHADOW BLOCK               ┃    Height: 3 units, Y: 1.5
    ┃      (Node bounds + 2 buffer)         ┃    Parent: Platform Block
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                      │
    ╔═══════════════════════════════════════╗
    ║          PLATFORM BLOCK                ║  ← Platform Block (Light Green)
    ║            100 x 100                   ║    Height: 3 units, Y: 1.4
    ║         Material: Concrete             ║    (0.1 lower than group shadow)
    ╚════════════════════════════════════════╝    Collision: Enabled
    ═══════════════════════════════════════════  ← Ground (Y = 0)
```

## Key Features

### Platform Block (Bottom Layer)
- Fixed size: 100x100 units in X,Z dimensions
- Height: 3 units
- Material: Concrete
- Color: Light green (0.5, 1, 0.5)
- Position: 0.1 units lower than shadow block to prevent Z-fighting

### Shadow Block (Middle Layer)
- Dynamic size: Matches node tree bounds + 2 unit buffer
- Height: 3 units
- Material: Concrete
- Color: Light blue (0.5, 0.7, 1)
- Parent: Platform Block

### Swimlane Shadow Blocks (Top Layer)
- One block per node type (People, Animals, Buildings, etc.)
- Dynamic size: Matches actual swimlane bounds (using config nodeRadius for hexagon width)
- Height: 3 units
- Material: Concrete (fully opaque, 0 transparency)
- Colors: Match node type colors
- Parent: Group Shadow Block
- Y Position: 1.6 (0.1 units above group shadow block to prevent Z-fighting)

## Technical Details
- All blocks are anchored (physics disabled)
- Platform and Group Shadow blocks have collision enabled
- Swimlane Shadow blocks have collision disabled
- Entire block system is deleted and recreated on regenerate
- Blocks positioned at ground level (Y = 0)