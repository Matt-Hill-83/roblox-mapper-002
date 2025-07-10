const path = require('path');

function identifyOperationType(filePath) {
    const fileName = path.basename(filePath).toLowerCase();
    const fileNameWithoutExt = fileName.replace(/\.[^.]+$/, '');
    
    // Priority order matters - check most specific patterns first
    
    // CRUD operations
    if (fileNameWithoutExt.includes('create') || fileNameWithoutExt.includes('_add')) return 'create';
    if (fileNameWithoutExt.includes('update') || fileNameWithoutExt.includes('_edit')) return 'update';
    if (fileNameWithoutExt.includes('delete') || fileNameWithoutExt.includes('_remove')) return 'delete';
    if (fileNameWithoutExt.includes('list') || fileNameWithoutExt.includes('_all')) return 'list';
    if (fileNameWithoutExt.includes('find') || fileNameWithoutExt.includes('get_')) return 'read';
    if (fileNameWithoutExt.includes('search')) return 'search';
    
    // Git operations
    if (fileNameWithoutExt.includes('commit')) return 'commit';
    if (fileNameWithoutExt.includes('branch')) return 'branch';
    if (fileNameWithoutExt.includes('merge')) return 'merge';
    if (fileNameWithoutExt.includes('diff')) return 'diff';
    if (fileNameWithoutExt.includes('blame')) return 'blame';
    if (fileNameWithoutExt.includes('tag')) return 'tag';
    if (fileNameWithoutExt.includes('pull') || fileNameWithoutExt.includes('pr_')) return 'pullrequest';
    
    // Special operations
    if (fileNameWithoutExt.includes('import')) return 'import';
    if (fileNameWithoutExt.includes('export')) return 'export';
    if (fileNameWithoutExt.includes('sync')) return 'sync';
    if (fileNameWithoutExt.includes('validate')) return 'validate';
    if (fileNameWithoutExt.includes('auth')) return 'auth';
    if (fileNameWithoutExt.includes('upload')) return 'upload';
    if (fileNameWithoutExt.includes('download')) return 'download';
    if (fileNameWithoutExt.includes('cancel')) return 'cancel';
    if (fileNameWithoutExt.includes('submit')) return 'submit';
    if (fileNameWithoutExt.includes('review')) return 'review';
    if (fileNameWithoutExt.includes('approve')) return 'approve';
    if (fileNameWithoutExt.includes('reject')) return 'reject';
    
    // Infrastructure patterns
    if (fileNameWithoutExt.includes('controller')) return 'controller';
    if (fileNameWithoutExt.includes('wire')) return 'config';
    if (fileNameWithoutExt.includes('helper')) return 'utility';
    if (fileNameWithoutExt.includes('types')) return 'types';
    if (fileNameWithoutExt.includes('error')) return 'error';
    if (fileNameWithoutExt.includes('test')) return 'test';
    
    return 'general';
}

module.exports = { identifyOperationType };