/**
 * Main Demo Script
 * Orchestrates the complete hierarchical graph 2D demo
 */

const { generateFakeData } = require('./src/dataGenerator');
const { findConnectedGroups } = require('./src/analyzer');
const { position2D } = require('./src/positioner');
const { displayResults } = require('./src/visualizer');
const { renderAndSaveASCII } = require('./src/asciiRenderer');

/**
 * Main function that runs the complete demo
 */
function main() {
    console.log("=== Hierarchical Graph 2D Demo ===");
    console.log("🚀 Starting demo...\n");
    
    try {
        // Step 1: Generate fake hierarchical data
        console.log("📊 Step 1: Generating fake hierarchical data...");
        const entities = generateFakeData();
        console.log(`Generated ${entities.length} entities`);
        
        // Step 2: Analyze connections and find separate trees
        console.log("\n🔍 Step 2: Analyzing connections...");
        const groups = findConnectedGroups(entities);
        console.log(`Found ${groups.length} connected groups`);
        
        // Display group metrics
        groups.forEach(group => {
            console.log(`  ${group.id}: ${group.metrics.totalEntities} entities, depth ${group.metrics.depth}`);
        });
        
        // Step 3: Calculate 2D positions
        console.log("\n📐 Step 3: Calculating 2D positions...");
        const positioned = position2D(groups);
        console.log(`Positioned ${positioned.length} entities in 2D space`);
        
        // Step 4: Display results
        console.log("\n🎨 Step 4: Displaying results...");
        displayResults(positioned);
        
        // Step 5: Generate and save ASCII rendering
        console.log("\n🎨 Step 5: Generating ASCII map...");
        const asciiPath = renderAndSaveASCII(positioned, groups);
        console.log(`ASCII map saved successfully!`);
        
        console.log("\n✅ Demo completed successfully!");
        
    } catch (error) {
        console.error("❌ Demo failed:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the demo if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { main };