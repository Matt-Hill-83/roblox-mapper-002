# Hierarchical Graph 2D Demo

A simple proof of concept that demonstrates hierarchical data analysis and 2D positioning in a Node.js console application.

## Features

- Generates fake hierarchical data with parent-child relationships
- Analyzes connections to identify separate hierarchy trees
- Positions entities in 2D space with proper hierarchical layout
- Displays results in formatted console tables

## Usage

```bash
# Run the demo
node index.js

# Or use npm scripts
npm start
npm run demo
```

## Project Structure

```
hierarchy-demo/
├── package.json
├── index.js              # Main orchestration script
├── src/
│   ├── dataGenerator.js   # Fake data generation
│   ├── analyzer.js        # Connection analysis
│   ├── positioner.js      # 2D positioning algorithm
│   └── visualizer.js      # Console display system
└── README.md
```

## Sample Output

The demo will display:
- Summary of generated data
- Individual group tables showing entity details
- Complete layout map with positions

Each entity shows:
- ID, Type, Parent relationship
- 2D coordinates (X, Y)
- Hierarchy level
- Group membership