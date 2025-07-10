#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the data files
const linksPath = path.join(__dirname, '..', '..', 'data', 'harness-links.json');
const filesPath = path.join(__dirname, '..', '..', 'data', 'harness-files.json');
const outputPath = path.join(__dirname, '..', '..', 'src', 'shared', 'data', 'tempHarnessLinks.ts');

// Load JSON data
const linksData = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
const filesData = JSON.parse(fs.readFileSync(filesPath, 'utf8'));

// Create a map of file paths to indices (which we'll use as node IDs)
const filePathToNodeId = new Map();
filesData.forEach((file, index) => {
    filePathToNodeId.set(file.path, `harness_node_${index}`);
});

// Define colors for each link type
const linkTypeColors = {
    'import-dependency': [0.2, 0.4, 0.8],      // Blue
    'api-endpoint': [0.8, 0.2, 0.2],           // Red
    'test-coverage': [0.2, 0.8, 0.2],          // Green
    'component-hierarchy': [0.8, 0.6, 0.2],    // Orange
    'service-communication': [0.6, 0.2, 0.8]   // Purple
};

// Convert link types to simpler names
const linkTypeMapping = {
    'import-dependency': 'Import',
    'api-endpoint': 'API',
    'test-coverage': 'Test',
    'component-hierarchy': 'Hierarchy',
    'service-communication': 'Service'
};

// Take first 1000 links (or all if less than 1000)
const linksToConvert = linksData.links.slice(0, 1000);

// Convert links to TypeScript format
const tsLinks = linksToConvert
    .map((link, index) => {
        const sourceNodeId = filePathToNodeId.get(link.source);
        const targetNodeId = filePathToNodeId.get(link.target);
        
        // Skip if we can't find the nodes (shouldn't happen with our data)
        if (!sourceNodeId || !targetNodeId) {
            console.warn(`Warning: Could not find node for link ${link.source} → ${link.target}`);
            return null;
        }
        
        const linkType = linkTypeMapping[link.type] || link.type;
        const color = linkTypeColors[link.type] || [0.5, 0.5, 0.5];
        
        return {
            uuid: `harness_link_${index + 1}`,
            type: linkType,
            sourceNodeUuid: sourceNodeId,
            targetNodeUuid: targetNodeId,
            color: color,
            // Additional metadata
            confidence: link.confidence,
            direction: link.direction,
            reason: link.reason
        };
    })
    .filter(link => link !== null);

// Generate TypeScript file content
const tsContent = `/**
 * Harness repository link data
 * Generated from harness-links.json
 * Contains ${tsLinks.length} links between Harness repository files
 */

import { Link } from "../../interfaces/simpleDataGenerator.interface";

// Extended interface with additional metadata
export interface HarnessLink extends Link {
  confidence?: number;
  direction?: string;
  reason?: string;
}

export const TEMP_HARNESS_LINKS: HarnessLink[] = ${JSON.stringify(tsLinks, null, 2)
    .replace(/"uuid":/g, 'uuid:')
    .replace(/"type":/g, 'type:')
    .replace(/"sourceNodeUuid":/g, 'sourceNodeUuid:')
    .replace(/"targetNodeUuid":/g, 'targetNodeUuid:')
    .replace(/"color":/g, 'color:')
    .replace(/"confidence":/g, 'confidence:')
    .replace(/"direction":/g, 'direction:')
    .replace(/"reason":/g, 'reason:')};

// Summary statistics
export const HARNESS_LINK_STATS = {
  totalLinks: ${tsLinks.length},
  linkTypes: {
    Import: ${tsLinks.filter(l => l.type === 'Import').length},
    API: ${tsLinks.filter(l => l.type === 'API').length},
    Test: ${tsLinks.filter(l => l.type === 'Test').length},
    Hierarchy: ${tsLinks.filter(l => l.type === 'Hierarchy').length},
    Service: ${tsLinks.filter(l => l.type === 'Service').length}
  },
  averageConfidence: ${(tsLinks.reduce((sum, l) => sum + l.confidence, 0) / tsLinks.length).toFixed(2)}
};
`;

// Write the TypeScript file
fs.writeFileSync(outputPath, tsContent);

console.log(`✅ Successfully converted ${tsLinks.length} links to TypeScript`);
console.log(`📄 Output saved to: ${outputPath}`);
console.log('\n📊 Link Type Distribution:');
Object.entries(linkTypeMapping).forEach(([original, simplified]) => {
    const count = tsLinks.filter(l => l.type === simplified).length;
    console.log(`  ${simplified}: ${count}`);
});