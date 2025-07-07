# Shadow Block Under Nodes Requirements

1. ✅ R1: Block must be centered at the origin defined in game.env
2. ✅ R2: Block height must be 5 units
3. ✅ R3: Block material must be Concrete
4. ✅ R4: Block color must be light blue
5. ✅ R5: Block must be anchored (not affected by physics)
6. ✅ R6: Block creation must be integrated into existing node creation process
7. ✅ R7: Block should be positioned below all nodes in the tree

## New

- create platform block
- The shadow block (which we already created) should be created concident with the Platform Block.
- the platform block should be the shadow block's parent
- the platform block should be the same y dimension as the shadow block - 0.1 unit, to prevent z-fighting issues
- the platform block should be light green
