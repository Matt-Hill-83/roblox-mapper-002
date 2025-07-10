#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { scanRepository } = require('./scanner/repoScanner');
const { generateDataset } = require('./output/jsonGenerator');

async function main() {
    console.log('🚀 Starting Harness Repository Analysis...\n');
    
    const repoPath = path.join(__dirname, '..', '..', 'harness', 'harness');
    const outputPath = path.join(__dirname, '..', '..', 'data', 'harness-files.json');
    
    try {
        // Phase 1: Initial scan
        console.log('Phase 1: Initial Repository Analysis');
        console.log('=====================================');
        const analysisResults = await scanRepository(repoPath, { phase: 'analysis', limit: 50 });
        
        // Phase 2: Full scan
        console.log('\nPhase 2: Full Repository Scan');
        console.log('==============================');
        const fullResults = await scanRepository(repoPath, { phase: 'full', limit: 200 });
        
        // Generate dataset
        console.log('\n📝 Generating JSON dataset...');
        const dataset = generateDataset(fullResults);
        
        // Save results
        fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
        console.log(`\n✅ Success! Generated ${dataset.length} file objects`);
        console.log(`📄 Output saved to: ${outputPath}`);
        
        // Print summary
        printSummary(dataset);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

function printSummary(dataset) {
    console.log('\n📊 Dataset Summary');
    console.log('==================');
    
    const properties = ['service', 'component', 'language', 'size', 'type'];
    
    properties.forEach(prop => {
        const distribution = {};
        dataset.forEach(item => {
            const value = item[prop];
            distribution[value] = (distribution[value] || 0) + 1;
        });
        
        console.log(`\n${prop.charAt(0).toUpperCase() + prop.slice(1)}:`);
        Object.entries(distribution)
            .sort((a, b) => b[1] - a[1])
            .forEach(([key, count]) => {
                console.log(`  ${key}: ${count}`);
            });
    });
}

// Execute if run directly
if (require.main === module) {
    main();
}

module.exports = { main };