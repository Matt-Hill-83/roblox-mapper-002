<!-- filename: 015TodoList.md -->

# Code Review Todo List

## Task: Implement Part Instancing and Optimization

### Overview
Replace individual part creation with efficient instancing to reduce memory usage and improve performance. Currently creating 7-10 parts per hexagon individually, which causes performance issues with large graphs.

### Subtasks

#### 1. ⬛ Create Template System for Hexagons
- ⬛ 1.1: Create `HexagonTemplateFactory` class in `src/shared/modules/hexagonTemplateFactory.ts`
- ⬛ 1.2: Build template hexagon model with all parts pre-configured
- ⬛ 1.3: Store template in ReplicatedStorage for cloning
- ⬛ 1.4: Include all attachments and base properties in template

#### 2. ⬛ Refactor hexagonMaker.ts to Use Templates
- ⬛ 2.1: Replace `new Instance("Part")` calls with template cloning
- ⬛ 2.2: Modify `makeHexagon()` function to accept template parameter
- ⬛ 2.3: Update only properties that differ (position, color, labels)
- ⬛ 2.4: Remove redundant property setting for cloned parts

#### 3. ⬛ Implement Batch Parenting
- ⬛ 3.1: Collect all created parts in arrays before parenting
- ⬛ 3.2: Create container models for batch operations
- ⬛ 3.3: Parent all hexagons to container first, then container to workspace
- ⬛ 3.4: Update `renderCluster()` to use batch parenting

#### 4. ⬛ Optimize Bar Creation
- ⬛ 4.1: Create single template bar with circles attached
- ⬛ 4.2: Clone entire bar assembly instead of creating parts individually
- ⬛ 4.3: Consider using UnionOperation to merge bar parts
- ⬛ 4.4: Reduce from 3 parts per bar to 1 part

#### 5. ⬛ Consider MeshPart Alternative
- ⬛ 5.1: Research feasibility of custom hexagon MeshPart
- ⬛ 5.2: Create or source hexagon mesh asset
- ⬛ 5.3: Test performance difference between part assembly vs single mesh
- ⬛ 5.4: Document pros/cons of mesh approach

#### 6. ⬛ Update Renderer for Batch Operations
- ⬛ 6.1: Modify `unifiedDataRenderer.ts` to create parts in batches
- ⬛ 6.2: Implement progress callback for large graph generation
- ⬛ 6.3: Add performance timing to measure improvements
- ⬛ 6.4: Update incremental updates to use instancing

#### 7. ⬛ Performance Testing
- ⬛ 7.1: Create benchmark script comparing old vs new approach
- ⬛ 7.2: Test with 100, 500, and 1000 nodes
- ⬛ 7.3: Measure memory usage before/after
- ⬛ 7.4: Document performance improvements

#### 8. ⬛ Update Related Systems
- ⬛ 8.1: Update `ConnectorService` to batch rope/beam creation
- ⬛ 8.2: Modify label creation to use templates
- ⬛ 8.3: Ensure animation systems work with cloned parts
- ⬛ 8.4: Test all features with new instancing system

### Expected Benefits
- 70-80% reduction in instance creation time
- 50% reduction in memory usage
- Smoother performance with large graphs
- Better scalability for complex visualizations

### Code Example
```typescript
// Before (current approach)
function makeHexagon(props: HexagonProps): Model {
    const model = new Instance("Model");
    const cube = new Instance("Part");  // New instance
    cube.Size = new Vector3(2, 2, 2);
    cube.Material = Enum.Material.Neon;
    // ... many more property settings
}

// After (optimized approach)
class HexagonFactory {
    private template: Model;
    
    createHexagon(props: HexagonProps): Model {
        const hexagon = this.template.Clone();
        const primaryPart = hexagon.PrimaryPart!;
        primaryPart.Position = props.position;
        primaryPart.Color = props.color;
        // Only update what changes
        return hexagon;
    }
}
```

### Priority: High 🟡
This optimization will significantly improve performance for all users and is especially critical for large graph visualizations.

## Task: Replace Inefficient Sorting Algorithms

### Overview
Replace O(n²) bubble sort implementations with Roblox's built-in `table.sort()` which uses an efficient quicksort algorithm. Current bubble sort becomes extremely slow with many node types.

### Subtasks

#### 1. ⬛ Identify All Bubble Sort Instances
- ⬛ 1.1: Search codebase for nested loops doing manual sorting
- ⬛ 1.2: Document all locations with line numbers
- ⬛ 1.3: Identify what data is being sorted in each case

#### 2. ⬛ Replace Bubble Sort in unifiedDataRenderer.ts
- ⬛ 2.1: Replace lines 335-346 bubble sort with `table.sort()`
- ⬛ 2.2: Create proper comparison function for type sorting
- ⬛ 2.3: Test that sort order remains consistent
- ⬛ 2.4: Update type sorting logic at lines 383-390

#### 3. ⬛ Implement Efficient Sort Utilities
- ⬛ 3.1: Create `src/shared/utils/sortUtils.ts`
- ⬛ 3.2: Add typed sort functions for common cases
- ⬛ 3.3: Include stable sort option if needed
- ⬛ 3.4: Add performance comparison tests

#### 4. ⬛ Update Node Sorting Logic
- ⬛ 4.1: Replace manual node name sorting
- ⬛ 4.2: Use proper string comparison
- ⬛ 4.3: Ensure Unicode/special characters handled correctly
- ⬛ 4.4: Maintain deterministic ordering

#### 5. ⬛ Performance Testing
- ⬛ 5.1: Benchmark old vs new sorting with 10, 50, 100 types
- ⬛ 5.2: Measure time complexity improvement
- ⬛ 5.3: Document performance gains
- ⬛ 5.4: Add unit tests for sort functions

### Code Example
```typescript
// Before (O(n²) bubble sort)
for (let i = 0; i < sortedTypes.size() - 1; i++) {
    for (let j = i + 1; j < sortedTypes.size(); j++) {
        const countA = typeCounters.get(sortedTypes[i])!;
        const countB = typeCounters.get(sortedTypes[j])!;
        if (countB > countA) {
            const temp = sortedTypes[i];
            sortedTypes[i] = sortedTypes[j];
            sortedTypes[j] = temp;
        }
    }
}

// After (O(n log n) efficient sort)
table.sort(sortedTypes, (a, b) => {
    const countA = typeCounters.get(a) || 0;
    const countB = typeCounters.get(b) || 0;
    return countB > countA; // Descending order
});
```

### Priority: High 🟡
Bubble sort becomes exponentially slower with more data. With 50 types, this is 2,500 operations vs ~250 with proper sorting.

## Task: Fix Memory Leaks from Unmanaged Connections

### Overview
Implement proper connection management to prevent memory leaks. Currently, many event connections are never disconnected, causing them to persist even after their parent objects are destroyed.

### Subtasks

#### 1. ⬛ Create Base Service Class with Connection Management
- ⬛ 1.1: Create `src/shared/classes/BaseService.ts`
- ⬛ 1.2: Add connection tracking array
- ⬛ 1.3: Implement automatic cleanup in destroy method
- ⬛ 1.4: Add helper methods for safe connections

#### 2. ⬛ Fix KeyboardShortcuts Service
- ⬛ 2.1: Store UserInputService connection at line 19
- ⬛ 2.2: Implement destroy() method
- ⬛ 2.3: Disconnect all connections on cleanup
- ⬛ 2.4: Test cleanup works properly

#### 3. ⬛ Fix ConfigGUIServer Service
- ⬛ 3.1: Store RemoteEvent connection from line 33
- ⬛ 3.2: Add connection to cleanup array
- ⬛ 3.3: Implement service destruction
- ⬛ 3.4: Ensure cleanup on server shutdown

#### 4. ⬛ Audit All GUI Controllers
- ⬛ 4.1: Review `configGUI.controller.ts` for button connections
- ⬛ 4.2: Review `animationTestGUI.controller.ts` 
- ⬛ 4.3: Review `colorPicker.controller.ts`
- ⬛ 4.4: Add connection tracking to all controllers

#### 5. ⬛ Implement GUI Cleanup Pattern
- ⬛ 5.1: Create `BaseGUIController` class
- ⬛ 5.2: Add automatic connection tracking
- ⬛ 5.3: Implement cleanup on GUI destruction
- ⬛ 5.4: Add cleanup when player leaves

#### 6. ⬛ Add Connection Utilities
- ⬛ 6.1: Create `ConnectionManager` utility class
- ⬛ 6.2: Add connection pooling for reusable connections
- ⬛ 6.3: Implement weak references where appropriate
- ⬛ 6.4: Add debug mode to track active connections

#### 7. ⬛ Update All Services
- ⬛ 7.1: Extend services from BaseService
- ⬛ 7.2: Migrate all connections to managed approach
- ⬛ 7.3: Add destroy() calls in appropriate places
- ⬛ 7.4: Test memory usage before/after

#### 8. ⬛ Add Memory Leak Detection
- ⬛ 8.1: Create debug tool to list active connections
- ⬛ 8.2: Add warnings for unmanaged connections
- ⬛ 8.3: Implement connection count monitoring
- ⬛ 8.4: Add automated tests for cleanup

### Code Example
```typescript
// Before (memory leak)
export class KeyboardShortcutsService {
    constructor() {
        // Connection never stored or cleaned up
        UserInputService.InputBegan.Connect((input) => {
            // handle input
        });
    }
}

// After (properly managed)
export class KeyboardShortcutsService extends BaseService {
    constructor() {
        super();
        
        // Connection automatically tracked and cleaned
        this.addConnection(
            UserInputService.InputBegan.Connect((input) => {
                // handle input
            })
        );
    }
    
    destroy(): void {
        super.destroy(); // Automatically disconnects all
    }
}

// BaseService implementation
export abstract class BaseService {
    private connections: RBXScriptConnection[] = [];
    
    protected addConnection(connection: RBXScriptConnection): void {
        this.connections.push(connection);
    }
    
    destroy(): void {
        this.connections.forEach(conn => conn.Disconnect());
        this.connections = [];
    }
}
```

### Priority: High 🟡
Memory leaks cause performance degradation over time and can crash servers in long-running games. This is especially critical for services that are created/destroyed frequently.

## Task: Refactor Complex Functions and Remove Code Duplication

### Overview
Break down overly complex functions into smaller, maintainable units and eliminate duplicated code. Current functions exceed 200 lines making them difficult to understand, test, and maintain. Additionally, color palettes and node creation logic are duplicated across multiple files.

### Subtasks

#### 1. ⬛ Analyze Function Complexity
- ⬛ 1.1: Use complexity analysis tools to identify all functions over 50 lines
- ⬛ 1.2: Document cyclomatic complexity of major functions
- ⬛ 1.3: Create refactoring priority list
- ⬛ 1.4: Map function dependencies

#### 2. ⬛ Refactor performIncrementalUpdate() (212 lines)
- ⬛ 2.1: Extract node state mapping logic (lines 455-480)
- ⬛ 2.2: Extract node update logic (lines 490-541)
- ⬛ 2.3: Extract layer cleanup logic (lines 544-548)
- ⬛ 2.4: Extract position recalculation logic (lines 560-590)
- ⬛ 2.5: Extract connection recreation logic (lines 592-644)
- ⬛ 2.6: Create separate methods for each responsibility
- ⬛ 2.7: Add unit tests for each extracted method

#### 3. ⬛ Refactor calculateLayerSwimLanePositions() (161 lines)
- ⬛ 3.1: Extract node organization logic (lines 252-263)
- ⬛ 3.2: Extract type grouping logic (lines 266-279)
- ⬛ 3.3: Extract type sorting logic (lines 281-299)
- ⬛ 3.4: Extract position calculation logic (lines 305-355)
- ⬛ 3.5: Create helper methods for swim lane calculations
- ⬛ 3.6: Separate concerns into distinct functions

#### 4. ⬛ Extract Shared Color Palettes
- ⬛ 4.1: Create `src/shared/constants/colorPalettes.ts`
- ⬛ 4.2: Move COLOR_PALETTES from unifiedDataRenderer.ts
- ⬛ 4.3: Deduplicate from SimpleDataGeneratorService
- ⬛ 4.4: Create typed interfaces for color arrays
- ⬛ 4.5: Update all references to use shared module

#### 5. ⬛ Consolidate Node Creation Logic
- ⬛ 5.1: Identify duplicated node creation in:
  - `createNodeFromHexagon()` (lines 664-696)
  - `createNewNode()` (lines 701-730)
  - `generateClusterFromLayers()` (lines 89-97)
- ⬛ 5.2: Create `NodeFactory` class in shared modules
- ⬛ 5.3: Extract common node properties setup
- ⬛ 5.4: Implement builder pattern for node creation
- ⬛ 5.5: Remove duplicated logic

#### 6. ⬛ Create Function Composition Utilities
- ⬛ 6.1: Implement pipeline pattern for data transformations
- ⬛ 6.2: Create reusable position calculation functions
- ⬛ 6.3: Extract common validation logic
- ⬛ 6.4: Build composable function library

#### 7. ⬛ Improve Code Organization
- ⬛ 7.1: Group related functions into logical sections
- ⬛ 7.2: Add clear section headers and documentation
- ⬛ 7.3: Ensure single responsibility principle
- ⬛ 7.4: Move utilities to appropriate modules

#### 8. ⬛ Add Comprehensive Tests
- ⬛ 8.1: Create unit tests for all extracted functions
- ⬛ 8.2: Test edge cases and error conditions
- ⬛ 8.3: Ensure refactoring doesn't break functionality
- ⬛ 8.4: Add integration tests for complex flows

### Code Example
```typescript
// Before: One massive function
private performIncrementalUpdate(config: EnhancedGeneratorConfig, ...args): void {
    // 200+ lines of mixed concerns
    // Building node state
    // Updating nodes
    // Cleaning up layers
    // Recalculating positions
    // Recreating connections
}

// After: Composed smaller functions
private performIncrementalUpdate(config: EnhancedGeneratorConfig, ...args): void {
    const currentState = this.mapCurrentNodeState(nodesFolder);
    const updatePlan = this.createUpdatePlan(currentState, config);
    
    this.applyNodeUpdates(updatePlan);
    this.cleanupRemovedLayers(updatePlan);
    this.recalculatePositions(updatePlan);
    this.recreateConnections(updatePlan);
}

// Extracted color constants
// src/shared/constants/colorPalettes.ts
export const GRAPH_COLOR_PALETTES = {
    NODE_COLORS: [
        { name: "Blue", value: [0.2, 0.4, 0.8] },
        { name: "Orange", value: [0.8, 0.4, 0.2] },
        // ... etc
    ],
    LINK_COLORS: [
        // ... consolidated colors
    ]
} as const;

// Node creation factory
export class NodeFactory {
    static createNode(params: NodeParams): Node {
        const base = this.createBaseNode(params);
        this.applyTypeSpecificProps(base, params.type);
        this.setPositioning(base, params.position);
        return base;
    }
    
    private static createBaseNode(params: NodeParams): Node {
        return {
            uuid: params.uuid,
            name: params.name,
            type: params.type,
            color: GRAPH_COLOR_PALETTES.NODE_COLORS[params.colorIndex],
            attachmentNames: DEFAULT_ATTACHMENTS,
            position: { x: 0, y: 0, z: 0 }
        };
    }
}
```

### Benefits
- **Maintainability**: Smaller functions are easier to understand and modify
- **Testability**: Each function can be tested independently
- **Reusability**: Extracted logic can be used elsewhere
- **Performance**: Easier to optimize focused functions
- **Debugging**: Clearer stack traces and error locations

### Priority: Medium 🟡
While not causing immediate issues, complex functions become technical debt that slows development and increases bug risk over time. Code duplication leads to inconsistencies and makes updates error-prone.

## Task: Implement Rendering Optimizations

### Overview
Apply specific rendering optimizations to reduce GPU load and improve performance. These optimizations can reduce resource consumption by 30-50% without affecting visual quality.

### Subtasks

#### 1. ⬛ Disable CastShadow on All Graph Parts
- ⬛ 1.1: Update `hexagonMaker.ts` to set `CastShadow = false` on all parts
- ⬛ 1.2: Update `makeBar()` function to disable shadows
- ⬛ 1.3: Update `labelBlockMaker.ts` for label parts
- ⬛ 1.4: Add to part creation templates
- ⬛ 1.5: Verify no visual quality loss

#### 2. ✅ Replace RopeConstraints with Beams
- ✅ 2.1: Modify `ropeCreator.ts` to use Beams instead of RopeConstraints
- ✅ 2.2: Remove physics-based rope creation
- ✅ 2.3: Implement Beam-based connections
- ✅ 2.4: Set Beam properties (Width0, Width1, FaceCamera)
- ⬛ 2.5: Test visual appearance matches previous implementation
- ⬛ 2.6: Measure performance improvement

#### 3. ⬛ Use SmoothPlastic Material Only
- ⬛ 3.1: Audit all material usage in codebase
- ⬛ 3.2: Replace Neon, Glass, ForceField materials
- ⬛ 3.3: Update `hexagonMaker.ts` to use SmoothPlastic
- ⬛ 3.4: Update bar and label materials
- ⬛ 3.5: Document any visual changes

#### 4. ⬛ Batch Part Parenting Operations
- ⬛ 4.1: Identify all locations where parts are parented individually
- ⬛ 4.2: Implement batch parenting in `hexagonMaker.ts`
- ⬛ 4.3: Update `unifiedDataRenderer.ts` createHexagons method
- ⬛ 4.4: Create parts in arrays, parent all at once
- ⬛ 4.5: Test performance with large graphs

#### 5. ⬛ Additional Optimizations
- ⬛ 5.1: Set Transparency to 0 where possible (avoid 0.1-0.9)
- ⬛ 5.2: Disable CanCollide on visual-only parts
- ⬛ 5.3: Disable CanTouch on all graph parts
- ⬛ 5.4: Disable CanQuery where not needed
- ⬛ 5.5: Use Anchored = true for all static parts

#### 6. ⬛ Performance Testing
- ⬛ 6.1: Create benchmark before optimizations
- ⬛ 6.2: Measure FPS with 100, 500, 1000 nodes
- ⬛ 6.3: Track memory usage changes
- ⬛ 6.4: Document performance improvements
- ⬛ 6.5: Test on low-end devices

### Code Example
```typescript
// Before: Resource-intensive rendering
const part = new Instance("Part");
part.Material = Enum.Material.Neon;
part.CastShadow = true; // Default, GPU intensive
part.Transparency = 0.1; // Transparency calculations
part.Parent = workspace; // Individual parenting

const rope = new Instance("RopeConstraint");
rope.Attachment0 = att0;
rope.Attachment1 = att1; // Physics calculations every frame

// After: Optimized rendering
const parts: Part[] = [];

// Create all parts first
for (let i = 0; i < nodeCount; i++) {
    const part = new Instance("Part");
    part.Material = Enum.Material.SmoothPlastic; // Fastest material
    part.CastShadow = false; // No shadows
    part.Transparency = 0; // Fully opaque (faster)
    part.CanCollide = false;
    part.CanTouch = false;
    part.CanQuery = false;
    part.Anchored = true;
    parts.push(part);
}

// Parent all at once (batched operation)
parts.forEach(part => part.Parent = folder);

// Use Beam instead of RopeConstraint
const beam = new Instance("Beam");
beam.Attachment0 = att0;
beam.Attachment1 = att1;
beam.Width0 = 0.5;
beam.Width1 = 0.5;
beam.FaceCamera = true;
beam.Segments = 1; // No physics, just visual
```

### Expected Performance Improvements
- **Shadow Removal**: 15-20% GPU reduction
- **Beam vs Rope**: 70% physics calculation reduction
- **Material Change**: 10-15% rendering improvement
- **Batch Parenting**: 50% faster part creation
- **Combined**: 30-50% overall performance gain

### Priority: High 🟡
These are quick wins that provide significant performance improvements with minimal code changes. Essential for supporting larger graphs and lower-end devices.