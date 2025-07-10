const path = require('path');

function classifyType(filePath, extension) {
    const fileName = path.basename(filePath).toLowerCase();
    const dirPath = filePath.toLowerCase();
    
    // Check for test files
    if (fileName.includes('test') || fileName.includes('spec') || 
        fileName.includes('_test') || fileName.includes('.test.') ||
        dirPath.includes('/test/') || dirPath.includes('/__tests__/') ||
        dirPath.includes('/tests/')) {
        return 'test';
    }
    
    // Check for documentation
    if (extension === '.md' || extension === '.rst' || extension === '.txt' ||
        dirPath.includes('/docs/') || dirPath.includes('/documentation/')) {
        return 'docs';
    }
    
    // Check for configuration files
    if (extension === '.yaml' || extension === '.yml' || extension === '.json' ||
        extension === '.xml' || extension === '.properties' || extension === '.toml' ||
        extension === '.ini' || fileName.includes('config') || 
        dirPath.includes('/config/') || dirPath.includes('/settings/')) {
        return 'config';
    }
    
    // Check for build/deployment files
    if (fileName === 'dockerfile' || fileName === 'makefile' || 
        fileName === 'jenkinsfile' || extension === '.gradle' ||
        fileName === 'pom.xml' || fileName === 'package.json' ||
        dirPath.includes('/build/') || dirPath.includes('/deploy/')) {
        return 'build';
    }
    
    // Check for database/migration files
    if (extension === '.sql' || dirPath.includes('/migrations/') ||
        dirPath.includes('/db/') || fileName.includes('migration')) {
        return 'database';
    }
    
    // Check for API definitions
    if (extension === '.proto' || extension === '.graphql' ||
        fileName.includes('swagger') || fileName.includes('openapi') ||
        dirPath.includes('/proto/') || dirPath.includes('/api/')) {
        return 'api-def';
    }
    
    // Check for static assets
    if (extension === '.png' || extension === '.jpg' || extension === '.jpeg' ||
        extension === '.gif' || extension === '.svg' || extension === '.ico' ||
        extension === '.css' || extension === '.scss' || extension === '.less' ||
        dirPath.includes('/assets/') || dirPath.includes('/static/')) {
        return 'asset';
    }
    
    // Check for scripts
    if (extension === '.sh' || extension === '.bash' || extension === '.ps1' ||
        extension === '.bat' || dirPath.includes('/scripts/')) {
        return 'script';
    }
    
    // Default to source code
    return 'source';
}

module.exports = { classifyType };