34. ✅ [CLD] R71: Layout changes:

    1. ✅ [CLD] R71.1: Darken light font in collapsible columns
    2. ✅ [CLD] R71.2: Move max/min icon to upper right instead of upper left
    3. ✅ [CLD] R71.3: Change max/min to more common icon
    4. ✅ [CLD] R71.4: apply compact styling to entity table

35. ✅ [CLD] R72: graph colors:

    1. ✅ [CLD] R72.1: fix colors on nodes and edges on cytpscape graph
    2. ✅ [CLD] R72.2. make colors consistent across all 3 graphs
    3. ✅ [CLD] R72.3. create a centralized location in the code to store colors

36. R73: Testing Framework Setup:

    1. ⬛ R73.1: The system shall implement Jest testing framework for the Next.js web application
    2. ⬛ R73.2: The system shall implement React Testing Library (RTL) for component testing
    3. ⬛ R73.3: The system shall include at least one sample unit test
    4. ⬛ R73.4: The system shall include at least one sample component test

## Task List

1.  ✅ Implementation Tasks

    96. ✅ [CLD] T96: Apply compact styling to entity table (R71.4)
        1. ✅ [CLD] Find the entity table component in TreeDisplay.tsx
        2. ✅ [CLD] Apply density="compact" prop to the DataGrid component (applied size="small" to Table component)
        3. ✅ [CLD] Verify compact styling is applied consistently across all table views
    97. ✅ [CLD] T97: Standardize graph colors across visualization components (R72)
        1. ✅ [CLD] Copy colorTokens.js to \_webapp/src/config/colorTokens.ts and convert to TypeScript
        2. ✅ [CLD] Update CytoscapeGraph to use colorTokens.pages.hiTester.graphs colors
        3. ✅ [CLD] Update ReactFlowGraph to use colorTokens.pages.hiTester.graphs colors
        4. ✅ [CLD] Update D3Graph to use colorTokens.pages.hiTester.graphs colors
        5. ✅ [CLD] Ensure nodes use level-based colors (level1: blue, level2: orange, level3: green)
        6. ✅ [CLD] Ensure edges use the defined edge color array consistently
    98. ⬛ T98: Set up Jest testing framework for Next.js application (R73.1)
        1. ⬛ Install Jest and related dependencies for Next.js
        2. ⬛ Create Jest configuration file (jest.config.js)
        3. ⬛ Configure Jest for TypeScript support
        4. ⬛ Set up test script in package.json
    99. ⬛ T99: Set up React Testing Library (R73.2)
        1. ⬛ Install React Testing Library dependencies
        2. ⬛ Create test setup file for RTL configuration
        3. ⬛ Configure testing utilities and custom render functions
    100. ⬛ T100: Create sample unit test (R73.3)
        1. ⬛ Create a test directory structure
        2. ⬛ Write a sample unit test for a utility function or service
        3. ⬛ Ensure test runs successfully with Jest
    101. ⬛ T101: Create sample component test (R73.4)
        1. ⬛ Write a sample test for a React component using RTL
        2. ⬛ Include tests for rendering and user interactions
        3. ⬛ Verify component test runs successfully
