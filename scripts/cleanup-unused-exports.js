const fs = require('fs');
const path = require('path');

/**
 * Script to remove unused exports from TypeScript files
 * Based on Code Quality Audit 004 findings
 */

// Load the dead code analysis
const deadCodePath = path.join(__dirname, '../____001 - Code Audit/__01-Historical-Audits/Code-Audit - 004/03-Results/deadCode.json');
const deadCode = JSON.parse(fs.readFileSync(deadCodePath, 'utf8'));

// Extract only unused export patterns
const unusedExports = deadCode.deadCodePatterns.filter(item => item.type === 'unused-export');

console.log(`Found ${unusedExports.length} files with unused exports to clean up\n`);

// Track statistics
let totalExportsRemoved = 0;
let filesProcessed = 0;
let errors = [];

// Process each file with unused exports
unusedExports.forEach(({ file, items }) => {
  const filePath = path.join(__dirname, '../src', file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let removedCount = 0;
    
    // Process each unused export
    items.forEach(exportName => {
      // Patterns to match different export styles
      const patterns = [
        // export const/let/var Name
        new RegExp(`^export\\s+(const|let|var)\\s+${exportName}\\s*=.*?;?\\s*$`, 'gm'),
        // export function Name
        new RegExp(`^export\\s+function\\s+${exportName}\\s*\\([^)]*\\).*?\\n}\\s*$`, 'gms'),
        // export interface/type Name
        new RegExp(`^export\\s+(interface|type)\\s+${exportName}\\s*[={].*?\\n}\\s*$`, 'gms'),
        // export class Name
        new RegExp(`^export\\s+class\\s+${exportName}\\s*.*?\\n}\\s*$`, 'gms'),
        // export { Name }
        new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`, 'g'),
        // Named exports in export list
        new RegExp(`(export\\s*\\{[^}]*),?\\s*${exportName}\\s*,?([^}]*\\})`, 'g')
      ];
      
      patterns.forEach(pattern => {
        const before = modifiedContent.length;
        
        if (pattern.source.includes('export\\s*\\{[^}]*\\b')) {
          // Special handling for export lists
          modifiedContent = modifiedContent.replace(pattern, (match, before, after) => {
            // Clean up commas
            let result = before + after;
            result = result.replace(/,\s*,/g, ','); // Remove double commas
            result = result.replace(/\{\s*,/g, '{'); // Remove leading comma
            result = result.replace(/,\s*\}/g, '}'); // Remove trailing comma
            result = result.replace(/\{\s*\}/g, ''); // Remove empty exports
            return result;
          });
        } else {
          modifiedContent = modifiedContent.replace(pattern, '');
        }
        
        if (modifiedContent.length < before) {
          removedCount++;
        }
      });
    });
    
    // Clean up multiple blank lines
    modifiedContent = modifiedContent.replace(/\n\n\n+/g, '\n\n');
    
    // Only write if changes were made
    if (modifiedContent !== content) {
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`✅ ${file} - Removed ${removedCount} exports`);
      totalExportsRemoved += removedCount;
      filesProcessed++;
    } else {
      console.log(`⏭️  ${file} - No changes needed`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
    errors.push({ file, error: error.message });
  }
});

// Summary
console.log('\n=== Summary ===');
console.log(`Files processed: ${filesProcessed}`);
console.log(`Total exports removed: ${totalExportsRemoved}`);
console.log(`Errors encountered: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n=== Errors ===');
  errors.forEach(({ file, error }) => {
    console.log(`${file}: ${error}`);
  });
}

console.log('\n⚠️  Important: Please review the changes and test your application!');
console.log('Some exports might be used dynamically or in ways not detected by static analysis.');