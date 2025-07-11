# Code Cleanup Tasks

Based on Code Audit 007, these tasks will improve code quality and reduce technical debt.

## Phase 1: Critical Dead Code Removal (Week 1)

### T1 - Remove Test Data Files ⬛
**Impact**: 37,067 lines / 1.08 MB
```bash
# Backup data if needed
cp src/shared/data/tempHarnessTestData.ts ~/backup/
cp src/shared/data/tempHarnessLinks.ts ~/backup/

# Remove files
git rm src/shared/data/tempHarnessTestData.ts
git rm src/shared/data/tempHarnessLinks.ts
git rm src/shared/data/tempTestData.ts

# Commit
git commit -m "Remove temporary test data files (37k lines)"
```

### T2 - Verify Entry Points ⬛
**Purpose**: Confirm which files are truly orphaned
```bash
# Check main entry points
grep -r "main.client" src/
grep -r "main.server" src/
grep -r "import.*from" src/ | grep -v node_modules > imports.txt
```

### T3 - Create External Data Loading ⬛
**Purpose**: Replace hardcoded test data
1. Create `data/` directory
2. Move test data to JSON files
3. Implement data loader service
4. Update imports

## Phase 2: Unused Module Removal (Week 2)

### T4 - Remove UnifiedDataRenderer ⬛
**Impact**: ~4,000 lines
```bash
# Verify it's unused
grep -r "UnifiedDataRenderer" src/ --exclude-dir=renderers

# If confirmed unused
git rm -r src/shared/modules/renderers/unifiedDataRenderer/
git commit -m "Remove unused UnifiedDataRenderer module"
```

### T5 - Remove Orphaned GUI Services ⬛
**Impact**: ~2,000 lines
```bash
# Check each service
grep -r "PropertiesGuiService" src/
grep -r "ConfigGUIServerService" src/
grep -r "NodePropertiesInspectorService" src/

# Remove if unused
git rm -r src/client/services/propertiesGui/
git rm src/client/services/configGui/stateManager.ts
git rm src/client/services/nodePropertiesInspector.service.ts
```

### T6 - Clean Maker Modules ⬛
**Impact**: ~1,500 lines
- Review all maker modules
- Identify which are actually used
- Remove unused ones
- Consider consolidation pattern

## Phase 3: Export Cleanup (Week 3)

### T7 - Remove Unused Exports Script ⬛
Create and run script to identify unused exports:
```typescript
// scripts/find-unused-exports.ts
// Analyze exports vs imports
// Generate report of unused exports
```

### T8 - Clean Individual Files ⬛
**Files with most unused exports**:
1. `types.ts` - 19 unused
2. `graphAdapters.ts` - 19 unused
3. `nodeTypes.ts` - 11 unused
4. `constants.ts` - 10 unused

### T9 - Update Import Statements ⬛
After removing exports:
- Update all import statements
- Run TypeScript compiler to verify
- Fix any broken imports

## Phase 4: CI/CD Integration (Week 4)

### T10 - Add Dead Code Detection ⬛
**Tool**: ts-prune or similar
```json
// package.json
"scripts": {
  "check:dead-code": "ts-prune",
  "check:unused-exports": "ts-unused-exports"
}
```

### T11 - Create GitHub Action ⬛
```yaml
# .github/workflows/code-quality.yml
name: Code Quality Check
on: [pull_request]
jobs:
  dead-code:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run check:dead-code
```

### T12 - Add Pre-commit Hook ⬛
```bash
# .husky/pre-commit
npm run check:dead-code
npm run check:unused-exports
```

## Phase 5: Module Reorganization (Month 2)

### T13 - Analyze Shared Module Usage ⬛
- List all shared modules
- Identify client-only code
- Identify server-only code
- Plan reorganization

### T14 - Move Client-Specific Code ⬛
**From**: `src/shared/`
**To**: `src/client/`
- GUI-related utilities
- Client-only interfaces
- Browser-specific code

### T15 - Move Server-Specific Code ⬛
**From**: `src/shared/`
**To**: `src/server/`
- Server-only utilities
- Database interfaces
- Server-side validation

### T16 - Update Import Paths ⬛
- Update all affected imports
- Run full test suite
- Fix any circular dependencies

## Phase 6: Documentation (Month 3)

### T17 - Document Module Structure ⬛
Create README.md for each module:
```markdown
# Module Name

## Purpose
Brief description

## Exports
- Function/Class: Description
- Interface: Description

## Dependencies
- Internal: List
- External: List
```

### T18 - Create Architecture Decision Records ⬛
Document key decisions:
1. Why shared module pattern
2. Service architecture choices
3. Data flow decisions

### T19 - Update Project Documentation ⬛
- Update main README
- Add architecture diagrams
- Document cleanup process

## Verification Tasks

### T20 - Final Audit ⬛
After all cleanup:
1. Run code audit again
2. Verify improvements
3. Document metrics
4. Plan next steps

## Success Metrics

- [ ] Test data files removed (37k lines)
- [ ] Orphaned files < 5%
- [ ] Unused exports = 0
- [ ] CI/CD checks in place
- [ ] All modules documented
- [ ] Code size reduced by 40%

## Task Dependencies

```
T1 ─┬─> T3
    └─> T2 ─> T4 ─> T5 ─> T6
              └─> T7 ─> T8 ─> T9
                        └─> T10 ─> T11 ─> T12
                                   └─> T13 ─> T14 ─> T15 ─> T16
                                              └─> T17 ─> T18 ─> T19 ─> T20
```