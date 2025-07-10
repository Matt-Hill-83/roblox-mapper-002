/**
 * Temporary Harness test data extracted from harness-files.json
 * This data represents real Harness repository files for testing visualization
 */

export interface HarnessFileData {
  path: string;
  service: string;
  component: string;
  language: string;
  size: string;
  type: string;
  resourceDomain: string;
  operationType: string;
  apiPattern: string;
  apiComplexity: string;
  httpMethod: string;
  directoryDepth: string;
  fileExtension: string;
  testStatus: string;
  importCount: string;
  exportCount: string;
  lineCount: string;
  commentDensity: string;
  lastModified: string;
  moduleType: string;
  complexityScore: string;
}

export const TEMP_HARNESS_TEST_DATA: HarnessFileData[] = [
  {
    "path": "app/api/controller/migrate/wire.go",
    "service": "platform",
    "component": "api",
    "language": "go",
    "size": "small",
    "type": "api-def",
    "resourceDomain": "migration",
    "operationType": "config",
    "apiPattern": "dependency-injection",
    "apiComplexity": "simple",
    "httpMethod": "MULTIPLE",
    "directoryDepth": "moderate",
    "fileExtension": "go-source",
    "testStatus": "no-tests",
    "importCount": "many-imports",
    "exportCount": "few-exports",
    "lineCount": "small-file",
    "commentDensity": "moderate-comments",
    "lastModified": "very-recent",
    "moduleType": "server-module",
    "complexityScore": "simple-logic"
  },
  {
    "path": "app/api/controller/infraprovider/list.go",
    "service": "platform",
    "component": "api",
    "language": "go",
    "size": "small",
    "type": "database",
    "resourceDomain": "infrastructure",
    "operationType": "list",
    "apiPattern": "crud-operation",
    "apiComplexity": "simple",
    "httpMethod": "GET",
    "directoryDepth": "moderate",
    "fileExtension": "go-source",
    "testStatus": "no-tests",
    "importCount": "moderate-imports",
    "exportCount": "no-exports",
    "lineCount": "tiny-file",
    "commentDensity": "documentation-heavy",
    "lastModified": "very-recent",
    "moduleType": "server-module",
    "complexityScore": "simple-logic"
  },
  {
    "path": "app/api/controller/pullreq/mentions.go",
    "service": "platform",
    "component": "api",
    "language": "go",
    "size": "small",
    "type": "api-def",
    "resourceDomain": "pullreq",
    "operationType": "general",
    "apiPattern": "general-api",
    "apiComplexity": "simple",
    "httpMethod": "UNKNOWN",
    "directoryDepth": "moderate",
    "fileExtension": "go-source",
    "testStatus": "no-tests",
    "importCount": "moderate-imports",
    "exportCount": "no-exports",
    "lineCount": "small-file",
    "commentDensity": "moderate-comments",
    "lastModified": "very-recent",
    "moduleType": "server-module",
    "complexityScore": "moderate-logic"
  },
  {
    "path": "app/api/auth/pipeline.go",
    "service": "platform",
    "component": "repository",
    "language": "go",
    "size": "small",
    "type": "api-def",
    "resourceDomain": "pipeline",
    "operationType": "general",
    "apiPattern": "general-api",
    "apiComplexity": "simple",
    "httpMethod": "UNKNOWN",
    "directoryDepth": "shallow",
    "fileExtension": "go-source",
    "testStatus": "no-tests",
    "importCount": "moderate-imports",
    "exportCount": "single-export",
    "lineCount": "tiny-file",
    "commentDensity": "heavy-comments",
    "lastModified": "very-recent",
    "moduleType": "server-module",
    "complexityScore": "simple-logic"
  },
  {
    "path": "app/api/controller/connector/wire.go",
    "service": "platform",
    "component": "ui",
    "language": "go",
    "size": "small",
    "type": "api-def",
    "resourceDomain": "connector",
    "operationType": "config",
    "apiPattern": "dependency-injection",
    "apiComplexity": "simple",
    "httpMethod": "MULTIPLE",
    "directoryDepth": "moderate",
    "fileExtension": "go-source",
    "testStatus": "no-tests",
    "importCount": "moderate-imports",
    "exportCount": "few-exports",
    "lineCount": "tiny-file",
    "commentDensity": "heavy-comments",
    "lastModified": "very-recent",
    "moduleType": "server-module",
    "complexityScore": "simple-logic"
  }
];