15. ✅ R49: The system shall implement a suggestions table:

    1. ✅ Add table row above main output area
    2. ✅ Use MUI Advanced Data Grid for table display
    3. ✅ Table columns shall match configuration properties
    4. ✅ First column shall be a clickable configuration index
    5. ✅ Clicking index shall update graph config and display
    6. ✅ Include 10 rows of interesting preset configurations

16. ✅ R50: The system shall implement table display refinements:

    1. ✅ Split configuration column into separate title and description columns
    2. ✅ Use compact density mode for MUI Data Grid
    3. ✅ Optimize column widths for maximum data visibility

17. ✅ R51: The system shall implement configuration form refinements:

    1. ✅ Display each input field on a new row
    2. ✅ Remove all side-by-side input layouts
    3. ✅ Maintain consistent vertical spacing between inputs

18. ✅ R52: The system shall implement UI enhancements:

    1. ✅ Enforce 2px minimum separation between nodes in React Flow chart
    2. ✅ Add info icons with tooltips to all configuration input fields
    3. ✅ Display explanatory text for each configuration option
    4. ✅ Relocate metrics display:
       1. ✅ Move total entities count to metrics box
       2. ✅ Move two additional output metrics to metrics box
       3. ✅ Position metrics box in column 1 below config box
    5. ✅ Implement layout adjustments:
       1. ✅ Increase table height by 10%
       2. ✅ Expand page content width to 90vw
       3. ✅ Set column 2 to fill available space

19. ✅ R53: The system shall implement configuration persistence:

    1. ✅ Create GraphConfig table in existing database
    2. ✅ Add UUID field for each configuration
    3. ✅ Add favorite/star button to each configuration row
    4. ✅ Save starred configurations to database
    5. ✅ Load and display favorite configurations at top of suggestions table
    6. ✅ Display system-generated configurations below favorites
    7. ✅ Auto-generate UUID for each system configuration

20. ✅ R54: The system shall implement enhanced graph type configuration:

    1. ✅ Entity type configuration:
       1. ✅ Add input field for number of entity types
       2. ✅ Assign unique color to each entity type
       3. ✅ Apply entity-specific colors to graph nodes
    2. ✅ Connector type configuration:
       1. ✅ [C] Add input field for number of connector types
       2. ✅ [C] Update connector lines to have a different color for each connector type
    3. ✅ Graph enhancements:
       1. ✅ Update graph metrics to display connector types
       2. ✅ Update graph metrics to use compact styling

21. ✅ R55: The system shall restructure the UI:

    1. ✅ [G] In column 2, change the table and graph from a vertical to a horizontal layout, where each component occupies 50% of the available width and fills the container's height.
    2. ✅ [G] Add a Maximize/Minimize button to the upper-left corner of each panel.
    3. ✅ [G] When the button is clicked, the corresponding panel shall collapse to a width of 50px, while the other panel expands to fill the remaining space.

22. ✅ R56: The system shall implement graph layout optimization:

    1. ✅ [GPT] Implement barycentric crossing minimization algorithm for hierarchical node positioning
    2. ✅ [GPT] Add intelligent node spacing with 120px gaps between levels
    3. ✅ [GPT] Integrate parent-position-based sorting to reduce edge crossings in React Flow graphs

23. ✅ [GPT] R57: The system shall modify React Flow connector styles:

    1. ✅ Connectors shall be twice as thick.
    2. ✅ Connectors shall be solid lines, not dashed.

24. ✅ R58: The system shall implement horizontal type-based node positioning:

    1. ✅ [GPT] Nodes shall be positioned horizontally based on their entity type
    2. ✅ [GPT] Each entity type shall occupy a distinct horizontal lane/zone with defined X-coordinate ranges
    3. ✅ [GPT] Node positioning shall maintain hierarchical relationships within each type zone
    4. ✅ [GPT] Cross-type connections shall be visually clear despite horizontal separation
    5. ✅ [GPT] Type zones shall be evenly distributed across the available horizontal space

25. ✅ R59: The system shall implement minor node adjustments:

    1. ✅ Put an index number in each node
    2. ✅ Color the background of each node the same color as its border
    3. ✅ If the user clicks on a node, show a popup with a delete button that will delete the node

26. ✅ R60: The system shall implement table tweaks:

    1. ✅ Make the suggested configurations table expand vertically to show all rows

27. ✅ [GEM] R61: The system shall add 2 more columns to main layout:

    1. ✅ [GEM] Currently the react flow chart is in a large pane with a min/max button. Add the cyto and d3 graphs to similar panes, each with a min/max button.
    2. ✅ [GEM] Remove the mini versions of all 3 graphs.

28. ✅ [GEM] R62: The system shall implement suggested configurations table tweaks:
    1. ✅ [GEM] Remove the page increment buttons from the bottom of the table.
    2. ✅ [GEM] Always show all rows.
29. ✅ [GEM] R63: The system shall refactor the layout to move column 6 into a collapsible tab as column 7.

30. ✅ clean up page.jsx

    1. ✅ Consolidate Collapse State Management: The multiple `useState` hooks and `handleToggle` functions for panel collapse (`isTableCollapsed`, `isReactFlowCollapsed`, etc.) could be consolidated into a single state object or a custom hook for better organization and less repetition.
    2. ✅ Extract API Logic: The `useEffect` and `handleConfigSubmit` functions contain direct API calls. This logic could be extracted into a separate service or hook (`useHierarchyData`) to improve separation of concerns and reusability.
    3. ✅ Centralize Default Config: The `config` default values are hardcoded. These could be moved to a separate constant or configuration file for easier management and to avoid magic numbers/strings.
    4. ✅ Simplify `getFlexValue`: While functional, `getFlexValue` is a very small helper. Consider if its direct inline usage or a more generic utility for dynamic styles would be clearer.
    5. ✅ Refine JSX Structure: The nested `Box` and `Grid` components, especially with inline `sx` props, can become deeply nested and hard to read. Consider breaking down complex sections into smaller, dedicated components.
    6. ✅ Consistent Styling: Some styles are applied via `sx` prop, others via `style` prop (`boxStyles`). Standardize on one approach, preferably `sx` for Material-UI components, and consider moving complex styles to a theme or `styled` components.
    7. ✅ Remove Commented-Out Code: Lines like `// width: '100%',` and `// border: "10px solid red",` should be removed.

31. ✅ [CLD] R71: Layout changes:

    1. ✅ [CLD] R71.1: Darken light font in collapsible columns
    2. ✅ [CLD] R71.2: Move max/min icon to upper right instead of upper left
    3. ✅ [CLD] R71.3: Change max/min to more common icon
    4. ✅ [CLD] R71.4: apply compact styling to entity table

32. ✅ [CLD] R72: graph colors:

    1. ✅ [CLD] R72.1: fix colors on nodes and edges on cytpscape graph
    2. ✅ [CLD] R72.2. make colors consistent across all 3 graphs
    3. ✅ [CLD] R72.3. create a centralized location in the code to store colors

33. ✅ R73: Testing Framework Setup:

    1. ✅ [CLD2] R73.1: The system shall implement Jest testing framework for the Next.js web application
    2. ✅ [CLD2] R73.2: The system shall implement React Testing Library (RTL) for component testing
    3. ✅ [CLD2] R73.3: The system shall include at least one sample unit test
    4. ✅ [CLD2] R73.4: The system shall include at least one sample component test
