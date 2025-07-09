# Standardized Patterns Documentation

## Overview

This document defines the standardized patterns for the Roblox Mapper codebase, focusing on consistent interfaces, naming conventions, and architectural patterns.

## Core Interfaces

### 1. IService
Base interface for all service classes that manage application state and orchestrate operations.

```typescript
interface IService {
  readonly name: string;
  readonly version: string;
  initialize(): void;
  destroy?(): void;
  onUpdate?(deltaTime: number): void;
}
```

### 2. IMaker
Base interfaces for all maker functions that create Roblox instances.

```typescript
interface IMakerConfig {
  id?: string | number;
  parent?: Instance;
  position?: Vector3;
  name?: string;
}

interface IMakerFunction<TConfig extends IMakerConfig, TResult extends Instance> {
  (config: TConfig): TResult;
}
```

### 3. IRenderer
Base interface for all renderer classes that handle visualization.

```typescript
interface IRenderer<TData = unknown> {
  render(data: TData): void;
  clear?(): void;
  update?(deltaTime: number): void;
}
```

## Naming Conventions

### Functions
- **Makers**: `make*` prefix (e.g., `makeHexagon`, `makeBar`)
- **Utilities**: Descriptive verb + noun (e.g., `calculatePosition`, `generateName`)
- **Validators**: `validate*` or `is*` prefix (e.g., `validateConfig`, `isValidPosition`)

### Interfaces
- **Config interfaces**: `I*Config` (e.g., `IHexagonMakerConfig`)
- **Service interfaces**: `I*Service` (e.g., `IGameService`)
- **Data interfaces**: Descriptive name without prefix (e.g., `NodeData`, `EdgeData`)

### Files
- **Interfaces**: `*.interfaces.ts` or `interfaces.ts`
- **Constants**: `*.constants.ts` or `constants.ts`
- **Utilities**: `*.utilities.ts` or `utilities.ts`
- **Main logic**: Descriptive name matching the export

## Maker Pattern

### Structure
```typescript
// 1. Interface definition
export interface IMakerConfig extends IVisualMakerConfig {
  // Specific configuration properties
}

// 2. Main function
export function makeStandardized(config: IMakerConfig): Instance {
  // Extract config with defaults
  const { /* destructured props */ } = config;
  
  // Create instance
  const instance = new Instance("Type");
  
  // Apply properties
  // ...
  
  // Set parent if provided
  if (parent) {
    instance.Parent = parent;
  }
  
  return instance;
}

// 3. Legacy adapter (if needed)
export function makeLegacy(config: LegacyConfig): Instance {
  const standardConfig = convertLegacyConfig(config);
  return makeStandardized(standardConfig);
}
```

### Configuration Properties

#### Position and Orientation
- Use `Vector3` for all 3D positions and rotations
- Never use arrays `[x, y, z]` or objects `{ x, y, z }`

#### Colors
- Use `Color3` for all color values
- Never use arrays `[r, g, b]`

#### Materials and Enums
- Use Roblox enum types directly
- Never use string representations

#### Sizes
- Use `Vector3` for 3D sizes
- Use `number` for uniform sizes (cubes, spheres)

## Service Pattern

### Structure
```typescript
export class ExampleService implements IService {
  public readonly name = "ExampleService";
  public readonly version = "1.0.0";
  
  private initialized = false;
  
  public initialize(): void {
    if (this.initialized) {
      warn(`${this.name} already initialized`);
      return;
    }
    
    // Initialization logic
    this.initialized = true;
    print(`${this.name} v${this.version} initialized`);
  }
  
  public destroy(): void {
    // Cleanup logic
    this.initialized = false;
  }
}
```

### Best Practices
1. Always check if already initialized
2. Provide meaningful logging
3. Clean up resources in destroy()
4. Use readonly for immutable properties

## Renderer Pattern

### Structure
```typescript
export class ExampleRenderer implements IRenderer<ExampleData> {
  private cache = new Map<string, Instance>();
  
  public render(data: ExampleData): void {
    // Rendering logic
  }
  
  public clear(): void {
    // Clear all rendered instances
    this.cache.forEach(instance => instance.Destroy());
    this.cache.clear();
  }
  
  public update(deltaTime: number): void {
    // Update animations or dynamic elements
  }
}
```

### Best Practices
1. Cache created instances for efficient updates
2. Provide clear() method for cleanup
3. Separate creation from updates
4. Use type-safe data structures

## Module Organization

### Folder Structure
```
moduleName/
├── index.ts              # Public exports
├── interfaces.ts         # Type definitions
├── constants.ts          # Constants and configuration
├── utilities.ts          # Helper functions
├── moduleName.ts         # Main implementation
├── standardizedInterfaces.ts  # IMaker-based interfaces
├── moduleNameStandardized.ts  # Standardized implementation
└── moduleNameAdapter.ts  # Legacy compatibility
```

### Export Pattern
```typescript
// index.ts
// Legacy exports (deprecated)
export { makeLegacy } from "./adapter";
export type { LegacyConfig } from "./interfaces";

// Standardized exports
export { makeStandardized } from "./standardized";
export type { IStandardizedConfig } from "./standardizedInterfaces";
```

## Constants Organization

### Pattern
```typescript
export const MODULE_CONSTANTS = {
  DIMENSIONS: {
    DEFAULT_WIDTH: 10,
    DEFAULT_HEIGHT: 5,
    MIN_SIZE: 1,
    MAX_SIZE: 100
  },
  COLORS: {
    DEFAULT: new Color3(0.5, 0.5, 0.5),
    HIGHLIGHT: new Color3(1, 1, 0),
    ERROR: new Color3(1, 0, 0)
  },
  ANIMATION: {
    DURATION: 0.3,
    EASING: Enum.EasingStyle.Quad
  }
};
```

### Best Practices
1. Group related constants
2. Use UPPER_SNAKE_CASE for constant names
3. Provide descriptive names
4. Use appropriate types (Color3, Vector3, etc.)

## Error Handling

### Pattern
```typescript
// Validation
if (!isValidConfig(config)) {
  warn(`[${MODULE_NAME}] Invalid configuration:`, config);
  return; // or throw error
}

// Resource checks
if (!parent) {
  error(`[${MODULE_NAME}] Parent instance required`);
  return;
}

// Graceful degradation
const value = config.value ?? DEFAULT_VALUE;
```

### Best Practices
1. Prefix error messages with module name
2. Provide context in error messages
3. Use appropriate log levels (print, warn, error)
4. Fail gracefully when possible

## Testing Patterns

### Unit Tests
```typescript
describe("ModuleName", () => {
  it("should create instance with default config", () => {
    const result = makeExample({});
    expect(result).toBeDefined();
    expect(result.IsA("Part")).toBe(true);
  });
  
  it("should apply custom properties", () => {
    const result = makeExample({
      position: new Vector3(10, 20, 30),
      color: new Color3(1, 0, 0)
    });
    expect(result.Position).toEqual(new Vector3(10, 20, 30));
    expect(result.Color).toEqual(new Color3(1, 0, 0));
  });
});
```

## Migration Strategy

### Phase 1: Create Standardized Version
1. Create new interfaces extending IMaker interfaces
2. Implement standardized function
3. Test thoroughly

### Phase 2: Add Compatibility Layer
1. Create adapter function
2. Mark legacy function as deprecated
3. Update exports

### Phase 3: Migrate Usage
1. Update calling code to use standardized version
2. Test all affected features
3. Monitor for issues

### Phase 4: Remove Legacy Code
1. Remove deprecated functions
2. Remove adapter layer
3. Clean up exports

## Benefits of Standardization

1. **Type Safety**: Catch errors at compile time
2. **Consistency**: Same patterns everywhere
3. **Maintainability**: Easier to understand and modify
4. **Performance**: No runtime conversions
5. **Developer Experience**: Better autocomplete and documentation