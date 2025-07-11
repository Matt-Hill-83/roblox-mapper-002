# Code Audit Tools

This directory contains scripts for running comprehensive code quality audits on TypeScript projects.

## Overview

The audit tools analyze your TypeScript codebase to identify:
- Code quality issues (complexity, duplication, type safety)
- Architecture problems (circular dependencies, cohesion)
- Dead code and orphaned files
- Refactoring opportunities

## Directory Structure

```
02-Tools/
├── README.md           # This file
├── analysis/           # Analysis scripts
│   ├── createInventory.js    # Step 1: Create file inventory
│   ├── runAudit.js          # Step 2: Run full audit
│   ├── fileScanner.js       # Utility: File scanning
│   ├── codeAnalyzer.js      # Utility: Code quality analysis
│   ├── dependencyMapper.js  # Utility: Dependency analysis
│   └── reportGenerator.js   # Utility: Report generation
├── data/              # Generated data files (created by scripts)
│   ├── fileInventory.json   # File metrics and patterns
│   ├── detailedAnalysis.json # Full analysis results
│   └── auditSummary.json    # Summary of findings
└── reports/           # Generated reports (created by scripts)
    └── CodeQualityAuditReport.md # Main audit report
```

## Usage

### Step 1: Adjust Path Configuration

**IMPORTANT**: Before running the scripts, you must adjust the source path based on your project structure.

Edit `analysis/createInventory.js` and modify the `srcPath` variable:

```javascript
// Default path assumes this structure:
// project-root/
//   ├── src/                    # Your TypeScript source code
//   └── ____001 - Code Audit/
//       └── __00-Template/
//           └── 02-Tools/
//               └── analysis/
//                   └── createInventory.js

// Adjust this path based on your folder structure:
const srcPath = path.join(__dirname, '../../../../../src');
```

The default path goes up 5 levels from the script location to reach the project root, then into the src folder.

### Step 2: Create File Inventory

Run the inventory script to scan all TypeScript files:

```bash
cd analysis
node createInventory.js
```

This will:
- Scan all .ts and .tsx files in your src directory
- Count code patterns (functions, classes, interfaces, etc.)
- Calculate file metrics (size, lines, complexity)
- Generate `data/fileInventory.json`

### Step 3: Run Full Audit

After creating the inventory, run the full audit:

```bash
node runAudit.js
```

This will:
- Load the file inventory
- Analyze code quality issues
- Map dependencies and find circular references
- Generate comprehensive reports
- Save results to `data/` and `reports/` directories

## Output Files

### data/fileInventory.json
Contains metrics for all TypeScript files:
- File paths and sizes
- Line counts
- Pattern counts (functions, classes, TODOs, etc.)
- Type safety metrics (any types, type assertions)

### data/detailedAnalysis.json
Full analysis results including:
- Code quality issues per file
- Duplicate code patterns
- Dependency graph
- Circular dependencies
- Module cohesion metrics

### reports/CodeQualityAuditReport.md
Human-readable markdown report with:
- Executive summary
- Top issues by category
- Architectural insights
- Actionable recommendations
- Prioritized improvement tasks

## Common Issues and Solutions

### "Source directory not found"
- Check that the `srcPath` in createInventory.js points to your TypeScript source folder
- Verify the relative path from the script location to your src directory

### "fileInventory.json not found"
- Run `createInventory.js` before running `runAudit.js`
- Check that the data directory was created successfully

### Scripts fail with module errors
- Ensure all script files are present in the analysis directory
- Check that Node.js is installed (version 12 or higher recommended)

## Customization

### Skip Additional Directories
Edit `fileScanner.js` to add more directories to skip:

```javascript
const skipDirs = ['node_modules', 'out', '.git', 'dist', 'build', 'coverage', 'your-dir-here'];
```

### Add Custom Patterns
Edit the `countPatterns` function in `fileScanner.js` to detect additional patterns:

```javascript
const patterns = {
  // ... existing patterns ...
  customPattern: (content.match(/your-regex-here/g) || []).length
};
```

### Adjust Complexity Thresholds
Edit `codeAnalyzer.js` to modify complexity thresholds and rules.

## Running Audits for Different Projects

When using these tools for a different project:

1. Copy the entire `02-Tools` directory to your audit location
2. Adjust the `srcPath` in `createInventory.js`
3. Run the scripts as described above
4. Results will be generated relative to the tools location

## Integration with Code Audit Process

These tools are designed to be used as part of the Code Audit process:

1. Create a new audit folder (e.g., `Code-Audit - 004`)
2. Copy or reference these tools
3. Run the analysis scripts
4. Use the generated data to create your audit report
5. Document findings and recommendations

## Troubleshooting

Enable verbose logging by adding console.log statements in the scripts:

```javascript
console.log('Current directory:', __dirname);
console.log('Looking for src at:', srcPath);
console.log('Files found:', files.length);
```

For additional help, check the individual script files which contain inline documentation.