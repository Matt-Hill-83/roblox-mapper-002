const path = require('path');
const { identifyService } = require('../extractors/serviceExtractor');
const { identifyComponent } = require('../extractors/componentExtractor');
const { detectLanguage } = require('../extractors/languageExtractor');
const { categorizeSize } = require('../extractors/sizeExtractor');
const { classifyType } = require('../extractors/typeExtractor');

function analyzeFile(fileInfo) {
    // Extract all properties
    const service = identifyService(fileInfo.path);
    const component = identifyComponent(fileInfo.path, fileInfo.extension);
    const language = detectLanguage(fileInfo.extension, fileInfo.path);
    const size = categorizeSize(fileInfo.size);
    const type = classifyType(fileInfo.path, fileInfo.extension);
    
    return {
        path: fileInfo.path,
        service: service,
        component: component,
        language: language,
        size: size,
        type: type
    };
}

module.exports = { analyzeFile };