
sample format:

## T163: Add Z Offset Input for Random Z Function

**Description**: Add numeric input field to control the Z offset amount when Random Z is enabled

1. 🔲 [CLD11] T163.1: Add Z offset input field
   1. 🔲 [CLD11] T163.1.1: Add "Z Offset" numeric input to visualization controls
   2. 🔲 [CLD11] T163.1.2: Position near Random Z checkbox
   3. 🔲 [CLD11] T163.1.3: Set default value to 20
   4. 🔲 [CLD11] T163.1.4: Add validation (min: 0, max: 100)

+++++++++++++++++
+++++++++++++++++
+++++++++++++++++

## T164: Fix Person Type Buffer Dimension

**Description**: Fix person type buffer being applied to wrong dimension - should apply to Z dimension (depth) not X dimension (width)

1. ✅ [CLD12] T164.1: Fix buffer dimension in UnifiedDataRenderer
   1. ✅ [CLD12] T164.1.1: Locate createSwimLaneBlocks method in unifiedDataRenderer.ts
   2. ✅ [CLD12] T164.1.2: Change buffer application from width to depth calculation
   3. ✅ [CLD12] T164.1.3: Verify person types: man, woman, child, grandparent