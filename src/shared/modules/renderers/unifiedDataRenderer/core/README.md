# Data Generator Core Module

This module contains the core data generation logic split into focused, single-responsibility classes.

## File Structure

- **`dataGenerator.ts`** - Main orchestrator class that coordinates all generation tasks
- **`NodeGenerator.ts`** - Handles node creation and property assignment (145 lines)
- **`LinkGenerator.ts`** - Manages link creation and connectivity logic (265 lines) 
- **`TestDataProcessor.ts`** - Processes test data with Import link filtering (267 lines)
- **`PropertyManager.ts`** - Handles property discovery and validation (16 lines)

## Architecture

```
DataGenerator (Main)
    ├── NodeGenerator
    │   ├── generateLayerNodes()
    │   ├── createNode()
    │   └── addTypeSpecificProperties()
    │
    ├── LinkGenerator
    │   ├── generateAllLinks()
    │   ├── createLink()
    │   └── ensureConnectivity()
    │
    ├── TestDataProcessor
    │   ├── generateClusterFromTestData()
    │   ├── assignTreeLevels()
    │   └── applyPropertyFilters()
    │
    └── PropertyManager
        └── discoverAndValidateProperties()
```

## Refactoring Benefits

1. **Separation of Concerns**: Each class has a single responsibility
2. **Maintainability**: Easier to locate and modify specific functionality
3. **Testability**: Individual classes can be tested in isolation
4. **Reduced File Size**: Original 889 lines split into manageable chunks
5. **Code Organization**: Related functionality grouped together

## Usage

The main `DataGenerator` class remains the public API:

```typescript
import { DataGenerator } from "./core/dataGenerator";

const generator = new DataGenerator();
const cluster = generator.generateClusterFromLayers(config);
```

Internal classes are not meant to be used directly outside this module.