# GraphBlaster - Summary

## Overview

DesignANewGeometricGraphLayout - We will design a new geometric layout upon which we will overlay graph data feature nodes and links. The resulting structures will be rendered in Roblox.

## ASCII Representation of GUI

```
┌─────────────────────────────────────────────────────────────┐
│ GraphBlaster Control Panel                                  │
├─────────────┬───────────────────────────────────────────────┤
│ TABS        │ [Data Generation Engine]                      │
│             │ ┌───────────────────────────────────────────┐ │
│ ▶ Data Gen  │ │ Records to Create: [50    ] ▼            │ │
│   Structure │ │ Unique Values:     [10    ] ▼            │ │
│   Linking   │ │                                           │ │
│   Settings  │ │ Preview:                                  │ │
│             │ │ ┌─────────────────────────────────────┐ │ │
│             │ │ │ Name    | Country | Pet  | Lives   │ │ │
│             │ │ ├─────────────────────────────────────┤ │ │
│             │ │ │ John S. | USA     | Dog  | Canada  │ │ │
│             │ │ └─────────────────────────────────────┘ │ │
│             │ │                                           │ │
│             │ │ [Generate Data]                          │ │
│             │ └───────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────┘
```

I need to go to bed, so I don't have time to write a full spec, but I think you can get a lot done with a simple explanation.
Here's how this project is meant to work.  Write up a task list to get this implemented.

1. the idea is to create 50 persons, each with 3 properties (it doesn't matter if we make extra)
2. and each property should have maybe 5 types.
3. Then we map each of these properties to one axis of the rubix cube grid.
4. so if a person has 4 different options for pettype, then the x axis might be mapped to pet types, i forget what teh other props are but here's the idea.
5. say a person has these props:
   1. dog: husky
   2. countryOfResidence: mexico
   3. favoriteColor: blue
4. Then for that person, we would create a little 1x1x1 node inside the coresponding region in the rubix cube.

Create a task list from this