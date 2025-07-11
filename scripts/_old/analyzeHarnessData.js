#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the harness-files.json
const dataPath = path.join(__dirname, '..', 'data', 'harness-files.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Analyze component types
const componentTypes = new Map();
data.forEach(file => {
    const component = file.component;
    componentTypes.set(component, (componentTypes.get(component) || 0) + 1);
});

// Analyze service types
const serviceTypes = new Map();
data.forEach(file => {
    const service = file.service;
    serviceTypes.set(service, (serviceTypes.get(service) || 0) + 1);
});

// Sort by count (descending)
const sortedComponents = Array.from(componentTypes.entries()).sort((a, b) => b[1] - a[1]);
const sortedServices = Array.from(serviceTypes.entries()).sort((a, b) => b[1] - a[1]);

console.log('📊 Harness Codebase Analysis\n');
console.log('=' .repeat(50));

console.log(`\n🔧 Component Types (${componentTypes.size} unique types):`);
console.log('-'.repeat(40));
sortedComponents.forEach(([type, count]) => {
    const percentage = ((count / data.length) * 100).toFixed(1);
    console.log(`  ${type.padEnd(15)} ${count.toString().padStart(4)} files (${percentage}%)`);
});

console.log(`\n🚀 Service Types (${serviceTypes.size} unique types):`);
console.log('-'.repeat(40));
sortedServices.forEach(([type, count]) => {
    const percentage = ((count / data.length) * 100).toFixed(1);
    console.log(`  ${type.padEnd(15)} ${count.toString().padStart(4)} files (${percentage}%)`);
});

console.log('\n' + '='.repeat(50));
console.log('\n📝 Summary:');
console.log(`  Total files analyzed: ${data.length}`);
console.log(`  Unique component types: ${componentTypes.size}`);
console.log(`  Unique service types: ${serviceTypes.size}`);
console.log(`  Most common component: ${sortedComponents[0][0]} (${sortedComponents[0][1]} files)`);
console.log(`  Most common service: ${sortedServices[0][0]} (${sortedServices[0][1]} files)`);