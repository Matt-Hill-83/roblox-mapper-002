const path = require('path');
const fs = require('fs');
const { identifyService } = require('../extractors/serviceExtractor');
const { identifyComponent } = require('../extractors/componentExtractor');
const { detectLanguage } = require('../extractors/languageExtractor');
const { categorizeSize } = require('../extractors/sizeExtractor');
const { classifyType } = require('../extractors/typeExtractor');
const { identifyResourceDomain } = require('../extractors/resourceDomainExtractor');
const { identifyOperationType } = require('../extractors/operationTypeExtractor');
const { identifyApiPattern } = require('../extractors/apiPatternExtractor');
const { calculateApiComplexity } = require('../extractors/apiComplexityExtractor');
const { inferHttpMethod } = require('../extractors/httpMethodExtractor');
const { 
    getDirectoryDepth,
    getFileExtension,
    hasTests,
    countImports,
    countExports,
    getLineCount,
    getCommentDensity,
    getLastModified,
    getModuleType,
    getComplexityScore
} = require('../extractors/universalExtractors');

function analyzeFile(fileInfo, repoRoot, allFiles) {
    // Read file content and stats for new extractors
    let content = '';
    let stats = null;
    
    try {
        const fullPath = path.join(repoRoot, fileInfo.path);
        if (fs.existsSync(fullPath)) {
            stats = fs.statSync(fullPath);
            // Only read text files
            const textExtensions = ['.go', '.js', '.ts', '.py', '.java', '.yaml', '.json', '.xml', '.md', '.txt'];
            if (textExtensions.some(ext => fileInfo.path.endsWith(ext))) {
                content = fs.readFileSync(fullPath, 'utf8');
            }
        }
    } catch (err) {
        // Silently continue if file can't be read
    }
    
    // Extract all properties
    const service = identifyService(fileInfo.path);
    const component = identifyComponent(fileInfo.path, fileInfo.extension);
    const language = detectLanguage(fileInfo.extension, fileInfo.path);
    const size = categorizeSize(fileInfo.size);
    const type = classifyType(fileInfo.path, fileInfo.extension);
    
    // Extract API-specific properties
    const resourceDomain = identifyResourceDomain(fileInfo.path);
    const operationType = identifyOperationType(fileInfo.path);
    const apiPattern = identifyApiPattern(fileInfo.path);
    const apiComplexity = calculateApiComplexity(fileInfo.size, operationType);
    const httpMethod = inferHttpMethod(operationType, fileInfo.path);
    
    // Extract new universal properties
    const directoryDepth = getDirectoryDepth(path.join(repoRoot, fileInfo.path), repoRoot);
    const fileExtension = getFileExtension(fileInfo.path);
    const testStatus = hasTests(fileInfo.path, allFiles ? allFiles.map(f => f.path) : []);
    const importCount = countImports(content, language);
    const exportCount = countExports(content, language);
    const lineCount = getLineCount(content);
    const commentDensity = getCommentDensity(content, language);
    const lastModified = stats ? getLastModified(stats) : 'unknown';
    const moduleType = getModuleType(fileInfo.path);
    const complexityScore = getComplexityScore(content, language);
    
    return {
        path: fileInfo.path,
        service: service,
        component: component,
        language: language,
        size: size,
        type: type,
        resourceDomain: resourceDomain,
        operationType: operationType,
        apiPattern: apiPattern,
        apiComplexity: apiComplexity,
        httpMethod: httpMethod,
        directoryDepth: directoryDepth,
        fileExtension: fileExtension,
        testStatus: testStatus,
        importCount: importCount,
        exportCount: exportCount,
        lineCount: lineCount,
        commentDensity: commentDensity,
        lastModified: lastModified,
        moduleType: moduleType,
        complexityScore: complexityScore
    };
}

module.exports = { analyzeFile };