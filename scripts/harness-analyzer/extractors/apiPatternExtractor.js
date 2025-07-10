const path = require('path');

function identifyApiPattern(filePath) {
    const fileName = path.basename(filePath).toLowerCase();
    const fileNameWithoutExt = fileName.replace(/\.[^.]+$/, '');
    
    // Check for specific architectural patterns
    if (fileName === 'controller.go' || fileNameWithoutExt.endsWith('controller')) {
        return 'controller';
    }
    
    if (fileName === 'wire.go' || fileNameWithoutExt === 'wire') {
        return 'dependency-injection';
    }
    
    if (fileName === 'types.go' || fileNameWithoutExt === 'types' || fileNameWithoutExt.includes('model')) {
        return 'data-model';
    }
    
    if (fileNameWithoutExt.includes('test') || fileNameWithoutExt.includes('spec')) {
        return 'test';
    }
    
    if (fileNameWithoutExt.includes('helper') || fileNameWithoutExt.includes('util')) {
        return 'utility';
    }
    
    if (fileNameWithoutExt.includes('error') || fileNameWithoutExt.includes('exception')) {
        return 'error-handling';
    }
    
    if (fileNameWithoutExt.includes('auth') || fileNameWithoutExt.includes('permission')) {
        return 'authentication';
    }
    
    if (fileNameWithoutExt.includes('client') || fileNameWithoutExt.includes('sdk')) {
        return 'client';
    }
    
    if (fileNameWithoutExt.includes('middleware')) {
        return 'middleware';
    }
    
    if (fileNameWithoutExt.includes('validator') || fileNameWithoutExt.includes('sanitiz')) {
        return 'validation';
    }
    
    if (fileNameWithoutExt.includes('handler') || fileNameWithoutExt.includes('endpoint')) {
        return 'request-handler';
    }
    
    if (fileNameWithoutExt.includes('service') || fileNameWithoutExt.includes('manager')) {
        return 'business-logic';
    }
    
    if (fileNameWithoutExt.includes('repository') || fileNameWithoutExt.includes('dao')) {
        return 'data-access';
    }
    
    // Check for CRUD pattern files
    const crudOps = ['create', 'read', 'update', 'delete', 'list', 'find', 'get'];
    if (crudOps.some(op => fileNameWithoutExt.includes(op))) {
        return 'crud-operation';
    }
    
    // Check for git operation patterns
    const gitOps = ['commit', 'branch', 'merge', 'pull', 'push', 'diff', 'blame'];
    if (gitOps.some(op => fileNameWithoutExt.includes(op))) {
        return 'git-operation';
    }
    
    return 'general-api';
}

module.exports = { identifyApiPattern };