# F002 Code Integration Plan

## Overview
This document outlines the specific tasks needed to integrate the refactored code from Phase 1 & 2 into the current F002 feature implementation.

## Current State Analysis

### Refactored Code (Currently Unused)
1. **Property Resolution**
   - `PropertyValueResolver` - Centralized property extraction
   - `nodePropertyHelpers` - Type-safe property access utilities
   
2. **Position Calculation**
   - `positionCalculatorRefactored` - Modularized version
   - `BoundsCalculator` - Separated bounds calculation logic
   - `NodeOrganizer` - Node grouping and organization
   - `PositionMapper` - Position assignment logic

3. **Block Creation**
   - `BaseBlockCreator` - Shared block creation logic
   - `PlatformBlockCreator` - Platform-specific creation
   - `ShadowBlockCreator` - Shadow block creation
   - `SwimLaneBlockCreator` - Swimlane block creation
   - `BlockDimensionCalculator` - Dimension calculations

4. **Constants**
   - `blockConstants` - Centralized block-related constants
   - `positionConstants` - Centralized position-related constants

### Current Implementation (Active)
1. **Property Access**
   - `getNodePropertyValue()` methods duplicated in multiple files
   - Direct property access without type guards
   
2. **Position Calculation**
   - Original `PositionCalculator` class
   - All logic in single file
   
3. **Block Creation**
   - `flatBlockCreator` - Original implementation
   - `verticalWallCreator` - Wall creation logic
   
## Integration Tasks

### Phase 1: Property Resolution Integration
**Priority: High - Eliminates code duplication**

#### T1.1: Update UnifiedDataRenderer to use PropertyValueResolver
- [ ] Import PropertyValueResolver
- [ ] Replace all `getNodePropertyValue()` calls with `propertyResolver.getPropertyValue()`
- [ ] Remove duplicate `getNodePropertyValue()` method
- [ ] Test all axis mapping functionality

#### T1.2: Update PositionCalculator to use PropertyValueResolver
- [ ] Import PropertyValueResolver
- [ ] Replace property extraction logic
- [ ] Remove duplicate `getNodePropertyValue()` method
- [ ] Verify swimlane positioning works correctly

#### T1.3: Update LabelRenderer to use PropertyValueResolver
- [ ] Import PropertyValueResolver if it has property access
- [ ] Replace any direct property access
- [ ] Test label generation

### Phase 2: Constants Integration
**Priority: High - Eliminates magic numbers**

#### T2.1: Replace magic numbers in PositionCalculator
- [ ] Import POSITION_CONSTANTS
- [ ] Replace BASE_Y, LEVEL_SPACING, COLUMN_SPACING
- [ ] Replace hardcoded spacing values
- [ ] Test positioning remains unchanged

#### T2.2: Replace magic numbers in block creators
- [ ] Import BLOCK_CONSTANTS
- [ ] Replace hardcoded heights, transparencies, materials
- [ ] Test block appearance remains unchanged

#### T2.3: Update DataGenerator constants
- [ ] Use centralized NODE_TYPE_NAMES if applicable
- [ ] Ensure consistency across codebase

### Phase 3: Block Creation Integration
**Priority: Medium - Improves maintainability**

#### T3.1: Integrate BaseBlockCreator
- [ ] Update flatBlockCreator to extend/use BaseBlockCreator
- [ ] Maintain existing API to avoid breaking changes
- [ ] Test all block creation scenarios

#### T3.2: Integrate specialized block creators
- [ ] Wire up PlatformBlockCreator for platform creation
- [ ] Wire up ShadowBlockCreator for shadow blocks
- [ ] Wire up SwimLaneBlockCreator for swimlanes
- [ ] Ensure backward compatibility

#### T3.3: Integrate BlockDimensionCalculator
- [ ] Replace inline dimension calculations
- [ ] Use centralized calculation logic
- [ ] Verify dimensions remain correct

### Phase 4: Position Calculator Integration
**Priority: Low - Major refactoring, higher risk**

#### T4.1: Create adapter for refactored PositionCalculator
- [ ] Create PositionCalculatorAdapter that uses new modular components
- [ ] Maintain existing public API
- [ ] Gradually migrate internal logic

#### T4.2: Integrate BoundsCalculator
- [ ] Replace bounds calculation in current PositionCalculator
- [ ] Use BoundsCalculator for cluster bounds
- [ ] Test bounds calculation accuracy

#### T4.3: Integrate NodeOrganizer
- [ ] Replace node organization logic
- [ ] Use NodeOrganizer for grouping by properties
- [ ] Verify grouping logic unchanged

#### T4.4: Integrate PositionMapper
- [ ] Replace position assignment logic
- [ ] Use PositionMapper for final positioning
- [ ] Test all positioning scenarios

### Phase 5: Feature-Specific Integration
**Priority: High - Ensures new features use refactored code**

#### T5.1: Update Y-axis property positioning
- [ ] Use PropertyValueResolver for Y-axis properties
- [ ] Use POSITION_CONSTANTS for Y spacing
- [ ] Test vertical walls and swimlanes

#### T5.2: Update visual customization
- [ ] Use PropertyValueResolver for color mapping properties
- [ ] Integrate with color mapping utilities
- [ ] Test property-based coloring

#### T5.3: Update node properties inspector
- [ ] Use PropertyValueResolver for property display
- [ ] Use nodePropertyHelpers for type checking
- [ ] Test property inspection

#### T5.4: Update connectivity validation
- [ ] Use refactored node type checking
- [ ] Ensure type-safe connection creation
- [ ] Test connectivity scenarios
