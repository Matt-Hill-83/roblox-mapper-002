
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


## T165: Make Buffer Application Data-Type Agnostic

**Description**: Modify buffer logic to be agnostic to data type - apply buffer based on axis mapping, not specific type names

1. ✅ [CLD12] T165.1: Remove person-type-specific buffer logic
   1. ✅ [CLD12] T165.1.1: Remove PERSON_TYPES array from blockConstants.ts
   2. ✅ [CLD12] T165.1.2: Remove isPersonType checks from UnifiedDataRenderer
   3. ✅ [CLD12] T165.1.3: Remove isPersonType checks from SwimLaneBlockCreator
   4. ✅ [CLD12] T165.1.4: Apply buffer uniformly to all X-axis swimlanes (for Z dimension)
