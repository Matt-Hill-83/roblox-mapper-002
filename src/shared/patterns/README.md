# Standardized Patterns Documentation

This document describes the standardized patterns used throughout the codebase for consistency and maintainability.

## Maker Pattern

Makers are functions that create Roblox instances. They should follow these conventions:

### Standard Maker Function

```typescript
import { IMakerFunction, IVisualMakerConfig } from "../interfaces/IMaker";

export interface MyObjectConfig extends IVisualMakerConfig {
  // Additional config properties
  customProp?: string;
}

const MY_OBJECT_DEFAULTS = {
  size: new Vector3(1, 1, 1),
  color: new Color3(1, 1, 1),
  castShadow: false,
  // ... other defaults
} as const;

export const makeMyObject: IMakerFunction<MyObjectConfig, Part> = (config) => {
  // Apply defaults
  const {
    position = Vector3.zero,
    size = MY_OBJECT_DEFAULTS.size,
    color = MY_OBJECT_DEFAULTS.color,
    castShadow = MY_OBJECT_DEFAULTS.castShadow,
    parent,
    name = "MyObject"
  } = config;
  
  // Create instance
  const part = new Instance("Part");
  part.Name = name as string;
  part.Position = position;
  part.Size = size;
  part.Color = color;
  part.CastShadow = castShadow;
  
  if (parent) {
    part.Parent = parent;
  }
  
  return part;
};

// Optional: Validation function
export function validateMyObjectConfig(config: unknown): config is MyObjectConfig {
  // Implementation
}

// Optional: Get defaults function
export function getMyObjectDefaults(): Partial<MyObjectConfig> {
  return { ...MY_OBJECT_DEFAULTS };
}
```

### Complex Maker Class

For more complex makers that need state or multiple methods:

```typescript
import { IMakerClass, IVisualMakerConfig } from "../interfaces/IMaker";

export class ComplexObjectMaker implements IMakerClass<ComplexObjectConfig, Model> {
  private defaults: Partial<ComplexObjectConfig>;
  
  constructor(defaults?: Partial<ComplexObjectConfig>) {
    this.defaults = defaults || COMPLEX_OBJECT_DEFAULTS;
  }
  
  make(config: ComplexObjectConfig): Model {
    const mergedConfig = { ...this.defaults, ...config };
    // Complex creation logic
    return model;
  }
  
  validate(config: ComplexObjectConfig): boolean {
    // Validation logic
    return true;
  }
  
  getDefaults(): Partial<ComplexObjectConfig> {
    return { ...this.defaults };
  }
}
```

## Service Pattern

Services should extend BaseService for automatic connection and instance management:

```typescript
import { BaseService } from "../services/base/BaseService";

export class MyService extends BaseService {
  private myConnection?: RBXScriptConnection;
  
  constructor() {
    super("MyService");
    this.initialize();
  }
  
  private initialize(): void {
    // Add managed connections
    const connection = RunService.Heartbeat.Connect(() => {
      // Logic
    });
    this.addConnection(connection);
    
    // Create and track instances
    const part = new Instance("Part");
    this.addInstance(part);
  }
  
  // Custom cleanup
  protected onDestroy(): void {
    // Additional cleanup logic
    print(`[${this.serviceName}] Performing custom cleanup`);
  }
}
```

## Renderer Pattern

Renderers should extend BaseRenderer for consistent rendering behavior:

```typescript
import { BaseRenderer, IRendererConfig, IRenderResult } from "../interfaces/IRenderer";

interface MyData {
  nodes: Node[];
}

interface MyRendererConfig extends IRendererConfig {
  nodeSize?: number;
}

export class MyRenderer extends BaseRenderer<MyData, MyRendererConfig> {
  constructor() {
    super("MyRenderer");
  }
  
  render(data: MyData, config: MyRendererConfig): IRenderResult {
    const startTime = tick();
    let objectCount = 0;
    
    // Clear previous render
    this.clear();
    
    // Render new data
    data.nodes.forEach(node => {
      const instance = this.renderNode(node, config);
      this.trackRenderedInstance(instance);
      objectCount++;
    });
    
    return {
      objectCount,
      renderTime: tick() - startTime,
      rootInstance: config.parent
    };
  }
  
  private renderNode(node: Node, config: MyRendererConfig): Part {
    // Node rendering logic
    return part;
  }
}
```

## Configuration Patterns

### Use Interfaces for Configuration

```typescript
// Good
export interface ButtonConfig {
  text: string;
  size?: UDim2;
  position?: UDim2;
  onClick?: () => void;
}

// Avoid
function makeButton(text: string, size?: UDim2, position?: UDim2, onClick?: () => void) {
  // ...
}
```

### Provide Defaults

```typescript
const BUTTON_DEFAULTS = {
  size: new UDim2(0, 100, 0, 30),
  position: new UDim2(0, 0, 0, 0),
  backgroundColor: new Color3(0.2, 0.5, 0.8),
} as const;

export function makeButton(config: ButtonConfig): TextButton {
  const {
    text,
    size = BUTTON_DEFAULTS.size,
    position = BUTTON_DEFAULTS.position,
    // ...
  } = config;
}
```

### Validate Inputs

```typescript
export function validateButtonConfig(config: unknown): config is ButtonConfig {
  if (!typeIs(config, "table")) return false;
  
  const cfg = config as Record<string, unknown>;
  if (!typeIs(cfg.text, "string")) return false;
  
  // Validate optional fields if present
  if (cfg.size && !typeIs(cfg.size, "UDim2")) return false;
  
  return true;
}
```

## Naming Conventions

### Files and Folders
- Makers: `makeSomething.ts` or `somethingMaker.ts`
- Services: `something.service.ts`
- Controllers: `something.controller.ts`
- Interfaces: `ISomething.ts`
- Constants: `something.constants.ts`

### Functions and Methods
- Makers: `makeSomething()` 
- Validators: `validateSomethingConfig()`
- Getters: `getSomethingDefaults()`
- Event handlers: `onSomethingHappened()`

### Variables and Properties
- Constants: `SOMETHING_DEFAULTS`, `SOMETHING_CONSTANTS`
- Configs: `somethingConfig`
- Instances: `somethingPart`, `somethingModel`

## Best Practices

1. **Always provide TypeScript types** - No `any` types
2. **Use const assertions for defaults** - Prevents accidental mutation
3. **Validate external inputs** - Especially for data from remotes
4. **Track created instances** - Use BaseService or BaseRenderer
5. **Provide cleanup methods** - Prevent memory leaks
6. **Document public APIs** - Use JSDoc comments
7. **Export types separately** - Allow consumers to import just types
8. **Use consistent error handling** - Log errors with context

## Migration Checklist

When updating existing code to follow these patterns:

- [ ] Extend appropriate base class (BaseService, BaseRenderer)
- [ ] Convert function parameters to config objects
- [ ] Add TypeScript interfaces for all configs
- [ ] Extract and document defaults
- [ ] Add validation functions where appropriate
- [ ] Update imports to use new interfaces
- [ ] Add deprecation notices for old APIs
- [ ] Update documentation
- [ ] Test backward compatibility