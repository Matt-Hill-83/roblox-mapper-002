# Module Design and Boundaries

## Module Responsibilities

### 1. NodeGenerator
**Primary Responsibility:** Create and configure individual nodes with proper typing and properties

**Key Responsibilities:**
- Generate nodes for specific layers
- Create individual node instances with unique IDs
- Assign type-specific properties (age, names, pets, countries)
- Handle node type cycling based on configuration
- Manage color assignment for nodes

**Interface Contract:**
```typescript
interface INodeGenerator {
  generateLayerNodes(layer: LayerConfig, config: EnhancedGeneratorConfig): Node[];
  createNode(index: number, layerNumber: number, config: EnhancedGeneratorConfig): Node;
}
```

**Dependencies:** Constants (NODE_TYPE_NAMES, colors, property arrays), Node interface

---

### 2. LinkGenerator
**Primary Responsibility:** Create and manage relationships between nodes

**Key Responsibilities:**
- Generate links between layers (inter-layer connections)
- Generate links within layers (intra-layer connections)
- Ensure proper node connectivity (no isolated nodes)
- Handle link type cycling and color assignment
- Implement connection algorithms (same-type preference, random distribution)

**Interface Contract:**
```typescript
interface ILinkGenerator {
  generateAllLinks(nodesByLayer: Map<number, Node[]>, config: EnhancedGeneratorConfig): Link[];
  ensureConnectivity(nodes: Node[], links: Link[], config: EnhancedGeneratorConfig): void;
}
```

**Dependencies:** COLOR_PALETTES, Link/Node interfaces, utility functions

---

### 3. TestDataProcessor
**Primary Responsibility:** Process and convert test data into cluster format

**Key Responsibilities:**
- Convert TEMP_HARNESS_TEST_DATA to Node format
- Filter test data based on maxDataItems configuration
- Convert TEMP_HARNESS_LINKS to Link format
- Extract filenames and assign service colors
- Handle test data mode switching

**Interface Contract:**
```typescript
interface ITestDataProcessor {
  generateClusterFromTestData(config?: EnhancedGeneratorConfig): Cluster;
  setUseTestData(enabled: boolean): void;
}
```

**Dependencies:** Test data arrays, Node/Link/Cluster interfaces, property discovery utilities

---

### 4. PropertyManager
**Primary Responsibility:** Manage property discovery and validation

**Key Responsibilities:**
- Coordinate property discovery from generated nodes
- Filter properties suitable for visualization axes
- Validate property types and values
- Provide property metadata for rendering

**Interface Contract:**
```typescript
interface IPropertyManager {
  discoverAndValidateProperties(nodes: Node[]): PropertyMetadata[];
}
```

**Dependencies:** Property discovery utilities, Node interface

---

### 5. DataGenerator (Orchestrator)
**Primary Responsibility:** Coordinate all modules and provide main API

**Key Responsibilities:**
- Orchestrate the generation workflow
- Manage module dependencies and injection
- Provide backward-compatible API (IDataGenerator)
- Handle configuration routing to appropriate modules
- Debug utilities (writeTempData)

**Interface Contract:**
```typescript
interface IDataGenerator {
  generateClusterFromLayers(config: EnhancedGeneratorConfig): Cluster;
  setUseTestData(useTestData: boolean): void;
}
```

## Data Flow Design

```
EnhancedGeneratorConfig
         │
         ▼
   DataGenerator
    │    │    │
    ▼    ▼    ▼
NodeGen LinkGen TestDataProcessor
    │    │         │
    ▼    ▼         ▼
   Node[] Link[]   Cluster
      │    │         │
      ▼    ▼         ▼
   PropertyManager   │
         │           │
         ▼           ▼
   PropertyData   TestCluster
         │           │
         └─────┬─────┘
               ▼
         Final Cluster
```

## Module Interactions

### Normal Generation Flow
1. **DataGenerator** receives configuration
2. **DataGenerator** calls **NodeGenerator** for each layer
3. **NodeGenerator** creates nodes with properties
4. **DataGenerator** calls **LinkGenerator** with all nodes
5. **LinkGenerator** creates links and ensures connectivity
6. **DataGenerator** calls **PropertyManager** for property discovery
7. **DataGenerator** assembles final cluster

### Test Data Flow
1. **DataGenerator** detects test data mode
2. **DataGenerator** delegates to **TestDataProcessor**
3. **TestDataProcessor** converts test data to cluster format
4. **DataGenerator** returns test cluster directly

## Error Handling Strategy

### Module-Level Error Handling
- Each module validates its inputs
- Clear error messages with module identification
- Graceful degradation where possible

### Inter-Module Communication
- Interface contracts enforce type safety
- Null/undefined checks at module boundaries
- Configuration validation at orchestrator level

## Performance Considerations

### Memory Management
- Avoid unnecessary object copying between modules
- Use references where possible for large arrays
- Clean up temporary collections

### Computation Optimization
- Batch operations within modules
- Minimize repeated calculations
- Cache results where appropriate (color mappings, type arrays)