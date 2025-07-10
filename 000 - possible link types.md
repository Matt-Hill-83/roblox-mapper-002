# Possible Link Types Between Harness Files

## Overview
This document outlines various types of relationships that could exist between files in the Harness codebase. These link types can be used to create a more comprehensive visualization of the codebase structure and dependencies.

## 1. Import/Dependency Links
**Description**: Direct code dependencies where one file imports or requires another.
- **Go imports**: `import "path/to/package"`
- **JavaScript/TypeScript imports**: `import X from './file'`
- **Python imports**: `from module import function`
- **Java imports**: `import com.harness.package.Class`

**Example**: `app/api/controller/migrate/wire.go` → `app/api/controller/common/types.go`

## 2. API Endpoint Relationships
**Description**: Links between API controllers and their corresponding handlers/services.
- Controller → Service implementation
- API route definitions → Handler functions
- REST endpoints → Business logic

**Example**: `app/api/controller/infraprovider/list.go` → `app/service/infraprovider/service.go`

## 3. Test Coverage Links
**Description**: Connections between source files and their test files.
- Source file → Unit test file (`file.go` → `file_test.go`)
- Integration test → Multiple source files
- Mock files → Implementation files

**Example**: `app/api/controller/pullreq/mentions.go` → `app/api/controller/pullreq/mentions_test.go`

## 4. Configuration Dependencies
**Description**: Files that depend on configuration or are configuration providers.
- Code files → Configuration files (YAML, JSON, XML)
- Environment-specific configs → Implementation files
- Feature flags → Feature implementations

**Example**: `app/api/controller/migrate/wire.go` → `config/migrations.yaml`

## 5. Database Schema Relationships
**Description**: Links between database access code and schema definitions.
- Repository/DAO files → Schema migration files
- ORM models → Database tables
- Query builders → Database operations

**Example**: Files with `type: "database"` → Migration scripts

## 6. Service Communication Links
**Description**: Inter-service communication patterns.
- gRPC client → gRPC server definitions
- HTTP client → REST API endpoints
- Message publishers → Message consumers
- Event emitters → Event handlers

**Example**: `platform` service files → `ci` service API files

## 7. Shared Utility Dependencies
**Description**: Common utilities and helper functions used across files.
- Business logic → Utility functions
- Multiple files → Shared constants
- Various components → Common interfaces

**Example**: Multiple files → `app/common/utils/string_utils.go`

## 8. Component Hierarchy Links
**Description**: Architectural component relationships.
- Controller → Service → Repository pattern
- Presentation → Business → Data layer
- Interface definitions → Implementations

**Example**: `component: "api"` files → `component: "service"` files

## 9. Resource Domain Clustering
**Description**: Files working on the same business domain.
- All files with `resourceDomain: "infrastructure"`
- All files with `resourceDomain: "migration"`
- Cross-domain integration points

## 10. Operation Type Chains
**Description**: Files that implement related operations.
- CRUD operation sequences (Create → Read → Update → Delete)
- Workflow steps in order
- Pipeline stage implementations

**Example**: `operationType: "create"` → `operationType: "list"` → `operationType: "update"`

## 11. Language Interoperability Links
**Description**: Cross-language integration points.
- Go backend → JavaScript frontend
- Python scripts → Go services
- Protocol buffer definitions → Multiple language implementations

## 12. Build and Deployment Dependencies
**Description**: Build system and deployment relationships.
- Source files → Build configuration
- Dockerfiles → Application code
- CI/CD pipeline definitions → Source code

## Implementation Considerations

### Link Attributes
Each link type could have attributes:
- **Strength**: Strong (direct import) vs. Weak (logical grouping)
- **Direction**: Unidirectional vs. Bidirectional
- **Cardinality**: One-to-one, One-to-many, Many-to-many
- **Confidence**: Certain (explicit import) vs. Inferred (pattern matching)

### Visualization Strategies
- Different colors for different link types
- Line thickness based on link strength
- Dashed lines for inferred relationships
- Arrows for directional dependencies

### Priority for Implementation
1. **High Priority**: Import/Dependency Links (most concrete)
2. **Medium Priority**: Test Coverage, API Relationships
3. **Low Priority**: Inferred relationships, Domain clustering

## Next Steps
1. Implement import parsing for Go files
2. Create link detection algorithms
3. Add link data to the visualization data model
4. Update the 3D visualization to render different link types

## Summary Table

| Link Type | Detection Difficulty | Implementation Priority | Usefulness | Value for Understanding | Visualization Impact |
|-----------|---------------------|------------------------|------------|------------------------|---------------------|
| Import/Dependency Links | Easy | High | ⭐⭐⭐⭐⭐ | Critical - Shows actual code dependencies | High - Clear directional flow |
| API Endpoint Relationships | Medium | High | ⭐⭐⭐⭐⭐ | Critical - Shows service architecture | High - API flow visualization |
| Test Coverage Links | Easy | Medium | ⭐⭐⭐⭐ | High - Quality indicators | Medium - Can clutter if too many |
| Component Hierarchy Links | Medium | High | ⭐⭐⭐⭐ | High - Shows architectural layers | High - Layer separation |
| Service Communication Links | Hard | Medium | ⭐⭐⭐⭐ | High - Microservice boundaries | High - Service mesh view |
| Resource Domain Clustering | Easy | Medium | ⭐⭐⭐ | Medium - Logical grouping | Medium - Color coding |
| Operation Type Chains | Medium | Low | ⭐⭐⭐ | Medium - Workflow understanding | Medium - Sequential flow |
| Shared Utility Dependencies | Easy | Low | ⭐⭐⭐ | Medium - Common code usage | Low - Many connections |
| Configuration Dependencies | Medium | Low | ⭐⭐ | Low - Runtime dependencies | Low - Different concern |
| Database Schema Relationships | Hard | Low | ⭐⭐ | Low - Data layer only | Low - Specific use case |
| Language Interoperability Links | Hard | Low | ⭐⭐ | Low - Edge cases | Low - Rare in practice |
| Build and Deployment Dependencies | Hard | Low | ⭐ | Low - Build-time only | Low - Not runtime relevant |

### Recommended Implementation Order
1. **Phase 1 (Essential)**: Import/Dependency Links, API Endpoint Relationships
2. **Phase 2 (High Value)**: Test Coverage Links, Component Hierarchy Links
3. **Phase 3 (Nice to Have)**: Service Communication, Resource Domain Clustering
4. **Phase 4 (Optional)**: Remaining link types based on specific needs