32. ✅ [GEM] R69: The system shall implement MUI Accordion components:

    1. ✅ [GEM] R69.1: Replace `CollapsibleGraphPanel` with MUI `Accordion`, `AccordionSummary`, and `AccordionDetails`.
    2. ✅ [GEM] R69.2: Update imports in `hierarchy-tester/page.tsx` to include MUI Accordion components.
    3. ✅ [GEM] R69.3: Map `isCollapsed` and `onToggle` from `usePanelCollapse` to `expanded` and `onChange` props of `Accordion`.
    4. ✅ [GEM] R69.4: Place content previously rendered by `CollapsibleGraphPanel`'s `switch` case directly into `AccordionDetails`.
    5. ✅ [GEM] R69.5: Adjust layout and styling to ensure visual consistency with the new Accordion structure.
    6. ✅ [GEM] R69.6: Remove the `CollapsibleGraphPanel.tsx` component file.

33. ✅ [CLD] R70 UI collapser fixes:

    1. ✅ [CLD] R70.1: Make element shown in image expand to fill the width of the container.
    2. ✅ [CLD] R70.2: Give the element a 10px red border.

34. ✅ [CLD] R71: Layout changes:
    1. ✅ [CLD] R71.1: Darken light font in collapsible columns
    2. ✅ [CLD] R71.2: Move max/min icon to upper right instead of upper left
    3. ✅ [CLD] R71.3: Change max/min to more common icon
    4. ✅ [CLD] R71.4: apply compact styling to entity table

## Task List

1.  ✅ Implementation Tasks

    94. ✅ [CLD] T94: Fix panel expansion when collapsing panels
        1. ✅ [CLD] Remove getFlexValues() function and related flex calculation logic from HorizCollapsibleSetParent.
        2. ✅ [CLD] Remove flexValues state and calculation from HorizCollapsibleSetParent render logic.
        3. ✅ [CLD] Update HorizCollapsibleSetChild to use standard flex values: "1 1 0" for expanded, "0 0 50px" for collapsed.
        4. ✅ [CLD] Remove the flex prop from HorizCollapsibleSetChild interface and component usage.
        5. ✅ [CLD] Add width: '100%' to the parent Box in HorizCollapsibleSetParent to ensure full width usage.
        6. ✅ [CLD] Test that panels properly expand to fill available space when other panels are collapsed.
    95. ✅ [CLD] T95: Layout changes for collapsible panels (R71)
        1. ✅ [CLD] Darken light font in collapsible columns - update Typography color in HorizCollapsibleSetChild for better readability.
        2. ✅ [CLD] Move minimize/maximize icon from upper left to upper right in HorizCollapsibleSetChild component.
        3. ✅ [CLD] Replace current Minimize/Maximize icons with more common expand/collapse icons (e.g., ChevronLeft/ChevronRight or ExpandMore/ExpandLess).
    96. ✅ [CLD] T96: Apply compact styling to entity table (R71.4)
        1. ✅ [CLD] Find the entity table component in TreeDisplay.tsx
        2. ✅ [CLD] Apply density="compact" prop to the DataGrid component (applied size="small" to Table component)
        3. ✅ [CLD] Verify compact styling is applied consistently across all table views
