# F007 - Harness Code Categorization - Requirements

## Functional Requirements

1. ⬛ R1: Clone and scan the Harness repository
2. ⬛ R2: Analyze files to identify 5 distinct properties per file
3. ⬛ R3: Ensure each property has at least 5 different categories
4. ⬛ R4: Generate 200 file objects as JSON data
5. ⬛ R5: Properties should include service association and component type
6. ⬛ R6: Perform initial scan to understand repository structure
7. ⬛ R7: Design JSON schema based on initial findings
8. ⬛ R8: Execute full scan to generate final dataset

## Risks

- Risk 1: Repository size may require significant processing time
- Risk 2: Complex repository structure might make service identification challenging
- Risk 3: Property categorization may require domain knowledge of Harness

## Decision Points

- Decision 1: Use static analysis rather than build-time analysis for efficiency
- Decision 2: Focus on file-level properties rather than function-level analysis
- Decision 3: Prioritize easily identifiable properties like file type, location, and size