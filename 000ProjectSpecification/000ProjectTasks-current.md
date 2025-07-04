31. ✅ clean up page.jsx

    1. ✅ Consolidate Collapse State Management: The multiple `useState` hooks and `handleToggle` functions for panel collapse (`isTableCollapsed`, `isReactFlowCollapsed`, etc.) could be consolidated into a single state object or a custom hook for better organization and less repetition.
    2. ✅ Extract API Logic: The `useEffect` and `handleConfigSubmit` functions contain direct API calls. This logic could be extracted into a separate service or hook (`useHierarchyData`) to improve separation of concerns and reusability.
    3. ✅ Centralize Default Config: The `config` default values are hardcoded. These could be moved to a separate constant or configuration file for easier management and to avoid magic numbers/strings.
    4. ✅ Simplify `getFlexValue`: While functional, `getFlexValue` is a very small helper. Consider if its direct inline usage or a more generic utility for dynamic styles would be clearer.
    5. ✅ Refine JSX Structure: The nested `Box` and `Grid` components, especially with inline `sx` props, can become deeply nested and hard to read. Consider breaking down complex sections into smaller, dedicated components.
    6. ✅ Consistent Styling: Some styles are applied via `sx` prop, others via `style` prop (`boxStyles`). Standardize on one approach, preferably `sx` for Material-UI components, and consider moving complex styles to a theme or `styled` components.
    7. ✅ Remove Commented-Out Code: Lines like `// width: '100%',` and `// border: "10px solid red",` should be removed.

32. ✅ [GEM] R69: The system shall implement MUI Accordion components:
    1. ✅ [GEM] R69.1: Replace `CollapsibleGraphPanel` with MUI `Accordion`, `AccordionSummary`, and `AccordionDetails`.
    2. ✅ [GEM] R69.2: Update imports in `hierarchy-tester/page.tsx` to include MUI Accordion components.
    3. ✅ [GEM] R69.3: Map `isCollapsed` and `onToggle` from `usePanelCollapse` to `expanded` and `onChange` props of `Accordion`.
    4. ✅ [GEM] R69.4: Place content previously rendered by `CollapsibleGraphPanel`'s `switch` case directly into `AccordionDetails`.
    5. ✅ [GEM] R69.5: Adjust layout and styling to ensure visual consistency with the new Accordion structure.
    6. ✅ [GEM] R69.6: Remove the `CollapsibleGraphPanel.tsx` component file.

## Task List

1.  ✅ Implementation Tasks

        80.1. ✅ [GEM] T80.1: Remove VisualMap's independent panel from `hierarchy-tester/page.tsx`.
        80.2. ✅ [GEM] T80.2: Adjust width calculations for remaining collapsible sections in `hierarchy-tester/page.tsx`.
        80.3. ✅ [GEM] T80.3: Add VisualMap import to `_webapp/src/components/TreeDisplay.tsx`.
        80.4. ✅ [GEM] T80.4: Add a new 'Visual Map' tab to the `Tabs` component in `_webapp/src/components/TreeDisplay.tsx`.
        80.5. ✅ [GEM] T80.5: Add a corresponding `TabPanel` for 'Visual Map' in `_webapp/src/components/TreeDisplay.tsx`.
        80.6. ✅ [GEM] T80.6: Ensure `tabValue` state and `TabPanel` indices are correctly aligned in `_webapp/src/components/TreeDisplay.tsx`.
        80.7. ✅ [GEM] T80.7: Wrap the entire tabbed interface in `_webapp/src/components/TreeDisplay.tsx` with the `GraphContainer` component.

    81. ✅ T81: Consolidate Collapse State Management: The multiple `useState` hooks and `handleToggle` functions for panel collapse (`isTableCollapsed`, `isReactFlowCollapsed`, etc.) could be consolidated into a single state object or a custom hook for better organization and less repetition.
    82. ✅ T82: Extract API Logic: The `useEffect` and `handleConfigSubmit` functions contain direct API calls. This logic could be extracted into a separate service or hook (`useHierarchyData`) to improve separation of concerns and reusability.
    83. ✅ T83: Centralize Default Config: The `config` default values are hardcoded. These could be moved to a separate constant or configuration file for easier management and to avoid magic numbers/strings.
    84. ✅ T84: Simplify `getFlexValue`: While functional, `getFlexValue` is a very small helper. Consider if its direct inline usage or a more generic utility for dynamic styles would be clearer.
    85. ✅ T85: Refine JSX Structure: The nested `Box` and `Grid` components, especially with inline `sx` props, can become deeply nested and hard to read. Consider breaking down complex sections into smaller, dedicated components.
    86. ✅ T86: Consistent Styling: Some styles are applied via `sx` prop, others via `style` prop (`boxStyles`). Standardize on one approach, preferably `sx` for Material-UI components, and consider moving complex styles to a theme or `styled` components.
    87. ✅ T87: Remove Commented-Out Code: Lines like `// width: '100%',` and `// border: "10px solid red",` should be removed.
    88. ✅ T88: [VSC] update this file to say "vscode test" at the top.
    89. ✅ T89: [VSC] update this file to say "copilot test" at the top.
    90. ⬛ [GEM] T91: Implement a horizontal collapsible panel set (R70)
        91.1. ⬛ [GEM] T91.1: Create a container with a row of 5 boxes in `hierarchy-tester/page.tsx` (R70.1).
        91.2. ⬛ [GEM] T91.2: Integrate existing components (Configuration, Suggestions, React Flow, Cytoscape.js, D3.js) into these boxes (R70.2).
        91.3. ⬛ [GEM] T91.3: Add minimize/maximize buttons to each box (R70.3).
        91.4. ⬛ [GEM] T91.4: Implement logic for boxes to collectively take up full parent width (R70.4).
        91.5. ⬛ [GEM] T91.5: Implement logic for minimized box width to be 50px (R70.5).
        91.6. ⬛ [GEM] T91.6: Implement logic for other boxes to expand proportionally (R70.6).
