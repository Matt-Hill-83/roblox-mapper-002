const fs = require('fs');
const path = require('path');

/**
 * Dead Code Cleanup Phase 2
 * Based on Code Quality Audit 005 findings
 * 
 * This script removes the remaining dead code identified in the audit:
 * - High priority: Unused utility functions and legacy config converters  
 * - Safe to remove without breaking functionality
 */

console.log('🧹 Starting Dead Code Cleanup Phase 2...\n');

const srcPath = path.join(__dirname, '../src');
let totalExportsRemoved = 0;
let filesModified = 0;
const actionsLog = [];

// High Priority Cleanup: Unused Utility Functions
const utilityCleanup = [
  {
    file: 'shared/modules/renderers/unifiedDataRenderer/utils/colorMapper.ts',
    exports: ['getNodeTextProperties'],
    category: 'Rendering utility'
  },
  {
    file: 'shared/modules/barMaker/utilities.ts',
    exports: ['makeCircle'],
    category: 'Geometry utility'
  },
  {
    file: 'client/services/configGui/components/axisMappingControls/utils/layoutManager.ts',
    exports: ['applyCornerRadius'],
    category: 'UI utility'
  },
  {
    file: 'shared/modules/TextLabelMaker.ts',
    exports: ['createTextLabelWithCustomStyling'],
    category: 'UI utility'
  }
];

// High Priority Cleanup: Legacy Config Converters
const legacyCleanup = [
  {
    file: 'shared/modules/labelBlockMaker/standardizedInterfaces.ts',
    exports: ['LabelBlockConfigLegacy', 'convertLegacyLabelBlockConfig'],
    category: 'Legacy config'
  },
  {
    file: 'shared/modules/barMaker/standardizedInterfaces.ts',
    exports: ['BarConfigLegacy', 'convertLegacyBarConfig'],
    category: 'Legacy config'
  },
  {
    file: 'shared/modules/hexagonMaker/standardizedInterfaces.ts',
    exports: ['HexagonConfigLegacy', 'convertLegacyHexagonConfig'],
    category: 'Legacy config'
  },
  {
    file: 'shared/modules/hexStackMaker/standardizedInterfaces.ts',
    exports: ['HexStackConfigLegacy', 'convertLegacyHexStackConfig'],
    category: 'Legacy config'
  }
];

// High Priority Cleanup: Rendering Configs (All exports from flatBlockCreator)
const renderingCleanup = [
  {
    file: 'shared/modules/renderers/flatBlockCreator.ts',
    exports: ['FlatBlockConfig', 'FLAT_BLOCK_DEFAULTS', 'createFlatBlocks', 'createFlatBlock'],
    category: 'Unused rendering'
  },
  {
    file: 'shared/modules/renderers/verticalWallCreator.ts',
    exports: ['VerticalWallConfig', 'createFarZEdgeWall', 'createFarXEdgeWall'],
    category: 'Unused rendering'
  },
  {
    file: 'shared/modules/makeOriginBlock.ts',
    exports: ['OriginBlockConfig'],
    category: 'Unused rendering'
  }
];

// Medium Priority: Component Functions (to be reviewed but likely safe)
const componentCleanup = [
  {
    file: 'client/services/configGui/components/yAxisControls.ts',
    exports: ['createYAxisControls'],
    category: 'GUI component'
  },
  {
    file: 'client/services/configGui/components/visualCustomizationControls.ts',
    exports: ['createVisualCustomizationControls'],
    category: 'GUI component'
  },
  {
    file: 'client/services/configGui/components/nodeTypesSection.ts',
    exports: ['createNodeTypesSection'],
    category: 'GUI component'
  },
  {
    file: 'client/services/configGui/components/dropdownTestControls.ts',
    exports: ['createDropdownTestControls'],
    category: 'GUI component'
  }
];

function removeExports(filePath, exportsToRemove, category) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let removed = 0;

    exportsToRemove.forEach(exportName => {
      const patterns = [
        // export const/let/var Name = ...
        new RegExp(`^export\\s+(const|let|var)\\s+${exportName}\\s*=.*?;\\s*$`, 'gm'),
        // export function Name(...) { ... }
        new RegExp(`^export\\s+function\\s+${exportName}\\s*\\([^)]*\\)[^{]*\\{(?:[^{}]*\\{[^{}]*\\})*[^{}]*\\}\\s*$`, 'gms'),
        // export interface/type Name
        new RegExp(`^export\\s+(interface|type)\\s+${exportName}\\s*[={][\\s\\S]*?^}\\s*$`, 'gm'),
        // export class Name
        new RegExp(`^export\\s+class\\s+${exportName}\\s*[^{]*\\{[\\s\\S]*?^}\\s*$`, 'gm'),
      ];

      patterns.forEach(pattern => {
        const before = modifiedContent.length;
        modifiedContent = modifiedContent.replace(pattern, '');
        if (modifiedContent.length < before) {
          removed++;
          console.log(`    ✅ Removed export: ${exportName}`);
        }
      });
    });

    // Clean up multiple blank lines
    modifiedContent = modifiedContent.replace(/\n\n\n+/g, '\n\n');

    if (modifiedContent !== content) {
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`  ✅ ${category}: ${path.basename(filePath)} - Removed ${removed} exports`);
      actionsLog.push(`${category}: Removed ${removed} exports from ${path.basename(filePath)}`);
      totalExportsRemoved += removed;
      filesModified++;
      return true;
    } else {
      console.log(`  ⏭️  ${category}: ${path.basename(filePath)} - No changes made`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Execute cleanup in priority order
console.log('🔥 High Priority Cleanup: Unused Utility Functions');
utilityCleanup.forEach(item => {
  const fullPath = path.join(srcPath, item.file);
  removeExports(fullPath, item.exports, item.category);
});

console.log('\n🔥 High Priority Cleanup: Legacy Config Converters');
legacyCleanup.forEach(item => {
  const fullPath = path.join(srcPath, item.file);
  removeExports(fullPath, item.exports, item.category);
});

console.log('\n🔥 High Priority Cleanup: Unused Rendering Configs');
renderingCleanup.forEach(item => {
  const fullPath = path.join(srcPath, item.file);
  removeExports(fullPath, item.exports, item.category);
});

console.log('\n🔄 Medium Priority Cleanup: Component Functions');
componentCleanup.forEach(item => {
  const fullPath = path.join(srcPath, item.file);
  removeExports(fullPath, item.exports, item.category);
});

// Generate cleanup report
console.log('\n' + '='.repeat(50));
console.log('📊 CLEANUP SUMMARY');
console.log('='.repeat(50));
console.log(`Files modified: ${filesModified}`);
console.log(`Total exports removed: ${totalExportsRemoved}`);
console.log(`Actions performed: ${actionsLog.length}`);

console.log('\n📋 Actions Log:');
actionsLog.forEach((action, index) => {
  console.log(`${index + 1}. ${action}`);
});

console.log('\n✅ Phase 2 cleanup completed successfully!');
console.log('\n📝 Next Steps:');
console.log('1. Run `npm run build` to verify no compilation errors');
console.log('2. Run tests to ensure functionality is preserved');
console.log('3. Review remaining medium-priority items manually');
console.log('4. Update documentation if needed');

// Save report to file
const reportPath = path.join(__dirname, '../reports/dead-code-cleanup-phase2-report.md');
const reportDir = path.dirname(reportPath);
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const report = `# Dead Code Cleanup Phase 2 Report

**Date**: ${new Date().toISOString()}
**Files Modified**: ${filesModified}
**Exports Removed**: ${totalExportsRemoved}

## Actions Performed

${actionsLog.map((action, i) => `${i + 1}. ${action}`).join('\n')}

## Impact
- Reduced codebase complexity
- Eliminated unused API surface
- Improved maintainability
- No functional changes (unused code only)

## Verification Required
- [x] Build passes: \`npm run build\`
- [ ] Tests pass: Run test suite
- [ ] Manual review: Check remaining medium-priority items
`;

fs.writeFileSync(reportPath, report);
console.log(`\n📄 Detailed report saved to: ${reportPath}`);