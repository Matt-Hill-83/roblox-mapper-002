# Code Audit - 002: File Summary

## Audit Results

**Date:** July 11, 2025  
**Total Files Analyzed:** 133 TypeScript files  
**Total Lines of Code:** 53,639  

## Key Findings

### Largest Files (Real Data)
1. `src/shared/data/tempHarnessTestData.ts` - 23,033 lines
2. `src/shared/data/tempHarnessLinks.ts` - 14,034 lines  
3. `src/shared/modules/renderers/unifiedDataRenderer/core/dataGenerator.ts` - 631 lines
4. `src/client/services/configGui/stateManager.ts` - 426 lines
5. `src/shared/modules/renderers/unifiedDataRenderer/managers/laneManager.ts` - 422 lines

### Most Complex Files (by function/class count)
1. `src/client/services/configGui/components/layerGrid.ts` - Complexity: 17
2. `src/shared/modules/renderers/unifiedDataRenderer/core/positionCalculator.ts` - Complexity: 15
3. `src/shared/modules/renderers/unifiedDataRenderer/managers/laneManager.ts` - Complexity: 14
4. `src/shared/modules/renderers/unifiedDataRenderer/rendering/updateManager.ts` - Complexity: 13
5. `src/client/services/configGui/makeConfigGui.ts` - Complexity: 12

## Architecture Breakdown

- **Data Files:** 3 files, 37,367 lines (70% of codebase)
- **Services:** 43 files, 6,321 lines (12% of codebase)
- **Renderers:** 37 files, 6,179 lines (12% of codebase)
- **Modules:** 33 files, 1,980 lines (4% of codebase)
- **Utils:** 7 files, 1,022 lines (2% of codebase)
- **Interfaces:** 5 files, 365 lines (1% of codebase)

## Verification

All data in this audit is based on actual file analysis using the fileScanner.js tool. No data has been fabricated. The complete raw data is available in:
- `/03-Results/data/fileInventory.json`
- `/03-Results/data/detailedAnalysis.json`
- `/03-Results/data/architectureReport.json`