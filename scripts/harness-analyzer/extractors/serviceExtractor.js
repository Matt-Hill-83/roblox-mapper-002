const path = require('path');

function identifyService(filePath) {
    const parts = filePath.split(path.sep);
    const firstDir = parts[0];
    
    // Map directory patterns to services
    const serviceMap = {
        // Platform services
        '960-api-services': 'platform',
        '120-ng-manager': 'platform',
        '100-cd-nextgen': 'platform',
        'platform-service': 'platform',
        
        // CI services
        '332-ci-manager': 'ci',
        '310-ci-manager': 'ci',
        'ci-manager': 'ci',
        
        // CD services
        '125-cd-nextgen': 'cd',
        'cd-nextgen': 'cd',
        'deployment': 'cd',
        
        // CE (Cloud Cost) services
        '270-ce-nextgen': 'ce',
        '450-ce-views': 'ce',
        'cost-management': 'ce',
        
        // Common/Framework services
        '950-events-framework': 'common',
        '940-notification-service': 'common',
        '980-commons': 'common',
        'commons': 'common',
        
        // Feature flags
        'ff-service': 'ff',
        'feature-flag': 'ff',
        
        // Security/Governance
        'sto-manager': 'security',
        'governance': 'governance',
        
        // Default mappings
        'scripts': 'tools',
        'tools': 'tools',
        'product': 'product'
    };
    
    // Check for service mapping
    for (const [pattern, service] of Object.entries(serviceMap)) {
        if (firstDir.includes(pattern) || filePath.includes(pattern)) {
            return service;
        }
    }
    
    // Fallback service detection based on path contents
    if (filePath.includes('test')) return 'test';
    if (filePath.includes('build')) return 'build';
    if (filePath.includes('docs')) return 'docs';
    
    // Additional fallback based on directory depth and patterns
    const dirs = parts.filter(p => p && !p.includes('.'));
    if (dirs.length > 0) {
        // Use first significant directory as service hint
        if (dirs[0].includes('app')) return 'platform';
        if (dirs[0].includes('web')) return 'platform';
        if (dirs[0].includes('git')) return 'ci';
        if (dirs[0].includes('job')) return 'cd';
        if (dirs[0].includes('stream')) return 'common';
        if (dirs[0].includes('store')) return 'common';
        if (dirs[0].includes('event')) return 'common';
        if (dirs[0].includes('infra')) return 'ce';
        if (dirs[0].includes('secret')) return 'security';
        if (dirs[0].includes('encrypt')) return 'security';
        if (dirs[0].includes('audit')) return 'governance';
    }
    
    return 'core'; // Default service
}

module.exports = { identifyService };