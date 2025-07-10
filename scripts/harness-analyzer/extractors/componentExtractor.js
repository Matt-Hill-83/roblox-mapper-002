const path = require('path');

function identifyComponent(filePath, extension) {
    const parts = filePath.split(path.sep);
    const fileName = path.basename(filePath).toLowerCase();
    
    // Check for API components
    if (filePath.includes('/api/') || filePath.includes('/rest/') || 
        fileName.includes('controller') || fileName.includes('resource') ||
        fileName.includes('endpoint') || fileName.includes('handler')) {
        return 'api';
    }
    
    // Check for UI components
    if (filePath.includes('/ui/') || filePath.includes('/web/') || 
        filePath.includes('/frontend/') || extension === '.tsx' || 
        extension === '.jsx' || fileName.includes('component')) {
        return 'ui';
    }
    
    // Check for service/business logic
    if (fileName.includes('service') || fileName.includes('manager') ||
        fileName.includes('impl') || filePath.includes('/service/')) {
        return 'service';
    }
    
    // Check for data/model components
    if (fileName.includes('model') || fileName.includes('entity') ||
        fileName.includes('dto') || fileName.includes('dao') ||
        filePath.includes('/model/') || filePath.includes('/entity/')) {
        return 'model';
    }
    
    // Check for utility components
    if (fileName.includes('util') || fileName.includes('helper') ||
        fileName.includes('common') || filePath.includes('/utils/') ||
        filePath.includes('/helpers/')) {
        return 'utils';
    }
    
    // Check for configuration
    if (fileName.includes('config') || fileName.includes('settings') ||
        extension === '.yaml' || extension === '.yml' || 
        extension === '.properties' || extension === '.json') {
        return 'config';
    }
    
    // Check for test components
    if (fileName.includes('test') || fileName.includes('spec') ||
        filePath.includes('/test/') || filePath.includes('/__tests__/')) {
        return 'test';
    }
    
    // Check for database/repository components
    if (fileName.includes('repository') || fileName.includes('repo') ||
        filePath.includes('/repository/') || filePath.includes('/db/')) {
        return 'repository';
    }
    
    // Check for security components
    if (fileName.includes('auth') || fileName.includes('security') ||
        fileName.includes('permission') || filePath.includes('/security/')) {
        return 'security';
    }
    
    // Check for messaging/events
    if (fileName.includes('event') || fileName.includes('message') ||
        fileName.includes('queue') || filePath.includes('/events/')) {
        return 'messaging';
    }
    
    // Check for client/SDK components
    if (filePath.includes('/client/') || fileName.includes('client') ||
        fileName.includes('sdk')) {
        return 'client';
    }
    
    // Check for CLI components
    if (filePath.includes('/cli/') || fileName.includes('cli') ||
        fileName.includes('command')) {
        return 'cli';
    }
    
    // Check for pipeline/workflow components
    if (fileName.includes('pipeline') || fileName.includes('workflow') ||
        fileName.includes('stage') || filePath.includes('/pipeline/')) {
        return 'pipeline';
    }
    
    // Additional checks based on common patterns
    if (extension === '.proto') return 'api';
    if (extension === '.graphql') return 'api';
    if (fileName.includes('handler')) return 'api';
    if (fileName.includes('middleware')) return 'middleware';
    if (fileName.includes('filter')) return 'middleware';
    if (fileName.includes('validator')) return 'validation';
    if (fileName.includes('converter')) return 'utils';
    if (fileName.includes('mapper')) return 'utils';
    
    return 'core'; // Default component type
}

module.exports = { identifyComponent };