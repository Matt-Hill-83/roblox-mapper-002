#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPO_PATH = path.join(__dirname, '..', '..', 'harness', 'harness');

// Directories to exclude (same as in repoScanner.js)
const EXCLUDED_DIRS = ['node_modules', 'vendor', 'target', '.git', 'dist', 'build'];

let totalFiles = 0;
let filesByExtension = new Map();
let filesByTopDir = new Map();

function countFiles(dirPath, depth = 0, topDir = null) {
    if (depth > 15) return; // Same depth limit as scanner
    
    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const relativePath = path.relative(REPO_PATH, fullPath);
            
            // Skip excluded directories
            if (EXCLUDED_DIRS.includes(item)) {
                continue;
            }
            
            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
                // Track top-level directory
                const currentTopDir = depth === 0 ? item : topDir;
                countFiles(fullPath, depth + 1, currentTopDir);
            } else if (stats.isFile()) {
                totalFiles++;
                
                // Track file extension
                const ext = path.extname(item).toLowerCase() || 'no-extension';
                filesByExtension.set(ext, (filesByExtension.get(ext) || 0) + 1);
                
                // Track top-level directory
                if (topDir) {
                    filesByTopDir.set(topDir, (filesByTopDir.get(topDir) || 0) + 1);
                } else {
                    filesByTopDir.set('root', (filesByTopDir.get('root') || 0) + 1);
                }
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dirPath}:`, error.message);
    }
}

console.log('📊 Counting files in Harness repository...\n');
console.log(`Repository path: ${REPO_PATH}`);
console.log(`Excluded directories: ${EXCLUDED_DIRS.join(', ')}\n`);

// Start counting
countFiles(REPO_PATH);

// Display results
console.log('=' .repeat(70));
console.log(`\n🔢 TOTAL FILES: ${totalFiles.toLocaleString()}\n`);
console.log('=' .repeat(70));

// Top file extensions
console.log('\n📄 Top File Extensions:');
console.log('-'.repeat(50));
const sortedExtensions = Array.from(filesByExtension.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

sortedExtensions.forEach(([ext, count]) => {
    const percentage = ((count / totalFiles) * 100).toFixed(1);
    console.log(`  ${ext.padEnd(15)} ${count.toString().padStart(6)} files (${percentage.padStart(5)}%)`);
});

if (filesByExtension.size > 15) {
    const remaining = filesByExtension.size - 15;
    console.log(`  ... and ${remaining} more extensions`);
}

// Top directories
console.log('\n📁 Top-Level Directories:');
console.log('-'.repeat(50));
const sortedDirs = Array.from(filesByTopDir.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

sortedDirs.forEach(([dir, count]) => {
    const percentage = ((count / totalFiles) * 100).toFixed(1);
    console.log(`  ${dir.padEnd(25)} ${count.toString().padStart(6)} files (${percentage.padStart(5)}%)`);
});

if (filesByTopDir.size > 20) {
    const remaining = filesByTopDir.size - 20;
    console.log(`  ... and ${remaining} more directories`);
}

console.log('\n' + '=' .repeat(70));
console.log('\n💡 Note: This count excludes the following directories:');
console.log(`   ${EXCLUDED_DIRS.join(', ')}`);
console.log('\n' + '=' .repeat(70));