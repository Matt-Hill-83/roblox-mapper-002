function inferHttpMethod(operationType, filePath) {
    const fileName = filePath.toLowerCase();
    
    // Direct mappings based on operation type
    const operationMethodMap = {
        // GET methods
        'read': 'GET',
        'list': 'GET',
        'search': 'GET',
        'find': 'GET',
        'download': 'GET',
        'export': 'GET',
        'diff': 'GET',
        'blame': 'GET',
        'types': 'GET',
        'controller': 'MULTIPLE',
        
        // POST methods
        'create': 'POST',
        'import': 'POST',
        'upload': 'POST',
        'submit': 'POST',
        'auth': 'POST',
        'validate': 'POST',
        'review': 'POST',
        'approve': 'POST',
        'reject': 'POST',
        'merge': 'POST',
        'commit': 'POST',
        
        // PUT methods
        'update': 'PUT',
        'sync': 'PUT',
        
        // DELETE methods
        'delete': 'DELETE',
        'cancel': 'DELETE',
        
        // PATCH methods
        'tag': 'PATCH',
        'branch': 'PATCH',
        
        // Mixed/Multiple
        'pullrequest': 'MULTIPLE',
        'config': 'MULTIPLE',
        'utility': 'INTERNAL',
        'error': 'INTERNAL',
        'test': 'TEST',
        'general': 'UNKNOWN'
    };
    
    // Check filename for additional hints
    if (fileName.includes('_get') || fileName.includes('get_')) return 'GET';
    if (fileName.includes('_post') || fileName.includes('post_')) return 'POST';
    if (fileName.includes('_put') || fileName.includes('put_')) return 'PUT';
    if (fileName.includes('_delete') || fileName.includes('delete_')) return 'DELETE';
    if (fileName.includes('_patch') || fileName.includes('patch_')) return 'PATCH';
    
    // Return mapped method or default
    return operationMethodMap[operationType] || 'UNKNOWN';
}

module.exports = { inferHttpMethod };