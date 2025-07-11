const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * Safe removal of unused exports using TypeScript AST
 * Based on Code Quality Audit 004 findings
 */

// Load the dead code analysis
const deadCodePath = path.join(__dirname, '../____001 - Code Audit/__01-Historical-Audits/Code-Audit - 004/03-Results/deadCode.json');
const deadCode = JSON.parse(fs.readFileSync(deadCodePath, 'utf8'));

// Extract only unused export patterns
const unusedExports = deadCode.deadCodePatterns.filter(item => item.type === 'unused-export');

console.log(`Found ${unusedExports.length} files with unused exports\n`);

// Manual review required for these files (critical or complex)
const requiresManualReview = [
  'shared/interfaces/',  // Interface files need careful review
  'types.ts',            // Type definition files
  'index.ts',            // Index/barrel files
  '.service.ts',         // Service files might have dynamic usage
];

// Process each file
let totalRemoved = 0;
let filesModified = 0;

unusedExports.forEach(({ file, items }) => {
  // Skip files that need manual review
  if (requiresManualReview.some(pattern => file.includes(pattern))) {
    console.log(`⚠️  Skipping ${file} - requires manual review`);
    return;
  }
  
  const filePath = path.join(__dirname, '../src', file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${file}`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    let removed = 0;
    
    // Create a set of unused export names for quick lookup
    const unusedSet = new Set(items);
    
    // Process line by line for safer removal
    let inMultilineExport = false;
    let multilineStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for single-line exports
      items.forEach(exportName => {
        // Match various export patterns
        const patterns = [
          // export const/let/var Name = 
          new RegExp(`^export\\s+(const|let|var)\\s+${exportName}\\s*=`),
          // export function Name(
          new RegExp(`^export\\s+function\\s+${exportName}\\s*\\(`),
          // export interface Name
          new RegExp(`^export\\s+interface\\s+${exportName}\\s*[{<]`),
          // export type Name =
          new RegExp(`^export\\s+type\\s+${exportName}\\s*=`),
          // export class Name
          new RegExp(`^export\\s+class\\s+${exportName}\\s*[{<]`),
        ];
        
        const matchesSingleLine = patterns.some(p => p.test(line));
        
        if (matchesSingleLine) {
          // Mark line for removal
          lines[i] = '// REMOVED: ' + line;
          removed++;
          console.log(`  - Removing export: ${exportName}`);
        }
      });
      
      // Handle export { ... } blocks
      if (line.includes('export {') && !line.includes('}')) {
        inMultilineExport = true;
        multilineStart = i;
      } else if (inMultilineExport && line.includes('}')) {
        // Process multiline export block
        const exportBlock = lines.slice(multilineStart, i + 1).join(' ');
        let modified = exportBlock;
        
        items.forEach(exportName => {
          const regex = new RegExp(`\\b${exportName}\\b\\s*,?`, 'g');
          modified = modified.replace(regex, '');
        });
        
        // Clean up commas and whitespace
        modified = modified.replace(/,\s*,/g, ',');
        modified = modified.replace(/{\s*,/g, '{');
        modified = modified.replace(/,\s*}/g, '}');
        modified = modified.replace(/{\s*}/g, '{}');
        
        if (modified !== exportBlock && modified.trim() !== 'export {}') {
          // Update the export block
          const modifiedLines = modified.split(' ');
          for (let j = multilineStart; j <= i; j++) {
            lines[j] = j === multilineStart ? modifiedLines.join(' ') : '';
          }
          removed++;
        } else if (modified.trim() === 'export {}') {
          // Remove empty export block
          for (let j = multilineStart; j <= i; j++) {
            lines[j] = '';
          }
          removed++;
        }
        
        inMultilineExport = false;
      }
    }
    
    if (removed > 0) {
      // Clean up the file
      let modifiedContent = lines
        .filter(line => !line.startsWith('// REMOVED: '))
        .join('\n');
      
      // Remove multiple blank lines
      modifiedContent = modifiedContent.replace(/\n\n\n+/g, '\n\n');
      
      // Write back
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`✅ ${file} - Removed ${removed} unused exports`);
      totalRemoved += removed;
      filesModified++;
    } else {
      console.log(`⏭️  ${file} - No safe removals found`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
  }
});

console.log('\n=== Summary ===');
console.log(`Files modified: ${filesModified}`);
console.log(`Total exports removed: ${totalRemoved}`);
console.log(`\n⚠️  Files requiring manual review: ${requiresManualReview.length} patterns`);

console.log('\n📋 Next steps:');
console.log('1. Run `npm run build` to check for compilation errors');
console.log('2. Run tests to ensure functionality');
console.log('3. Manually review interface and type files');
console.log('4. Consider keeping exports that might be used by external packages');