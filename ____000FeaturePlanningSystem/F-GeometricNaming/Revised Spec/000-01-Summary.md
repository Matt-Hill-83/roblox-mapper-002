# Geometric Naming Audit and Revision - Summary

This feature audits and revises the geometric naming conventions in the Roblox mapper codebase. Currently, items placed parallel to the X and Z axes are referred to by the property being displayed on that axis rather than the axis itself. Additionally, some axes and objects are labeled incorrectly. This audit will identify all instances of confusing naming and create a plan to make naming axis-focused rather than data-focused.

## ASCII Representation of Current Naming Issue

```
Current Confusing Naming:
┌─────────────────────────────────────────┐
│         X-axis swimlanes                │
│     (groups by X property)              │
│     ══════════════════════              │
│     ║ man  ║ woman ║ child ║           │
│     ══════════════════════              │
│     ↑                                   │
│     Actually runs along Z-axis!         │
└─────────────────────────────────────────┘

Proposed Clear Naming:
┌─────────────────────────────────────────┐
│      Z-parallel swimlanes               │
│     (groups by X property)              │
│     ══════════════════════              │
│     ║ man  ║ woman ║ child ║           │
│     ══════════════════════              │
│     ↑                                   │
│     Clearly shows Z orientation         │
└─────────────────────────────────────────┘
```