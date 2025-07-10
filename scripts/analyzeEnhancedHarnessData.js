#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the harness-files.json
const dataPath = path.join(__dirname, '..', 'data', 'harness-files.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('📊 Enhanced Harness Codebase Analysis\n');
console.log('=' .repeat(70));
console.log(`\nTotal files analyzed: ${data.length}`);
console.log('\n📋 Property Analysis:\n');

// All properties to analyze
const properties = [
    'service', 'component', 'language', 'size', 'type',
    'resourceDomain', 'operationType', 'apiPattern', 'apiComplexity', 'httpMethod',
    'directoryDepth', 'fileExtension', 'testStatus', 'importCount', 'exportCount',
    'lineCount', 'commentDensity', 'lastModified', 'moduleType', 'complexityScore'
];

properties.forEach(prop => {
    const distribution = new Map();
    data.forEach(item => {
        const value = item[prop];
        distribution.set(value, (distribution.get(value) || 0) + 1);
    });
    
    const sorted = Array.from(distribution.entries()).sort((a, b) => b[1] - a[1]);
    
    console.log(`\n${prop.toUpperCase()} (${distribution.size} unique values):`);
    console.log('-'.repeat(50));
    
    // Show top 10 values
    sorted.slice(0, 10).forEach(([value, count]) => {
        const percentage = ((count / data.length) * 100).toFixed(1);
        console.log(`  ${value.padEnd(20)} ${count.toString().padStart(4)} files (${percentage.padStart(5)}%)`);
    });
    
    if (sorted.length > 10) {
        console.log(`  ... and ${sorted.length - 10} more values`);
    }
});

// API-specific analysis
console.log('\n\n🔍 API-Specific Insights:\n');

// Count API files
const apiFiles = data.filter(file => file.type === 'api-def' || file.component === 'api');
console.log(`API Files: ${apiFiles.length} (${((apiFiles.length / data.length) * 100).toFixed(1)}% of total)`);

// Most common API patterns
const apiPatterns = new Map();
apiFiles.forEach(file => {
    apiPatterns.set(file.apiPattern, (apiPatterns.get(file.apiPattern) || 0) + 1);
});

console.log('\nTop API Patterns:');
Array.from(apiPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([pattern, count]) => {
        console.log(`  ${pattern}: ${count}`);
    });

// HTTP Method distribution
const httpMethods = new Map();
apiFiles.forEach(file => {
    httpMethods.set(file.httpMethod, (httpMethods.get(file.httpMethod) || 0) + 1);
});

console.log('\nHTTP Methods:');
Array.from(httpMethods.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([method, count]) => {
        console.log(`  ${method}: ${count}`);
    });

// Complexity distribution
const complexityDist = new Map();
data.forEach(file => {
    complexityDist.set(file.apiComplexity, (complexityDist.get(file.apiComplexity) || 0) + 1);
});

console.log('\nAPI Complexity:');
Array.from(complexityDist.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([complexity, count]) => {
        console.log(`  ${complexity}: ${count}`);
    });

console.log('\n' + '='.repeat(70));