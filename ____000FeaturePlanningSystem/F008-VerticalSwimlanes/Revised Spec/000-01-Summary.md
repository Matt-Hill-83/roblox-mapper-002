# Vertical Swimlanes - Summary

## Overview

Add vertical swimlanes to the 3D visualization system to utilize the Y dimension for mapping a third data property. Currently, X and Z dimensions map to data properties while Y represents hierarchical layers. This feature will repurpose Y to map to a third property similar to how X and Z parallel swimlanes work, creating floating transparent shadow blocks at different Y levels.

## Key Changes

- Repurpose Y dimension from hierarchical layers to property-based positioning
- Use Y group dropdown in GUI to control vertical grouping
- Create floating transparent shadow blocks at each Y level
- Add swimlane shadows on vertical walls

## ASCII Representation of GUI

```
┌─────────────────────────────┐
│ Spatial Grouping            │
├─────────────────────────────┤
│ X group:    [component    ▼]│
│ Z group:    [apiPattern   ▼]│
│ Y group:    [language     ▼]│
├─────────────────────────────┤
│                             │
│ Visual Customization        │
├─────────────────────────────┤
│ background: [httpMethod   ▼]│
│ border:     [none         ▼]│
└─────────────────────────────┘
```

The Y group dropdown (already added to GUI) will now control vertical positioning of nodes based on the selected property value.