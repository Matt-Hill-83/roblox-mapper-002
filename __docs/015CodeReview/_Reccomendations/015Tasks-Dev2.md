# Dev2 Task List - Code Review Implementation

## Overview

This task list is derived from the code review recommendations assigned to Dev2. Focus areas: input validation, type safety improvements, and code cleanup.

## Tasks

### Type Safety Improvements (Medium Priority)

1. ⬛ T6: Create generic base classes

   1. ⬛ Design generic service base class
   2. ⬛ Design generic maker base class
   3. ⬛ Implement type parameters
   4. ⬛ Update existing classes to extend bases

2. ⬛ T7: Add type parameters to collections

   1. ⬛ Audit all Map and Set usage
   2. ⬛ Add proper type parameters

3. ⬛ T8: Improve type inference

   1. ⬛ Remove unnecessary type annotations
   2. ⬛ Let TypeScript infer where possible
   3. ⬛ Document inference patterns

### Code Cleanup (Low Priority)

3. ✅ T12: Document entry point orphans

   1. ✅ Add comments to main.client.ts explaining why orphaned
   2. ✅ Add comments to main.server.ts explaining why orphaned
   3. ✅ Create README in controllers folder
   4. ✅ Document architectural decisions

4. ✅ T13: Create \_orphaned folder structure
   1. ✅ Create client/controllers/\_orphaned folder
   2. ✅ Move truly orphaned files
   3. ✅ Add .gitignore if needed (not required)
   4. ✅ Document folder purpose

### T2: Refactor UnifiedDataRenderer (Medium Priority) ✅

1. ✅ T4: Create module structure

   1. ✅ Create unifiedDataRenderer folder
   2. ✅ Set up index.ts, interfaces.ts, constants.ts
   3. ✅ Create core/ and rendering/ subdirectories

2. ✅ T5: Extract DataGenerator class

   1. ✅ Move data generation logic to core/dataGenerator.ts
   2. ✅ Define DataGenerator interface
   3. ✅ Update imports and dependencies

3. ✅ T6: Extract PositionCalculator class

   1. ✅ Move position calculation logic to core/positionCalculator.ts
   2. ✅ Define PositionCalculator interface
   3. ✅ Handle swimlane calculations

4. ✅ T7: Extract NodeRenderer class

   1. ✅ Move node rendering logic to rendering/nodeRenderer.ts
   2. ✅ Define NodeRenderer interface
   3. ✅ Handle hexagon creation

5. ✅ T8: Extract UpdateManager class

   1. ✅ Move update logic to rendering/updateManager.ts
   2. ✅ Define UpdateManager interface
   3. ✅ Handle incremental updates

6. ✅ T9: Integrate refactored modules

   1. ✅ Update UnifiedDataRenderer to use new modules
   2. ✅ Test all functionality
   3. ✅ Ensure no regressions

### T4: Implement Rendering Optimizations (Medium Priority) ✅

7. ✅ T14: Disable shadows on graph parts

   1. ✅ Find all part creation locations
   2. ✅ Add part.CastShadow = false to each
   3. ✅ Test visual appearance

8. ✅ T15: Optimize materials

   1. ✅ Replace all materials with SmoothPlastic
   2. ✅ Remove unnecessary material properties
   3. ✅ Document material choices

9. ✅ T16: Optimize transparency

   1. ✅ Set Transparency = 0 where possible
   2. ✅ Remove unnecessary transparency effects
   3. ✅ Test visual impact
