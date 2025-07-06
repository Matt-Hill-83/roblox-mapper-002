# Interface Documentation

This directory contains the core interfaces that define contracts for various components in the codebase.

## Core Interfaces

### IService
**File**: `IService.ts`

Defines the base contract for all services in the application.

```typescript
interface IService {
  destroy(): void;
  isServiceDestroyed(): boolean;
}
```

**Usage**: All services should implement this interface, preferably by extending `BaseService`.

### IMaker
**File**: `IMaker.ts`

Defines contracts for maker functions and classes that create Roblox instances.

Key interfaces:
- `IMakerConfig` - Base configuration for all makers
- `IMakerFunction` - Contract for simple maker functions
- `IMakerClass` - Contract for complex maker classes
- `IVisualMakerConfig` - Extended config for visual objects
- `ILabelMakerConfig` - Config for label/text makers
- `IConnectorMakerConfig` - Config for connector/rope makers

**Usage Example**:
```typescript
// Simple maker function
const makeButton: IMakerFunction<IVisualMakerConfig, TextButton> = (config) => {
  const button = new Instance("TextButton");
  button.Position = config.position || Vector3.zero;
  button.BackgroundColor3 = config.color || new Color3(1, 1, 1);
  return button;
};

// Maker class
class HexagonMaker implements IMakerClass<HexagonConfig, Model> {
  make(config: HexagonConfig): Model {
    // Implementation
  }
  
  validate(config: HexagonConfig): boolean {
    return config.width > 0 && config.height > 0;
  }
}
```

### IRenderer
**File**: `IRenderer.ts`

Defines contracts for renderer classes that create visual representations of data.

Key interfaces:
- `IRenderer` - Base renderer interface
- `IGraphRenderer` - Specialized for graph rendering
- `IIncrementalRenderer` - Supports incremental updates
- `BaseRenderer` - Abstract class combining renderer with BaseService

**Usage Example**:
```typescript
class NodeRenderer extends BaseRenderer<NodeData[], NodeRendererConfig> {
  constructor() {
    super("NodeRenderer");
  }
  
  render(data: NodeData[], config: NodeRendererConfig): IRenderResult {
    const startTime = tick();
    let objectCount = 0;
    
    data.forEach(node => {
      const instance = this.createNode(node);
      this.trackRenderedInstance(instance);
      objectCount++;
    });
    
    return {
      objectCount,
      renderTime: tick() - startTime,
      rootInstance: config.parent
    };
  }
}
```

## Design Principles

1. **Consistency**: All similar components should implement the same interface
2. **Flexibility**: Interfaces should allow for both simple and complex implementations
3. **Type Safety**: Use generics to maintain type safety while allowing flexibility
4. **Extensibility**: Interfaces should be open for extension without breaking existing code

## Best Practices

1. **Implement over Extend**: Prefer implementing interfaces over extending classes when possible
2. **Use Base Classes**: For common functionality, extend base classes like `BaseService` or `BaseRenderer`
3. **Validate Inputs**: Implement validation methods when appropriate
4. **Track Resources**: Use tracking methods to ensure proper cleanup
5. **Document Contracts**: Clearly document what each interface method should do

## Migration Guide

To migrate existing code to use these interfaces:

1. **Services**:
   - Extend `BaseService` instead of managing connections manually
   - Move cleanup logic to `onDestroy()` method

2. **Makers**:
   - Ensure maker functions accept a config object as the first parameter
   - Return the primary instance created
   - Use consistent naming in config objects

3. **Renderers**:
   - Extend `BaseRenderer` for automatic instance tracking
   - Implement the `render()` method
   - Use `trackRenderedInstance()` for all created instances