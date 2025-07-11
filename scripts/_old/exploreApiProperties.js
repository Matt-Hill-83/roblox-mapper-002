#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the harness-files.json
const dataPath = path.join(__dirname, '..', 'data', 'harness-files.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter only API files
const apiFiles = data.filter(file => file.component === 'api' || file.type === 'api-def');

console.log('🔍 Exploring API File Properties\n');
console.log('=' .repeat(60));

// Analyze path patterns
const pathAnalysis = {
    httpMethods: new Map(),
    resourceTypes: new Map(),
    operationTypes: new Map(),
    moduleNames: new Map(),
    apiVersions: new Map(),
    filePatterns: new Map()
};

apiFiles.forEach(file => {
    const pathParts = file.path.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.replace(/\.[^.]+$/, '');
    
    // Extract HTTP method patterns (get, post, put, delete, patch)
    const httpMethodPattern = /^(get|post|put|delete|patch|create|update|list|find|delete)_/i;
    const methodMatch = fileNameWithoutExt.match(httpMethodPattern);
    if (methodMatch) {
        const method = methodMatch[1].toLowerCase();
        pathAnalysis.httpMethods.set(method, (pathAnalysis.httpMethods.get(method) || 0) + 1);
    }
    
    // Extract resource types (repo, pullreq, pipeline, execution, etc.)
    if (pathParts.length > 3 && pathParts[2] === 'controller') {
        const resourceType = pathParts[3];
        pathAnalysis.resourceTypes.set(resourceType, (pathAnalysis.resourceTypes.get(resourceType) || 0) + 1);
    }
    
    // Extract operation types from file names
    const operations = [
        'create', 'update', 'delete', 'list', 'find', 'get', 
        'search', 'validate', 'import', 'export', 'sync',
        'merge', 'diff', 'commit', 'branch', 'tag',
        'authenticate', 'authorize', 'wire', 'controller',
        'helper', 'types', 'error', 'test'
    ];
    
    operations.forEach(op => {
        if (fileNameWithoutExt.includes(op)) {
            pathAnalysis.operationTypes.set(op, (pathAnalysis.operationTypes.get(op) || 0) + 1);
        }
    });
    
    // Module detection (second level directory)
    if (pathParts.length > 1) {
        const module = pathParts[1];
        pathAnalysis.moduleNames.set(module, (pathAnalysis.moduleNames.get(module) || 0) + 1);
    }
    
    // Common file patterns
    const patterns = {
        'Controller': fileName.includes('controller'),
        'Wire/DI': fileName.includes('wire'),
        'Types/Models': fileName.includes('types') || fileName.includes('model'),
        'Test': fileName.includes('test') || fileName.includes('spec'),
        'Helper/Util': fileName.includes('helper') || fileName.includes('util'),
        'Auth': fileName.includes('auth'),
        'Error': fileName.includes('error'),
        'Client': fileName.includes('client')
    };
    
    Object.entries(patterns).forEach(([pattern, matches]) => {
        if (matches) {
            pathAnalysis.filePatterns.set(pattern, (pathAnalysis.filePatterns.get(pattern) || 0) + 1);
        }
    });
});

// Print results
console.log(`\n📁 Total API Files Analyzed: ${apiFiles.length}\n`);

console.log('🌐 Resource Types (API domains):');
console.log('-'.repeat(40));
const sortedResources = Array.from(pathAnalysis.resourceTypes.entries()).sort((a, b) => b[1] - a[1]);
sortedResources.slice(0, 15).forEach(([type, count]) => {
    console.log(`  ${type.padEnd(20)} ${count.toString().padStart(4)} files`);
});

console.log('\n🔧 Operation Types:');
console.log('-'.repeat(40));
const sortedOps = Array.from(pathAnalysis.operationTypes.entries()).sort((a, b) => b[1] - a[1]);
sortedOps.slice(0, 15).forEach(([op, count]) => {
    console.log(`  ${op.padEnd(20)} ${count.toString().padStart(4)} files`);
});

console.log('\n📦 Module Names:');
console.log('-'.repeat(40));
const sortedModules = Array.from(pathAnalysis.moduleNames.entries()).sort((a, b) => b[1] - a[1]);
sortedModules.forEach(([module, count]) => {
    console.log(`  ${module.padEnd(20)} ${count.toString().padStart(4)} files`);
});

console.log('\n📝 File Patterns:');
console.log('-'.repeat(40));
const sortedPatterns = Array.from(pathAnalysis.filePatterns.entries()).sort((a, b) => b[1] - a[1]);
sortedPatterns.forEach(([pattern, count]) => {
    console.log(`  ${pattern.padEnd(20)} ${count.toString().padStart(4)} files`);
});

console.log('\n💡 Suggested Additional Properties:');
console.log('-'.repeat(40));
console.log('1. resourceDomain - The API resource being managed (repo, pullreq, pipeline, etc.)');
console.log('2. operationType - CRUD operation or action (create, update, delete, list, etc.)');
console.log('3. authRequired - Whether the API requires authentication');
console.log('4. apiModule - Top-level module the API belongs to');
console.log('5. complexity - Based on file size and operation type');
console.log('6. httpMethod - Inferred HTTP method (GET, POST, PUT, DELETE)');
console.log('7. isWebhook - Whether it handles webhooks');
console.log('8. hasTests - Whether it has associated test files');