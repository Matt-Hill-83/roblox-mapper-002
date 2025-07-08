# Maker Usage Inventory

## Summary

| Maker | Total Usages | Files | Complexity |
|-------|--------------|-------|------------|
| makeHexagon | 5 | 5 | Medium |
| makeBar | 4 | 3 | Low |
| makeHexStack | 2 | 2 | Low |
| makeLabelBlock | 4 | 3 | Low |

## Detailed Usage

### makeHexagon Usage (5 instances)

1. **src/server/services/groupAnimationTest.service.ts**
   - Usage: Direct call in animation test
   - Pattern: `centerPosition: position` (array)
   - Complexity: Low - Test file

2. **src/shared/modules/hexStackMaker/hexStackMaker.ts**
   - Usage: Internal call within hexStackMaker
   - Pattern: `centerPosition: levelPosition` (array)
   - Complexity: Medium - Core module dependency

3. **src/shared/modules/renderers/unifiedDataRenderer/rendering/nodeRenderer.ts**
   - Usage: Core rendering logic
   - Pattern: `centerPosition: [node.position.x, node.position.y, node.position.z]`
   - Complexity: High - Critical path

4. **src/shared/modules/renderers/unifiedDataRenderer/rendering/updateManager.ts**
   - Usage: Update logic for nodes
   - Pattern: `centerPosition: [node.position.x, node.position.y, node.position.z]`
   - Complexity: High - Critical path

5. **src/shared/modules/hexagonMaker/hexagonMaker.ts**
   - Usage: Original implementation (will be removed)
   - Complexity: N/A

### makeBar Usage (4 instances)

1. **src/shared/modules/hexagonMaker/hexagonMaker.ts**
   - Usage: Internal call within makeHexagon
   - Pattern: `position: { x, y, z }` (object)
   - Complexity: Medium - Will be fixed when hexagonMaker is migrated

2. **src/shared/modules/hexagonMaker/makeHexagonStandardized.ts**
   - Usage: Already using adapter
   - Pattern: `position: { x, y, z }` (object)
   - Complexity: Low - Just needs import update

3. **src/shared/modules/barMaker/barMaker.ts**
   - Usage: Original implementation (will be removed)
   - Complexity: N/A

4. **src/shared/modules/barMaker/barMakerAdapter.ts**
   - Usage: Adapter implementation (will be removed)
   - Complexity: N/A

### makeHexStack Usage (2 instances)

1. **src/shared/modules/hexStackMaker/hexStackMaker.ts**
   - Usage: Original implementation (will be removed)
   - Complexity: N/A

2. **src/shared/modules/hexStackMaker/hexStackMakerAdapter.ts**
   - Usage: Adapter implementation (will be removed)
   - Complexity: N/A

### makeLabelBlock Usage (4 instances)

1. **src/shared/modules/labelBlockMaker/labelBlockMaker.ts**
   - Usage: Original implementation + internal recursive call
   - Complexity: N/A

2. **src/shared/modules/makeOriginBlock.ts**
   - Usage: Creates orientation block
   - Pattern: `position: { x, y, z }` (object)
   - Complexity: Low - Simple migration

3. **src/shared/modules/labelBlockMaker/labelBlockMakerAdapter.ts**
   - Usage: Adapter implementation (will be removed)
   - Complexity: N/A

## Migration Priority

### Phase 1 - Low Risk
1. **groupAnimationTest.service.ts** - Test file, low impact
2. **makeOriginBlock.ts** - Simple usage, isolated

### Phase 2 - Medium Risk
1. **hexStackMaker.ts** - Needs update to use makeHexagonStandardized
2. **makeHexagonStandardized.ts** - Already standardized, just needs makeBarStandardized

### Phase 3 - High Risk (Critical Path)
1. **nodeRenderer.ts** - Core rendering logic
2. **updateManager.ts** - Dynamic update logic

## Dependencies

- **hexagonMaker** depends on **barMaker**
- **hexStackMaker** depends on **hexagonMaker**
- Renderers depend on **hexagonMaker**
- **makeOriginBlock** depends on **labelBlockMaker**

## Notes

- No usage of makeHexStack found outside its own module
- makeBar is only used internally by hexagon makers
- Most usage is concentrated in renderer modules
- Migration should start with leaf dependencies (makeBar, makeLabelBlock)