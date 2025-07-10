function detectLanguage(extension, filePath) {
    // Map file extensions to languages
    const languageMap = {
        // Java
        '.java': 'java',
        '.kt': 'kotlin',
        '.scala': 'scala',
        
        // JavaScript/TypeScript
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.mjs': 'javascript',
        
        // Go
        '.go': 'go',
        
        // Python
        '.py': 'python',
        '.pyw': 'python',
        '.pyi': 'python',
        
        // Web
        '.html': 'html',
        '.htm': 'html',
        '.css': 'css',
        '.scss': 'css',
        '.sass': 'css',
        '.less': 'css',
        
        // Shell/Scripts
        '.sh': 'shell',
        '.bash': 'shell',
        '.zsh': 'shell',
        '.ps1': 'powershell',
        '.bat': 'batch',
        '.cmd': 'batch',
        
        // Configuration
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.json': 'json',
        '.xml': 'xml',
        '.properties': 'properties',
        '.toml': 'toml',
        '.ini': 'ini',
        
        // Documentation
        '.md': 'markdown',
        '.rst': 'restructuredtext',
        '.txt': 'text',
        
        // Build files
        '.gradle': 'gradle',
        '.maven': 'maven',
        '.bazel': 'bazel',
        
        // Other
        '.proto': 'protobuf',
        '.sql': 'sql',
        '.graphql': 'graphql',
        '.dockerfile': 'docker',
        '.tf': 'terraform',
        '.rb': 'ruby',
        '.php': 'php',
        '.c': 'c',
        '.cpp': 'cpp',
        '.h': 'c',
        '.hpp': 'cpp',
        '.rs': 'rust',
        '.swift': 'swift',
        '.m': 'objectivec',
        '.r': 'r'
    };
    
    // Check extension mapping
    const lang = languageMap[extension.toLowerCase()];
    if (lang) return lang;
    
    // Check special file names
    const fileName = filePath.split('/').pop().toLowerCase();
    if (fileName === 'dockerfile') return 'docker';
    if (fileName === 'makefile') return 'make';
    if (fileName === 'jenkinsfile') return 'groovy';
    if (fileName === 'rakefile') return 'ruby';
    if (fileName === 'gemfile') return 'ruby';
    if (fileName === 'package.json') return 'json';
    if (fileName === 'pom.xml') return 'xml';
    if (fileName === 'build.gradle') return 'gradle';
    
    return 'other'; // Default for unknown extensions
}

module.exports = { detectLanguage };