# Graph Data Usage Documentation

This document shows which fields from the result object are used by each graph visualization component.

## Result Object Structure

The result object passed to each graph contains the following top-level fields:
- `entities` - Array of entity objects
- `connections` - Array of connection objects
- `groups` - Array of grouped entity information
- `positioned` - Array of entities with x,y coordinates
- `asciiMap` - ASCII string visualization
- `config` - Configuration object

## Field Usage by Component

### Top-Level Fields

| Field | ReactFlowGraph | CytoscapeGraph | D3Graph |
|-------|----------------|----------------|---------|
| `entities` | ✅ (fallback) | ✅ (fallback) | ✅ (fallback) |
| `connections` | ✅ | ✅ | ✅ |
| `groups` | ❌ | ❌ | ❌ |
| `positioned` | ✅ (preferred) | ✅ (preferred) | ✅ (preferred) |
| `asciiMap` | ❌ | ❌ | ❌ |
| `config` | ✅ | ✅ | ✅ |

### Entity/Positioned Object Fields

| Field | ReactFlowGraph | CytoscapeGraph | D3Graph | Notes |
|-------|----------------|----------------|---------|-------|
| `id`/`entityId` | ✅ | ✅ | ✅ | Node identifier |
| `type` | ✅ | ✅ | ✅ | Used for styling/coloring |
| `x` | ✅ | ✅ | ✅ | Position coordinate |
| `y` | ✅ | ✅ | ✅ | Position coordinate (often inverted) |
| `level` | ✅ | ✅ | ✅ | Hierarchical depth |
| `groupId` | ✅ | ✅ | ✅ | Used for styling/tooltips |
| `parentId` | ✅ | ❌ | ✅ (stored) | Parent relationships |
| `children` | ❌ | ❌ | ❌ | Not used by any graph |
| `connections` | ❌ | ❌ | ❌ | Not used (use top-level connections) |
| `weight` | ❌ | ❌ | ❌ | Available but unused |
| `isHub` | ❌ | ❌ | ❌ | Available but unused |

### Connection Object Fields

| Field | ReactFlowGraph | CytoscapeGraph | D3Graph |
|-------|----------------|----------------|---------|
| `fromId` | ✅ | ✅ | ✅ |
| `toId` | ✅ | ✅ | ✅ |
| `type` | ✅ | ✅ | ✅ |

### Config Object Fields

| Field | ReactFlowGraph | CytoscapeGraph | D3Graph | Usage |
|-------|----------------|----------------|---------|-------|
| `entityTypes` | ✅ | ✅ | ✅ | Color palette generation |
| `connectorTypes` | ✅ | ✅ | ✅ | Edge color generation |
| Other fields | ❌ | ❌ | ❌ | Not used for visualization |

## Key Observations

1. **Commonly Used Fields**: All three graphs consistently use the core positioning data (`x`, `y`, `level`), entity metadata (`id`, `type`), and connection information.

2. **Unused Rich Data**: Several potentially valuable fields are not utilized:
   - `weight` - Could be used for node sizing
   - `isHub` - Could highlight important nodes
   - `groups` - Could enable group-based layouts
   - `children` - Redundant with connections data

3. **Data Transformation**: All graphs use the `GraphAdapters` utility to transform the raw data into library-specific formats.

4. **Position Preference**: All graphs prefer the `positioned` array over the raw `entities` array when available, as it contains pre-calculated x,y coordinates.

5. **Color Consistency**: All graphs use the centralized `colorTokens` configuration for consistent styling across visualizations.