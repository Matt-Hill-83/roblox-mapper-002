# Pet Lanes Misalignment Analysis

## Problem Description

The collection of pet swimlane shadow blocks (Cat and Dog lanes) is not centered above the blue group shadow block. The pet lanes appear offset in the Z direction (forward/backward), creating a visual misalignment where the pet lanes don't align with the center of the main group shadow.

## Visual Analysis

From the image, we can see:
- A blue group shadow block that represents the bounds of all nodes
- Two pet lane blocks (for Cat and Dog) that are offset forward/backward
- The pet lanes as a collection are not centered over the group shadow

## Log Analysis

### Group Shadow Block (Blue)
```
[BaseBlockCreator] Created shadow block:
   - Position: (0, 0.6000000238418579, 0)
   - Size: 24 x 1 x 7 (W x H x D)
```
- **Z center**: 0
- **Z range**: -3.5 to +3.5 (since size is 7 and centered at 0)

### Pet Swimlane Shadows
```
[BaseBlockCreator] Created Z-axis shadow block for Cat:
   - Position: (0, 1.8000000000000003, -5)
   - Size: 26 x 1 x 4

[BaseBlockCreator] Created Z-axis shadow block for Dog:
   - Position: (0, 1.8000000000000003, 0)
   - Size: 26 x 1 x 4
```

#### Pet Lane Positions:
- **Cat lane**: Center at Z=-5, spans from -7 to -3
- **Dog lane**: Center at Z=0, spans from -2 to +2

#### Combined Pet Lanes:
- **Total span**: From -7 to +2 (9 units total)
- **Center of pet lanes**: (-7 + 2) / 2 = **-2.5**

## Root Cause

The pet lanes are positioned based on where the actual pet nodes are located in the Z axis:
- Cat nodes are positioned around Z=-5
- Dog nodes are positioned around Z=0

However, the group shadow block is centered at Z=0 (the overall center of all nodes).

**The mismatch**: The pet lanes' collective center is at Z=-2.5, while the group shadow center is at Z=0. This 2.5 unit offset causes the visual misalignment.

## Solution

### Approach: Center Pet Lanes Over Group Shadow

The pet lanes should be repositioned so their collective center aligns with the group shadow center at Z=0.

```typescript
// Current pet lane positions
const catLaneZ = -5;  // Current
const dogLaneZ = 0;   // Current

// Calculate current center of pet lanes
const petLaneMinZ = catLaneZ - 2; // -7 (Cat lane start)
const petLaneMaxZ = dogLaneZ + 2; // +2 (Dog lane end)
const currentPetCenter = (petLaneMinZ + petLaneMaxZ) / 2; // -2.5

// Calculate needed offset
const groupShadowCenterZ = 0;
const offsetZ = groupShadowCenterZ - currentPetCenter; // 0 - (-2.5) = 2.5

// New positions (shifted forward by 2.5)
const newCatLaneZ = catLaneZ + offsetZ; // -5 + 2.5 = -2.5
const newDogLaneZ = dogLaneZ + offsetZ; // 0 + 2.5 = 2.5
```

### Alternative Approach: Even Distribution

Position pet lanes to evenly divide the group shadow's Z space:

```typescript
const groupShadowZ = 0;
const groupShadowDepth = 7;
const numPetTypes = 2;
const laneDepth = 4; // Each pet lane depth

// Calculate spacing between lanes
const totalPetDepth = numPetTypes * laneDepth; // 8
const availableSpace = groupShadowDepth; // 7

// Since pet lanes (8) are wider than group shadow (7), 
// center them over the group shadow
const startZ = -(totalPetDepth / 2); // -4

// Position each pet lane
const catLaneZ = startZ + (laneDepth / 2); // -4 + 2 = -2
const dogLaneZ = startZ + laneDepth + (laneDepth / 2); // -4 + 4 + 2 = 2
```

## Recommended Implementation

1. Locate the code that creates Z-axis shadow blocks (likely in `baseBlockCreator.ts`)
2. Find where pet lane positions are calculated
3. Add centering logic:

```typescript
// After calculating pet lane positions based on node positions
const petLanePositions = calculatePetLanePositions(nodes);

// Center the collection over the group shadow
const petLanesCenter = calculateCenterOfPetLanes(petLanePositions);
const groupShadowCenter = groupShadowBlock.Position.Z;
const offset = groupShadowCenter - petLanesCenter;

// Apply offset to each pet lane
petLanePositions.forEach(lane => {
    lane.z += offset;
});
```

## Expected Result

After the fix:
- Pet lanes will be centered as a collection over the group shadow block
- The visual hierarchy will be clearer with proper alignment
- The misalignment in the Z direction will be corrected