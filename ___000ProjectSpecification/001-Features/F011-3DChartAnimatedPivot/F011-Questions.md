# Feature 011: WebBased 3D Chart Animated Pivot Data Structure - Clarifying Questions

## Critical Questions (Must Answer)

1. **Q1: What is the primary use case for pivoting?**
   - Are users trying to analyze relationships differently (e.g., "show me all entities owned by Animals")?
   - Or reorganize the spatial layout (e.g., "group all Animals together")?
   - Or both?

2. **Q2: Should the pivot operation preserve the hierarchical parent-child relationships?**
   - When pivoting by entity type, do children stay with their parents?
   - Or should entities be completely regrouped ignoring original hierarchy?

3. **Q3: What happens to cross-tree connections during pivot?**
   - Should relationship lines be maintained and redrawn?
   - Should they be hidden during animation?
   - Should they be filtered based on the pivot criteria?

## Important Questions (Affects Design)

4. **Q4: How should entities be spatially arranged after pivoting?**
   - Use the existing hierarchical layout within each pivot group?
   - Create a new layout algorithm for pivoted data?
   - Maintain relative positions where possible?

5. **Q5: Should pivot operations be reversible/undoable?**
   - Need to maintain a history stack?
   - Quick "reset to original" button sufficient?
   - Multiple undo levels required?

6. **Q6: What level of animation control do users need?**
   - Just play/pause?
   - Scrubbing through animation timeline?
   - Preview before committing to pivot?

## Implementation Questions

7. **Q7: Should pivoting affect all visible data or allow partial pivots?**
   - Pivot entire dataset?
   - Allow selection of subset to pivot?
   - Pivot only visible/filtered entities?

8. **Q8: How should we handle large datasets during animation?**
   - Automatically reduce quality during animation?
   - Limit number of animated entities?
   - Use progressive loading/animation?

## Nice-to-Have Clarifications

9. **Q9: Should pivot configurations be saveable?**
   - Save as presets?
   - Share pivot configurations between users?
   - Include in configuration dropdown?

10. **Q10: Should there be visual previews of pivot results?**
    - Thumbnail previews of different pivot options?
    - Ghost/overlay showing where entities will move?
    - Side-by-side before/after view?