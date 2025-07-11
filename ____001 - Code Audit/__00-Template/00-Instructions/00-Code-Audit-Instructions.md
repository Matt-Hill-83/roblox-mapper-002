
[------------------------------------------------]
INSTRUCTIONS FOR AI AGENT - START
[------------------------------------------------]
1. Use this file as a guide
2. Create the file structure:
   1. Inside __01-Historical-Audits/
      2. Create a sequentially numbered Output Folder like this:
         1. Code-Audit - 001
      3. In the Output Folder, create the following folders:
         1. 02-Updated-Spec/
         2. 03-Results/
4. Create the Plan:
   1. Inside the new 02-Updated-Spec/, create:
      1. a set of updated documents modelled after the ones in 01-Example-Outputs
5. Execute the plan:
   1. Using the tools in 02-Tools/
      1. Execute the tasks in 02-Updated-Spec/03-Tasks.md
6. Create the Results:
   1. Inside 03-Results/ create a set of updated documents modelled after the ones in Example Outputs


[------------------------------------------------]
INSTRUCTIONS FOR AI AGENT - END
[------------------------------------------------]

# Code Quality Audit Specification

## Summary

Comprehensive code quality audit of the Roblox Mapper 002 project to assess current code quality, identify improvement opportunities, and ensure maintainability standards.

## Requirements

1. **File Inventory**
   - Scan all TypeScript files in the project
   - Collect metrics: file size, line count, last modified date
   - Identify largest and most complex files

2. **Code Analysis**
   - Check for type annotation coverage
   - Identify naming convention violations
   - Measure cyclomatic complexity
   - Detect duplicate code patterns
   - Map module dependencies

3. **Architecture Review**
   - Analyze module structure and dependencies
   - Identify circular dependencies
   - Assess separation of concerns
   - Review interface definitions

4. **Report Generation**
   - Generate comprehensive markdown report
   - Include visual dependency graphs
   - Provide prioritized recommendations
   - Create actionable improvement tasks

## Task List

1. ⬛ T1 - Setup and Configuration
   1. ⬛ T1.1 - Configure analysis tools for current codebase
   2. ⬛ T1.2 - Update file paths and exclusions
   3. ⬛ T1.3 - Test analysis scripts

2. ⬛ T2 - Run Analysis
   1. ⬛ T2.1 - Execute file inventory scan
   2. ⬛ T2.2 - Run code quality analysis
   3. ⬛ T2.3 - Build dependency maps
   4. ⬛ T2.4 - Collect all metrics

3. ⬛ T3 - Generate Reports
   1. ⬛ T3.1 - Create detailed analysis JSON
   2. ⬛ T3.2 - Generate markdown report
   3. ⬛ T3.3 - Create visual diagrams
   4. ⬛ T3.4 - Compile recommendations

4. ⬛ T4 - Review and Refine
   1. ⬛ T4.1 - Review findings
   2. ⬛ T4.2 - Prioritize issues
   3. ⬛ T4.3 - Create improvement roadmap
   4. ⬛ T4.4 - Document next steps

## Success Criteria

- Complete inventory of all TypeScript files
- Identification of all major code quality issues
- Clear, actionable recommendations
- Visual representation of architecture
- Prioritized improvement roadmap

## Deliverables

1. `fileInventory.json` - Complete file metrics
2. `detailedAnalysis.json` - Full analysis results
3. `CodeQualityAuditReport.md` - Comprehensive report
3.1 `Project-FlowChart.drawio`
4. Revised specifications with improvement tasks