function calculateApiComplexity(sizeInBytes, operationType) {
    const kb = sizeInBytes / 1024;
    
    // Base complexity on file size
    let sizeScore = 0;
    if (kb < 5) sizeScore = 1;      // Very small
    else if (kb < 20) sizeScore = 2; // Small
    else if (kb < 50) sizeScore = 3; // Medium
    else if (kb < 100) sizeScore = 4; // Large
    else sizeScore = 5;              // Very large
    
    // Adjust based on operation type complexity
    const complexOperations = [
        'merge', 'import', 'export', 'sync', 'migrate',
        'pullrequest', 'review', 'validate', 'controller'
    ];
    
    const simpleOperations = [
        'read', 'list', 'delete', 'types', 'error',
        'config', 'general'
    ];
    
    const moderateOperations = [
        'create', 'update', 'search', 'auth',
        'upload', 'download', 'utility'
    ];
    
    let operationScore = 2; // default moderate
    if (complexOperations.includes(operationType)) {
        operationScore = 3;
    } else if (simpleOperations.includes(operationType)) {
        operationScore = 1;
    }
    
    // Calculate final complexity
    const totalScore = sizeScore + operationScore;
    
    if (totalScore <= 3) return 'simple';
    if (totalScore <= 5) return 'moderate';
    if (totalScore <= 7) return 'complex';
    return 'very-complex';
}

module.exports = { calculateApiComplexity };