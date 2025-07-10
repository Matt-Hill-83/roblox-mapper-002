#!/usr/bin/env node

/**
 * Script to convert harness-files.json to TypeScript format
 * Reads all data from data/harness-files.json and writes to src/shared/data/tempHarnessTestData.ts
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/harness-files.json');
const OUTPUT_FILE = path.join(__dirname, '../src/shared/data/tempHarnessTestData.ts');

function convertJsonToTypeScript() {
  try {
    console.log('Reading harness-files.json...');
    
    // Read the JSON file
    const jsonData = fs.readFileSync(INPUT_FILE, 'utf8');
    const harnessFiles = JSON.parse(jsonData);
    
    console.log(`Found ${harnessFiles.length} files in JSON data`);
    
    // Generate TypeScript content
    const tsContent = `/**
 * Temporary Harness test data extracted from harness-files.json
 * This data represents real Harness repository files for testing visualization
 * Generated automatically from ${harnessFiles.length} files
 */

export interface HarnessFileData {
  path: string;
  service: string;
  component: string;
  language: string;
  size: string;
  type: string;
  resourceDomain: string;
  operationType: string;
  apiPattern: string;
  apiComplexity: string;
  httpMethod: string;
  directoryDepth: string;
  fileExtension: string;
  testStatus: string;
  importCount: string;
  exportCount: string;
  lineCount: string;
  commentDensity: string;
  lastModified: string;
  moduleType: string;
  complexityScore: string;
}

export const TEMP_HARNESS_TEST_DATA: HarnessFileData[] = ${JSON.stringify(harnessFiles, null, 2)};
`;

    // Write the TypeScript file
    console.log('Writing TypeScript file...');
    fs.writeFileSync(OUTPUT_FILE, tsContent);
    
    console.log(`✅ Successfully converted ${harnessFiles.length} files`);
    console.log(`📁 Output: ${OUTPUT_FILE}`);
    
    // Show some stats
    const services = new Set(harnessFiles.map(f => f.service));
    const components = new Set(harnessFiles.map(f => f.component));
    const languages = new Set(harnessFiles.map(f => f.language));
    
    console.log(`\n📊 Data Summary:`);
    console.log(`   Services: ${services.size} (${Array.from(services).join(', ')})`);
    console.log(`   Components: ${components.size} (${Array.from(components).join(', ')})`);
    console.log(`   Languages: ${languages.size} (${Array.from(languages).join(', ')})`);
    
  } catch (error) {
    console.error('❌ Error converting data:', error.message);
    process.exit(1);
  }
}

// Run the conversion
convertJsonToTypeScript();