#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the harness files data
const dataPath = path.join(__dirname, '..', '..', 'data', 'harness-files.json');
const harnessFiles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Create a map for quick lookup
const fileMap = new Map();
harnessFiles.forEach(file => {
    fileMap.set(file.path, file);
});

// Link detection functions
const linkDetectors = {
    // 1. Import/Dependency Links (most useful)
    importDependency: function(file1, file2) {
        // For Go files, check if they're in the same package or related packages
        if (file1.language === 'go' && file2.language === 'go') {
            const pkg1 = getPackageFromPath(file1.path);
            const pkg2 = getPackageFromPath(file2.path);
            
            // Check if one might import the other based on directory structure
            if (couldImport(pkg1, pkg2)) {
                return {
                    type: 'import-dependency',
                    confidence: 0.7,
                    direction: 'unidirectional',
                    reason: `Potential import from ${pkg1} to ${pkg2}`
                };
            }
        }
        return null;
    },

    // 2. API Endpoint Relationships
    apiEndpoint: function(file1, file2) {
        // Controller to Service relationships
        if (file1.component === 'api' && file2.component === 'service' && 
            file1.resourceDomain === file2.resourceDomain) {
            return {
                type: 'api-endpoint',
                confidence: 0.8,
                direction: 'unidirectional',
                reason: `API controller to service for ${file1.resourceDomain}`
            };
        }
        
        // Repository pattern connections
        if (file1.component === 'service' && file2.component === 'repository' &&
            file1.resourceDomain === file2.resourceDomain) {
            return {
                type: 'api-endpoint',
                confidence: 0.8,
                direction: 'unidirectional',
                reason: `Service to repository for ${file1.resourceDomain}`
            };
        }
        
        return null;
    },

    // 3. Test Coverage Links
    testCoverage: function(file1, file2) {
        // Check if file2 is a test of file1
        const base1 = path.basename(file1.path, path.extname(file1.path));
        const base2 = path.basename(file2.path, path.extname(file2.path));
        
        if (base2 === base1 + '_test' && path.dirname(file1.path) === path.dirname(file2.path)) {
            return {
                type: 'test-coverage',
                confidence: 0.95,
                direction: 'bidirectional',
                reason: `Test file for ${base1}`
            };
        }
        
        // Check testStatus property
        if (file1.testStatus === 'has-tests' && file2.path.includes('test') &&
            file1.resourceDomain === file2.resourceDomain) {
            return {
                type: 'test-coverage',
                confidence: 0.6,
                direction: 'bidirectional',
                reason: 'Potential test relationship'
            };
        }
        
        return null;
    },

    // 4. Component Hierarchy Links
    componentHierarchy: function(file1, file2) {
        const hierarchy = ['ui', 'api', 'service', 'repository', 'database'];
        const idx1 = hierarchy.indexOf(file1.component);
        const idx2 = hierarchy.indexOf(file2.component);
        
        // Check if they follow the hierarchy pattern
        if (idx1 >= 0 && idx2 >= 0 && Math.abs(idx1 - idx2) === 1 &&
            file1.resourceDomain === file2.resourceDomain) {
            return {
                type: 'component-hierarchy',
                confidence: 0.75,
                direction: 'unidirectional',
                reason: `${file1.component} → ${file2.component} layer connection`
            };
        }
        
        return null;
    },

    // 5. Service Communication Links
    serviceCommunication: function(file1, file2) {
        // Different services communicating
        if (file1.service !== file2.service && 
            file1.component === 'api' && file2.component === 'api') {
            // Check for client/server patterns
            if (file1.path.includes('client') || file2.path.includes('client')) {
                return {
                    type: 'service-communication',
                    confidence: 0.65,
                    direction: 'unidirectional',
                    reason: `Cross-service communication: ${file1.service} → ${file2.service}`
                };
            }
        }
        
        // gRPC or REST client patterns
        if ((file1.apiPattern === 'grpc-service' && file2.apiPattern === 'grpc-client') ||
            (file1.apiPattern === 'rest-api' && file2.apiPattern === 'rest-client')) {
            return {
                type: 'service-communication',
                confidence: 0.8,
                direction: 'unidirectional',
                reason: `${file1.apiPattern} to ${file2.apiPattern}`
            };
        }
        
        return null;
    }
};

// Helper functions
function getPackageFromPath(filePath) {
    const parts = filePath.split('/');
    return parts.slice(0, -1).join('/');
}

function couldImport(pkg1, pkg2) {
    // Simple heuristic: packages in the same service can import each other
    const service1 = pkg1.split('/')[0];
    const service2 = pkg2.split('/')[0];
    
    if (service1 === service2) {
        // Check if pkg2 is a subpackage or sibling of pkg1
        return pkg2.startsWith(pkg1) || pkg1.startsWith(pkg2) ||
               pkg1.split('/').slice(0, -1).join('/') === pkg2.split('/').slice(0, -1).join('/');
    }
    
    // Common packages can be imported by anyone
    return pkg2.includes('common') || pkg2.includes('util') || pkg2.includes('shared');
}

// Main detection logic
function detectLinks() {
    const links = [];
    const linkCounts = {
        'import-dependency': 0,
        'api-endpoint': 0,
        'test-coverage': 0,
        'component-hierarchy': 0,
        'service-communication': 0
    };
    
    // Compare each file with every other file
    for (let i = 0; i < harnessFiles.length; i++) {
        for (let j = i + 1; j < harnessFiles.length; j++) {
            const file1 = harnessFiles[i];
            const file2 = harnessFiles[j];
            
            // Run all detectors
            for (const [name, detector] of Object.entries(linkDetectors)) {
                const link = detector(file1, file2);
                if (link) {
                    links.push({
                        source: file1.path,
                        target: file2.path,
                        ...link
                    });
                    linkCounts[link.type]++;
                }
            }
        }
    }
    
    return { links, linkCounts };
}

// Run the detection
console.log('🔍 Detecting links between Harness files...\n');
const { links, linkCounts } = detectLinks();

// Sort links by confidence
links.sort((a, b) => b.confidence - a.confidence);

// Print summary
console.log('📊 Link Detection Summary');
console.log('========================\n');
console.log('Total files analyzed:', harnessFiles.length);
console.log('Total links found:', links.length);
console.log('\nLinks by type:');
Object.entries(linkCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
    });

// Print top links by type
console.log('\n📌 Top Links by Type');
console.log('====================');

const types = ['import-dependency', 'api-endpoint', 'test-coverage', 'component-hierarchy', 'service-communication'];
types.forEach(type => {
    const typeLinks = links.filter(l => l.type === type).slice(0, 5);
    if (typeLinks.length > 0) {
        console.log(`\n${type.toUpperCase()} (showing top ${Math.min(5, typeLinks.length)})`);
        typeLinks.forEach(link => {
            console.log(`  ${link.source} → ${link.target}`);
            console.log(`    Confidence: ${(link.confidence * 100).toFixed(0)}% | ${link.reason}`);
        });
    }
});

// Save results
const outputPath = path.join(__dirname, '..', '..', 'data', 'harness-links.json');
fs.writeFileSync(outputPath, JSON.stringify({ links, linkCounts, metadata: {
    generatedAt: new Date().toISOString(),
    totalFiles: harnessFiles.length,
    totalLinks: links.length
}}, null, 2));

console.log(`\n✅ Results saved to: ${outputPath}`);