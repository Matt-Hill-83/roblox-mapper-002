# F004 - Code Quality Audit Report

Generated: 2025-07-10T03:53:56.543Z

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Files | 122 |
| Total Lines of Code | 14,122 |
| Total Issues Found | 1572 |
| Average Complexity | 8.9 |
| Quality Score | 3.6/10 |

### Issue Breakdown
- **High Priority**: 22 issues
- **Medium Priority**: 1548 issues
- **Low Priority**: 2 issues

## File Inventory

| File | Lines | Size (KB) | Issues | Complexity |
|------|-------|-----------|--------|------------|
| src/shared/modules/renderers/unifiedDataRenderer/rendering/updateManager.ts | 397 | 13.5 | 95 | High |
| src/shared/modules/renderers/unifiedDataRenderer/core/positionCalculator.ts | 346 | 11.9 | 85 | High |
| src/shared/modules/renderers/unifiedDataRenderer/core/dataGenerator.ts | 368 | 12.9 | 77 | High |
| src/shared/modules/renderers/unifiedDataRenderer/unifiedDataRenderer.ts | 491 | 19.9 | 71 | High |
| src/server/services/configGUIServer.service.ts | 128 | 4.8 | 64 | Medium |
| src/client/services/configGui/components/layerGrid.ts | 365 | 11.9 | 61 | High |
| src/client/controllers/configGUI.controller.ts | 154 | 5.3 | 61 | High |
| src/client/services/nodePropertiesInspector/nodePropertiesInspector.service.ts | 301 | 9.9 | 42 | High |
| src/shared/modules/labelBlockMaker/utilities.ts | 59 | 1.9 | 39 | Medium |
| src/client/services/configGui/makeConfigGui.ts | 328 | 11.5 | 34 | Medium |
| src/server/services/groupAnimationTest.service.ts | 222 | 5.9 | 31 | Medium |
| src/shared/modules/makeOriginBlock.ts | 91 | 2.9 | 30 | Low |
| src/shared/modules/renderers/dataGeneratorRobloxRendererUtils/ropeCreator.ts | 227 | 6.4 | 30 | High |
| src/client/services/configGui/stateManager.ts | 327 | 9.0 | 29 | High |
| src/client/services/configGui/components/axisMappingControls/components/yAxisConfigSection.ts | 123 | 3.6 | 26 | Low |
| src/shared/modules/renderers/unifiedDataRenderer/rendering/nodeRenderer.ts | 200 | 6.9 | 25 | High |
| src/shared/modules/renderers/unifiedDataRenderer/core/nodeOrganizer.ts | 135 | 3.8 | 23 | Low |
| src/shared/utils/validation/configValidation.ts | 277 | 7.9 | 21 | High |
| src/shared/modules/renderers/unifiedDataRenderer/rendering/labelRenderer.ts | 185 | 6.6 | 20 | Medium |
| src/shared/modules/renderers/blocks/swimlaneBlockCreator.ts | 206 | 6.9 | 20 | Low |
| ... and 102 more files | | | | |

## High Priority Issues

### Type Annotation Issues (16)

- **src/shared/modules/labelGroupMaker.ts:13** - Avoid using 'any' type
- **src/shared/modules/ropeLabelMaker/interfaces.ts:26** - Avoid using 'any' type
- **src/shared/modules/labelBlockMaker/standardizedInterfaces.ts:75** - Avoid using 'any' type
- **src/shared/modules/labelBlockMaker/interfaces.ts:31** - Avoid using 'any' type
- **src/shared/modules/hexagonMaker/utilities.ts:58** - Function 'calculateBarDimensions' is missing return type annotation

### Complexity Issues (1054)

- **src/shared/utils/validation/stringValidation.ts:113** - Deep nesting detected (level 4)
- **src/shared/utils/validation/stringValidation.ts:114** - Deep nesting detected (level 5)
- **src/shared/utils/validation/stringValidation.ts:115** - Deep nesting detected (level 5)
- **src/shared/utils/validation/stringValidation.ts:116** - Deep nesting detected (level 5)
- **src/shared/utils/validation/stringValidation.ts:117** - Deep nesting detected (level 4)

### Duplicate Code (460)

- Files: src/shared/utils/nodePropertyHelpers.ts, src/shared/utils/nodePropertyHelpers.ts (lines 30, 31)
- Files: src/shared/utils/nodePropertyHelpers.ts, src/shared/utils/nodePropertyHelpers.ts (lines 35, 36)
- Files: src/shared/utils/validation/stringValidation.ts, src/shared/utils/validation/stringValidation.ts (lines 71, 72)
- Files: src/shared/utils/validation/stringValidation.ts, src/shared/utils/validation/stringValidation.ts (lines 84, 85)
- Files: src/shared/utils/validation/configValidation.ts, src/shared/utils/validation/configValidation.ts (lines 137, 138)

## Recommendations

### High Priority

1. **Add Type Annotations**: 7 functions are missing return type annotations
2. **Reduce Complexity**: 12 files have high complexity and should be refactored
3. **Remove 'any' Types**: Found 7 uses of 'any' type

### Medium Priority

1. **Extract Duplicate Code**: 460 duplicate code blocks found
2. **Improve Naming Conventions**: 42 naming convention violations
3. **Reduce Function Length**: 15 functions exceed 50 lines

### Low Priority

1. **Code Organization**: Consider grouping related functionality
2. **Documentation**: Add JSDoc comments to public APIs
3. **Consistent Formatting**: Apply consistent code formatting

## Module Dependencies

```mermaid
graph TD
```
