function categorizeSize(sizeInBytes) {
    const kb = sizeInBytes / 1024;
    
    // Define size categories
    if (kb < 1) {
        return 'tiny';      // < 1 KB
    } else if (kb < 10) {
        return 'small';     // 1-10 KB
    } else if (kb < 50) {
        return 'medium';    // 10-50 KB
    } else if (kb < 200) {
        return 'large';     // 50-200 KB
    } else if (kb < 1000) {
        return 'xlarge';    // 200KB-1MB
    } else {
        return 'huge';      // > 1MB
    }
}

module.exports = { categorizeSize };