const path = require('path');

function identifyResourceDomain(filePath) {
    const parts = filePath.split(path.sep);
    
    // Look for controller pattern: app/api/controller/{resource}/...
    if (parts.length > 3 && parts[2] === 'controller') {
        const resource = parts[3];
        
        // Map to cleaner names
        const resourceMap = {
            'pullreq': 'pullreq',
            'repo': 'repository',
            'gitspace': 'gitspace',
            'githook': 'webhook',
            'migrate': 'migration',
            'lfs': 'storage',
            'check': 'validation',
            'execution': 'execution',
            'infraprovider': 'infrastructure',
            'connector': 'connector',
            'principal': 'identity',
            'pipeline': 'pipeline',
            'logs': 'logging',
            'limiter': 'ratelimit',
            'keywordsearch': 'search',
            'plugin': 'plugin'
        };
        
        return resourceMap[resource] || resource;
    }
    
    // Fallback: try to infer from path
    const fileName = path.basename(filePath).toLowerCase();
    
    if (fileName.includes('auth')) return 'auth';
    if (fileName.includes('user')) return 'identity';
    if (fileName.includes('webhook')) return 'webhook';
    if (fileName.includes('pipeline')) return 'pipeline';
    if (fileName.includes('repo')) return 'repository';
    if (fileName.includes('pull')) return 'pullreq';
    if (fileName.includes('git')) return 'git';
    if (fileName.includes('space')) return 'workspace';
    
    return 'general';
}

module.exports = { identifyResourceDomain };