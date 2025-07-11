# DataGenerator Dependency Analysis

## Current Imports and Dependencies

### External Constants (from ../constants)
- `ANIMAL_TYPES` - Used in property assignment for Animals node type
- `COLOR_PALETTES` - Used for node and link color assignment
- `COUNTRIES_OF_BIRTH` - Used in property assignment for person node types
- `COUNTRIES_OF_RESIDENCE` - Used in property assignment for person node types  
- `DEFAULT_ATTACHMENTS` - Used in node creation
- `FIRST_NAMES` - Used in property assignment for person node types
- `LAST_NAMES` - Used in property assignment for person node types
- `NODE_TYPE_NAMES` - Used to cycle through node types during generation
- `PET_COLORS` - Used in property assignment for person node types
- `PET_TYPES` - Used in property assignment for person node types

### Interfaces (from ../../../../interfaces/)
- `Cluster` - Return type for cluster generation
- `Group` - Used to create groups within clusters
- `Link` - Type for relationship objects
- `Node` - Type for entity objects
- `EnhancedGeneratorConfig` - Main configuration input
- `LayerConfig` - Configuration for individual layers

### Utilities (from ../../../../utils/)
- `discoverNodeProperties` - Used to discover available properties from generated nodes
- `filterValidAxisProperties` - Used to filter properties suitable for visualization axes

### Local Interfaces
- `IDataGenerator` - Interface implemented by DataGenerator class

### Test Data
- `TEMP_HARNESS_LINKS` - Large array of test link data
- `TEMP_HARNESS_TEST_DATA` - Large array of test node data

## Interface Requirements

### IDataGenerator Interface
```typescript
interface IDataGenerator {
  generateClusterFromLayers(config: EnhancedGeneratorConfig): Cluster;
}
```

### EnhancedGeneratorConfig Usage
- `config.layers` - Array of layer configurations
- `config.numNodeTypes` - Number of node types to cycle through
- `config.numLinkTypes` - Number of link types to use
- `config.numPetTypes` - Number of pet types for property assignment
- `config.maxDataItems` - Limit for test data processing
- `config.visualization?.allowSameLevelLinks` - Configuration for intra-layer links

## Method Analysis by Module

### NodeGenerator Module (150 lines)
**Methods to extract:**
- `generateLayerNodes(layer, config)` - Lines ~138-150
- `createNode(index, layerNumber, config)` - Lines ~155-186  
- `addTypeSpecificProperties(node, nodeTypeName, config)` - Lines ~191-255

**Dependencies:**
- NODE_TYPE_NAMES, COLOR_PALETTES, DEFAULT_ATTACHMENTS
- PET_TYPES, PET_COLORS, FIRST_NAMES, LAST_NAMES
- COUNTRIES_OF_BIRTH, COUNTRIES_OF_RESIDENCE, ANIMAL_TYPES
- Node interface, EnhancedGeneratorConfig

### LinkGenerator Module (120 lines)
**Methods to extract:**
- `generateLayerLinks(currentLayerNodes, nextLayerNodes, layer, config, allLinks)` - Lines ~260-299
- `generateIntraLayerLinks(sourceNode, currentLayerNodes, layer, config, allLinks)` - Lines ~304-338
- `generateInterLayerLink(sourceNode, nextLayerNodes, config, allLinks)` - Lines ~343-378
- `createLink(sourceNode, targetNode, config)` - Lines ~383-403
- `shuffleArray(array)` - Lines ~408-414
- `ensureNodeConnectivity(nodes, links, config)` - Lines ~419-466
- `findConnectionTarget(isolatedNode, allNodes)` - Lines ~471-490

**Dependencies:**
- COLOR_PALETTES
- Link interface, Node interface, EnhancedGeneratorConfig

### TestDataProcessor Module (100 lines)
**Methods to extract:**
- `generateClusterFromTestData(config)` - Lines ~519-590
- `getFileName(path)` - Lines ~603-610
- `getServiceColor(service)` - Lines ~616-629

**Dependencies:**
- TEMP_HARNESS_TEST_DATA, TEMP_HARNESS_LINKS
- Node, Link, Cluster, Group interfaces
- discoverNodeProperties, filterValidAxisProperties utilities

### PropertyManager Module (80 lines)
**Methods to integrate:**
- Property discovery orchestration
- Property validation logic
- Integration with existing discoverNodeProperties/filterValidAxisProperties

**Dependencies:**
- discoverNodeProperties, filterValidAxisProperties utilities
- Node interface

### DataGenerator Orchestrator (150 lines)
**Methods to keep:**
- `generateClusterFromLayers(config)` - Main orchestration method
- `constructor()` - Dependency injection setup
- `setUseTestData(useTestData)` - Configuration method
- `writeTempData(allNodes, allLinks, maxDataItems)` - Debug utility

**New Dependencies:**
- INodeGenerator, ILinkGenerator, ITestDataProcessor, IPropertyManager interfaces