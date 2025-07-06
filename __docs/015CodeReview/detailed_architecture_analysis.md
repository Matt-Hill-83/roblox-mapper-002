# Detailed Architecture Analysis

## Module Coupling and Cohesion

| Module | Files | Cohesion | Coupling | Internal Imports | External Imports |
|--------|-------|----------|----------|------------------|------------------|
| shared/data | 39 | 100.0% | 0 | 38 | 0 |
| client/services/configGui/components | 9 | 8.3% | 2 | 1 | 11 |
| shared/modules | 7 | 25.0% | 6 | 1 | 3 |
| client/services/configGui | 5 | 25.0% | 4 | 3 | 9 |
| server/services | 5 | 0.0% | 7 | 0 | 9 |
| shared/modules/barMaker | 5 | 71.4% | 3 | 5 | 2 |
| shared/modules/hexagonMaker | 5 | 66.7% | 5 | 4 | 2 |
| shared/modules/hexStackMaker | 5 | 66.7% | 2 | 4 | 2 |
| shared/modules/labelBlockMaker | 5 | 71.4% | 3 | 5 | 2 |
| shared/modules/ropeLabelMaker | 5 | 80.0% | 2 | 4 | 1 |
| shared/modules/renderers/dataGeneratorRobloxRendererUtils | 4 | 33.3% | 4 | 3 | 6 |
| client/controllers | 3 | 0.0% | 3 | 0 | 2 |
| shared/modules/renderers | 3 | 0.0% | 5 | 0 | 14 |
| server/services/main | 2 | 16.7% | 3 | 1 | 5 |
| shared/interfaces | 2 | 0.0% | 9 | 0 | 0 |
| client | 1 | 0.0% | 2 | 0 | 4 |
| client/services | 1 | 0.0% | 1 | 0 | 0 |
| server | 1 | 0.0% | 1 | 0 | 1 |
| shared/configs | 1 | 0.0% | 2 | 0 | 1 |
| shared/modules/layout | 1 | 0.0% | 2 | 0 | 1 |

## Circular Dependencies

No circular dependencies detected.

## Export Usage Analysis

### Most Unused Exports
- **shared/data/index.ts**: 40 unused exports (allEntityData, allRelationData, entityArtifactData, entityClassData, entityComponentData...)
- **shared/modules/layoutConstants.ts**: 9 unused exports (TREE_SPACING, LEVEL_HEIGHT, CLUSTER_RADIUS, ENTITY_SPACING, CLUSTER_VARIATION...)
- **shared/modules/componentData.ts**: 2 unused exports (ComponentData, entityComponentData)
- **shared/modules/enhancedDataGenerator.ts**: 2 unused exports (generateEnhancedData, convertEnhancedConfig)
- **shared/modules/labelBlockMaker/labelBlockMaker.ts**: 2 unused exports (makeLabelBlock, makeLabelBlockAllFaces)
- **client/services/configGui/components/dropdown.ts**: 1 unused exports (createDropdown)
- **client/services/configGui/makeConfigGui.ts**: 1 unused exports (ConfigGUIService)
- **server/services/testSimpleDataGenerator.service.ts**: 1 unused exports (TestSimpleDataGeneratorService)
- **shared/modules/barMaker/barMaker.ts**: 1 unused exports (makeBar)
- **shared/modules/hexStackMaker/hexStackMaker.ts**: 1 unused exports (makeHexStack)

### Most Used Modules
- **shared/interfaces/simpleDataGenerator.interface.ts**: Used by 12 files, 5 exports
- **client/services/configGui/constants.ts**: Used by 11 files, 1 exports
- **shared/interfaces/enhancedGenerator.interface.ts**: Used by 7 files, 4 exports
- **shared/modules/renderers/dataGeneratorRobloxRendererUtils/constants.ts**: Used by 5 files, 1 exports
- **shared/utils/stringUtils.ts**: Used by 5 files, 1 exports
- **shared/modules/hexagonMaker/index.ts**: Used by 4 files, 1 exports
- **shared/modules/barMaker/constants.ts**: Used by 3 files, 1 exports
- **shared/modules/TextBoxMaker.ts**: Used by 3 files, 2 exports
- **client/services/configGui/interfaces.ts**: Used by 2 files, 5 exports
- **shared/modules/hexagonMaker/constants.ts**: Used by 2 files, 1 exports

## Architecture Patterns

### Service Layer
- **client/services/keyboardShortcuts.service.ts**: 2 imports, 1 exports, used by 1 files
- **server/services/colorsTest.service.ts**: 0 imports, 1 exports, used by 1 files
- **server/services/configGUIServer.service.ts**: 3 imports, 1 exports, used by 1 files
- **server/services/graphInitializer.service.ts**: 1 imports, 2 exports, used by 1 files
- **server/services/groupAnimationTest.service.ts**: 2 imports, 1 exports, used by 1 files
- **server/services/main/game.service.ts**: 4 imports, 1 exports, used by 1 files
- **server/services/testSimpleDataGenerator.service.ts**: 5 imports, 1 exports, used by 0 files
- **shared/services/dataGenerator/simpleDataGenerator.service.ts**: 1 imports, 1 exports, used by 2 files

### Component Makers Pattern
The codebase uses a consistent "maker" pattern for creating visual components:
- **barMaker**: shared/modules/barMaker/barMaker.ts
- **hexagonMaker**: shared/modules/hexagonMaker/hexagonMaker.ts
- **hexStackMaker**: shared/modules/hexStackMaker/hexStackMaker.ts
- **labelBlockMaker**: shared/modules/labelBlockMaker/labelBlockMaker.ts
- **modules**: shared/modules/labelGroupMaker.ts
- **ropeLabelMaker**: shared/modules/ropeLabelMaker/ropeLabelMaker.ts
- **modules**: shared/modules/TextBoxMaker.ts

### Data Layer
The data layer consists of 40 files with generated entity and relationship data:
- Average size: 547 lines
- Total lines: 21862

## Architectural Concerns

### High Coupling Modules
- **shared/modules**: Coupling score 6 (imports from 2 modules, exports to 4 modules)
- **server/services**: Coupling score 7 (imports from 6 modules, exports to 1 modules)
- **shared/interfaces**: Coupling score 9 (imports from 0 modules, exports to 9 modules)

### Low Cohesion Modules
- **client/services/configGui/components**: Cohesion 8.3% (1 internal vs 11 external imports)
- **shared/modules**: Cohesion 25.0% (1 internal vs 3 external imports)
- **client/services/configGui**: Cohesion 25.0% (3 internal vs 9 external imports)
- **server/services**: Cohesion 0.0% (0 internal vs 9 external imports)
- **client/controllers**: Cohesion 0.0% (0 internal vs 2 external imports)

## Dependency Flow

### Client → Shared Dependencies
- configGUI.controller.ts → ../../shared/interfaces/enhancedGenerator.interface
- interfaces.ts → ../../../shared/interfaces/enhancedGenerator.interface
- utilities.ts → ../../../shared/interfaces/simpleDataGenerator.interface

### Server → Shared Dependencies
- configGUIServer.service.ts → ../../shared/interfaces/enhancedGenerator.interface
- configGUIServer.service.ts → ../../shared/modules/renderers/unifiedDataRenderer
- graphInitializer.service.ts → ../../shared/interfaces/enhancedGenerator.interface
- groupAnimationTest.service.ts → ../../shared/modules/hexagonMaker/hexagonMaker
- game.service.ts → ../../../shared/modules/makeOriginBlock
- testSimpleDataGenerator.service.ts → ../../shared/services/dataGenerator/simpleDataGenerator.service
- testSimpleDataGenerator.service.ts → ../../shared/modules/layout/simpleDataLayout
- testSimpleDataGenerator.service.ts → ../../shared/modules/renderers/simpleDataRenderer
- testSimpleDataGenerator.service.ts → ../../shared/interfaces/simpleDataGenerator.interface
- testSimpleDataGenerator.service.ts → ../../shared/configs/simpleDataGeneratorConfigs

## Key Architectural Findings

1. **Shared Module Dominance**: 75.9% of files are in the shared category, indicating heavy code reuse
2. **Data File Bloat**: Data files average 547 lines, suggesting need for external data storage
3. **Component Maker Pattern**: Well-structured component creation pattern with consistent interfaces
4. **Service Layer**: Limited to 8 services, may need expansion for better separation of concerns
5. **Import/Export Ratio**: 1.43 exports per import, indicating good modularity
