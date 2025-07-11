# Geometric Naming Audit and Revision - Requirements

1. ⬛ R1: Perform comprehensive code audit of all files under `/Users/__projects/roblox-mapper-002-multi/cursor/src`
2. ⬛ R2: Identify all instances where naming refers to data properties instead of geometric axes
3. ⬛ R3: Document the current naming patterns and their usage locations
4. ⬛ R4: Create clear before/after naming mappings
5. ⬛ R5: Generate visual diagrams showing current data flow and naming confusion
6. ⬛ R6: Propose new naming convention that is data-agnostic and axis-focused
7. ⬛ R7: Create detailed task list for implementing naming changes

## Risks

- Risk 1: Breaking existing functionality due to widespread naming changes - mitigate with thorough testing
- Risk 2: Missing hidden dependencies on current naming - mitigate with comprehensive grep searches
- Risk 3: Confusion during transition period - mitigate with clear documentation

## Decision Points

- Decision 1: Choose between verbose clarity (e.g., "X-grouping-Z-oriented") vs concise naming (e.g., "Z-parallel")
- Decision 2: Whether to include data type in any naming or go fully geometric
- Decision 3: How to handle legacy code compatibility during transition