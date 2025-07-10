# T4: Implementation Plan

## T4.1: Changes Prioritized by Impact and Risk

### Priority 1: Low Risk, High Impact (Constants and Interfaces)
These changes have minimal risk of breaking functionality but high clarity impact:

1. **Update Constants** (Risk: Low, Impact: High)
   - File: `/src/shared/modules/renderers/constants/blockConstants.ts`
   - Change: `X_AXIS_Z_BUFFER` → `Z_PARALLEL_LANE_BUFFER`
   - Testing: Verify buffer still applies correctly

2. **Update Interface Definitions** (Risk: Low, Impact: High)
   - File: `/src/shared/interfaces/enhancedGenerator.interface.ts`
   - Change: `AxisMapping` → `SpatialGrouping`
   - Change: `xAxis/zAxis` → `xGroupingProperty/zGroupingProperty`
   - Testing: TypeScript compilation check

### Priority 2: Medium Risk, High Impact (Configuration and State)
These require careful migration to avoid breaking existing configs:

3. **Update State Manager** (Risk: Medium, Impact: High)
   - File: `/src/client/services/configGui/stateManager.ts`
   - Change: Property names in state and methods
   - Add: Migration logic for old property names
   - Testing: Config GUI functionality

4. **Update Config Validation** (Risk: Medium, Impact: Medium)
   - File: `/src/shared/utils/validation/configValidation.ts`
   - Change: Accept both old and new property names during transition
   - Testing: Config loading/saving

### Priority 3: High Risk, High Impact (Core Rendering Logic)
These are the most complex changes affecting core functionality:

5. **Rename Block Creation Methods** (Risk: High, Impact: High)
   - Files: `swimlaneBlockCreator.ts`, `shadowBlockCreator.ts`
   - Change: Method names and block naming patterns
   - Testing: Visual verification of rendered output

6. **Update UnifiedDataRenderer** (Risk: High, Impact: High)
   - File: `/src/shared/modules/renderers/unifiedDataRenderer/unifiedDataRenderer.ts`
   - Change: Model names, method calls
   - Testing: Full rendering pipeline

7. **Update Position Calculator** (Risk: High, Impact: Medium)
   - File: `/src/shared/modules/renderers/unifiedDataRenderer/core/positionCalculator.ts`
   - Change: Variable names, map keys
   - Testing: Node positioning accuracy

### Priority 4: Low Risk, Low Impact (Comments and Documentation)
These improve clarity without affecting functionality:

8. **Update Comments** (Risk: None, Impact: Medium)
   - All affected files
   - Change: Update comments to use new terminology
   - Testing: None required

## T4.2: Grouped Changes for Atomic Commits

### Commit 1: Constants and Type Definitions
```
feat: rename geometric constants for clarity

- Rename X_AXIS_Z_BUFFER to Z_PARALLEL_LANE_BUFFER
- Update spacing constant names
- Add clear dimension indicators
```
Files:
- `blockConstants.ts`
- `positionConstants.ts`

### Commit 2: Interface Updates with Backwards Compatibility
```
feat: update interfaces to use spatial grouping terminology

- Rename AxisMapping to SpatialGrouping
- Change xAxis/zAxis to xGroupingProperty/zGroupingProperty
- Add backwards compatibility type aliases
```
Files:
- `enhancedGenerator.interface.ts`
- `interfaces.ts`

### Commit 3: Configuration State Management
```
feat: update state management to use new property names

- Update stateManager to use spatial grouping
- Add migration for old property names
- Update config validation
```
Files:
- `stateManager.ts`
- `configValidation.ts`
- `eventHandlers.ts`

### Commit 4: Block Creation Naming
```
feat: rename block creation to geometric orientation

- Rename swimlane methods to use Z_PARALLEL/X_PARALLEL
- Update block naming patterns
- Remove property embedding from block names
```
Files:
- `swimlaneBlockCreator.ts`
- `shadowBlockCreator.ts`
- `endcapBlockCreator.ts`

### Commit 5: Core Renderer Updates
```
feat: update renderer to use geometric naming

- Update UnifiedDataRenderer model names
- Rename position calculation variables
- Update node organization methods
```
Files:
- `unifiedDataRenderer.ts`
- `positionCalculator.ts`
- `nodeOrganizer.ts`

### Commit 6: GUI Component Updates
```
feat: update GUI to display spatial grouping

- Update axis mapping controls
- Change labels from "x-axis"/"z-axis" to clearer terms
- Update tooltips and help text
```
Files:
- `axisMappingControls/`
- `spacingControls.ts`

### Commit 7: Documentation and Comments
```
docs: update all comments to use geometric terminology

- Replace axis-property naming with geometric terms
- Add clarifying comments where needed
- Update method documentation
```
All affected files

## T4.3: Test Points for Validation

### 1. Unit Tests
- [ ] Constants are correctly renamed and values unchanged
- [ ] Interfaces accept both old and new property names
- [ ] Migration logic correctly transforms old configs

### 2. Integration Tests
- [ ] Config loading works with old format
- [ ] Config saving uses new format
- [ ] GUI displays correct labels

### 3. Visual Tests
- [ ] Z-parallel lanes render in correct orientation
- [ ] X-parallel lanes render in correct orientation
- [ ] Endcaps appear at correct positions
- [ ] Labels display on correct faces

### 4. Regression Tests
- [ ] Existing saved configurations still load
- [ ] Node positioning remains unchanged
- [ ] Swimlane spacing is maintained
- [ ] Buffer application works correctly

### 5. Manual Testing Checklist
- [ ] Create new visualization from scratch
- [ ] Load existing visualization
- [ ] Change grouping properties via GUI
- [ ] Verify swimlane orientations
- [ ] Check endcap placements
- [ ] Validate label positioning

## T4.4: Rollback Strategy

### Phase 1: Preparation
1. Create feature branch: `feature/geometric-naming-refactor`
2. Tag current main: `pre-geometric-naming`
3. Document all changed files

### Phase 2: Incremental Rollout
1. Deploy constants and interfaces first (low risk)
2. Monitor for TypeScript errors
3. Deploy state management with migration
4. Test with subset of users
5. Deploy rendering changes
6. Full deployment

### Phase 3: Rollback Procedures
If issues arise:

#### Quick Rollback (< 1 hour)
```bash
git checkout pre-geometric-naming
git branch -D feature/geometric-naming-refactor
git push --force-with-lease
```

#### Selective Rollback
For specific commits causing issues:
```bash
git revert <commit-hash>
git push
```

#### Data Migration Rollback
If config format issues:
1. Keep backwards compatibility layer
2. Add reverse migration logic
3. Allow gradual transition

### Monitoring Points
1. **Build Success**: TypeScript compilation
2. **Runtime Errors**: Console logs for undefined properties
3. **Visual Bugs**: Screenshot comparison
4. **Performance**: Render time metrics

### Success Criteria
- [ ] No TypeScript compilation errors
- [ ] No runtime errors in console
- [ ] Visual output identical to previous
- [ ] Config GUI functions normally
- [ ] Old configs load successfully
- [ ] New configs use new format

## Summary

This implementation plan:
1. Prioritizes changes by risk and impact
2. Groups related changes into atomic commits
3. Provides comprehensive testing strategy
4. Includes detailed rollback procedures
5. Allows incremental deployment

The approach minimizes risk while maximizing code clarity improvements.