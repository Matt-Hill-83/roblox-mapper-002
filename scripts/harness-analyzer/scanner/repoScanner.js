const fs = require('fs');
const path = require('path');
const { analyzeFile } = require('./fileAnalyzer');

async function scanRepository(repoPath, options = {}) {
    console.log(`📂 Scanning repository: ${repoPath}`);
    
    const files = [];
    const fileExtensions = new Set();
    const directories = new Set();
    
    // Recursively scan directory
    function traverseDirectory(dirPath, depth = 0) {
        if (depth > 15) return; // Increased depth limit
        
        try {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const relativePath = path.relative(repoPath, fullPath);
                
                // Skip certain directories
                if (item === 'node_modules' || item === 'vendor' || item === 'target' || 
                    item === '.git' || item === 'dist' || item === 'build') {
                    continue;
                }
                
                const stats = fs.statSync(fullPath);
                
                if (stats.isDirectory()) {
                    directories.add(relativePath.split(path.sep)[0]);
                    traverseDirectory(fullPath, depth + 1);
                } else if (stats.isFile()) {
                    const ext = path.extname(item).toLowerCase();
                    if (ext) fileExtensions.add(ext);
                    
                    // Collect file info
                    files.push({
                        path: relativePath,
                        fullPath: fullPath,
                        size: stats.size,
                        extension: ext,
                        directory: path.dirname(relativePath)
                    });
                    
                    // Don't stop early during traversal
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not read directory ${dirPath}:`, error.message);
        }
    }
    
    traverseDirectory(repoPath);
    
    if (options.phase === 'analysis') {
        // Print initial analysis
        console.log(`\n📊 Repository Structure Analysis:`);
        console.log(`Total files found: ${files.length}`);
        console.log(`\nTop-level directories: ${Array.from(directories).slice(0, 10).join(', ')}`);
        console.log(`\nFile extensions found: ${Array.from(fileExtensions).slice(0, 15).join(', ')}`);
        
        // Sample service detection
        const services = detectServices(files);
        console.log(`\nDetected services: ${services.join(', ')}`);
    }
    
    // Analyze files
    const analyzedFiles = [];
    const filesToAnalyze = files.slice(0, options.limit || 200);
    for (const file of filesToAnalyze) {
        const analysis = analyzeFile(file, repoPath, files);
        analyzedFiles.push(analysis);
    }
    
    return analyzedFiles;
}

function detectServices(files) {
    const services = new Set();
    
    files.forEach(file => {
        const parts = file.path.split(path.sep);
        
        // Common service patterns in Harness
        if (parts[0] === '960-api-services' || parts[0] === '120-ng-manager') {
            services.add('platform');
        } else if (parts[0] === '332-ci-manager' || parts[0] === '310-ci-manager') {
            services.add('ci');
        } else if (parts[0] === '125-cd-nextgen' || parts[0] === '100-cd-nextgen') {
            services.add('cd');
        } else if (parts[0] === '270-ce-nextgen' || parts[0] === '450-ce-views') {
            services.add('ce');
        } else if (parts[0] === '950-events-framework' || parts[0] === '940-notification-service') {
            services.add('common');
        } else if (parts[0] === 'product' || parts[0] === 'platform-service') {
            services.add(parts[0]);
        }
    });
    
    // Add default if no services detected
    if (services.size === 0) {
        services.add('core');
    }
    
    return Array.from(services);
}

module.exports = { scanRepository };