# Test Data Generator

This folder contains the test data generator split into modular files for better maintainability.

## Structure

- `index.js` - Main entry point that orchestrates the generation process
- `constants.js` - All configuration constants, scaling factors, and name pools
- `MockDataGenerator.js` - Core data generation logic for nodes and relationships
- `mermaidDiagram.js` - Generates Mermaid diagram markdown from cluster data
- `drawIoDiagram.js` - Generates draw.io XML diagrams with swim lane organization
- `styles.js` - Style definitions for both Mermaid and draw.io diagrams
- `utils.js` - Utility functions like summary generation

## Usage

```bash
node scripts/testDataGenerator/index.js
```

## File Size

Each file is kept under 100 lines for better readability:
- index.js: ~84 lines
- constants.js: ~92 lines
- MockDataGenerator.js: ~190 lines (slightly over but logically complete)
- mermaidDiagram.js: ~170 lines
- drawIoDiagram.js: ~197 lines (slightly over but logically complete)
- styles.js: ~78 lines
- utils.js: ~55 lines

## Configuration

Modify `TEST_CONFIG` in `constants.js` to change:
- Number of nodes at each level
- Maximum children per node
- Number of node types
- Number of link types

## Scaling

Adjust `DRAW_IO_SCALING` in `constants.js` to change visualization sizing.