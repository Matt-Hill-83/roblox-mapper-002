# Enhanced Harness File Analysis Summary

## Dataset Overview
- **Total Files Analyzed**: 200
- **Total Properties**: 20 (10 original + 10 new universal properties)

## Property Distribution Table

| Property | Unique Values | Top Value | Top Value Count | Description |
|----------|---------------|-----------|-----------------|-------------|
| **service** | 7 | platform | 176 (88%) | Service boundary classification |
| **component** | 10 | api | 146 (73%) | Component type within service |
| **language** | 13 | go | 166 (83%) | Programming language |
| **size** | 5 | small | 160 (80%) | File size category |
| **type** | 9 | api-def | 166 (83%) | File type classification |
| **resourceDomain** | 20 | pullreq | 40 (20%) | API resource domain (API-specific) |
| **operationType** | 26 | general | 69 (34.5%) | Operation type (API-specific) |
| **apiPattern** | 13 | general-api | 74 (37%) | API architectural pattern (API-specific) |
| **apiComplexity** | 3 | simple | 167 (83.5%) | API complexity score (API-specific) |
| **httpMethod** | 9 | UNKNOWN | 67 (33.5%) | HTTP method inference (API-specific) |
| **directoryDepth** | 3 | moderate | 167 (83.5%) | How deep in directory structure |
| **fileExtension** | 8 | go-source | 181 (90.5%) | Grouped file extensions |
| **testStatus** | 2 | no-tests | 197 (98.5%) | Test file presence |
| **importCount** | 5 | moderate-imports | 107 (53.5%) | Number of imports/dependencies |
| **exportCount** | 5 | no-exports | 101 (50.5%) | Number of exports |
| **lineCount** | 5 | small-file | 95 (47.5%) | File size in lines |
| **commentDensity** | 6 | light-comments | 58 (29%) | Comment to code ratio |
| **lastModified** | 1 | very-recent | 200 (100%) | File age category |
| **moduleType** | 2 | server-module | 181 (90.5%) | Module classification |
| **complexityScore** | 6 | simple-logic | 88 (44%) | Code complexity metric |

## Universal Properties (New)

The 10 new universal properties apply to ALL files in the repository:

1. **directoryDepth**: Categorizes files by their depth in the directory structure (root-level, shallow, moderate, deep, very-deep)
2. **fileExtension**: Groups similar file extensions (go-source, javascript, typescript, config, etc.)
3. **testStatus**: Indicates if the file has tests (has-tests, no-tests, is-test)
4. **importCount**: Categorizes by number of imports (no-imports, few-imports, moderate-imports, many-imports, heavy-imports)
5. **exportCount**: Categorizes by number of exports (no-exports, single-export, few-exports, moderate-exports, many-exports)
6. **lineCount**: File size based on lines (tiny-file, small-file, medium-file, large-file, huge-file)
7. **commentDensity**: Ratio of comments to code (no-comments, minimal-comments, light-comments, moderate-comments, heavy-comments, documentation-heavy)
8. **lastModified**: How recently the file was modified (very-recent, recent, moderate-age, aging, old, ancient)
9. **moduleType**: Module classification based on path (client-module, server-module, shared-module, config-module, docs-module, script-module, test-module, build-module, general-module)
10. **complexityScore**: Code complexity based on control flow (trivial, simple-logic, moderate-logic, complex-logic, very-complex, extremely-complex)

## Key Insights

- **Language Dominance**: Go is the dominant language (83%), reflecting Harness's backend architecture
- **API-Centric**: 73% of files are API components, with 83% classified as api-def type
- **Test Coverage**: Only 1.5% of files have associated tests, indicating potential for improvement
- **Code Complexity**: Most files (44%) have simple logic, with only 6% being very complex or extremely complex
- **Documentation**: Comment density is well-distributed, with 29% having light comments and 9% being documentation-heavy
- **Module Organization**: 90.5% are server modules, reflecting the backend-heavy nature of the analyzed portion
- **File Size**: Most files are small (47.5%) or tiny (36%), promoting maintainability
- **Import Patterns**: 53.5% have moderate imports, indicating good modularization
- **Export Patterns**: 50.5% have no exports, suggesting many internal/private implementations