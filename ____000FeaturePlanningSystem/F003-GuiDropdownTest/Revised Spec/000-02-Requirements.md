# GUI Dropdown Test Requirements

## Requirements

1. ⬛ R1: Create a ScreenGui with a dropdown control
2. ⬛ R2: The dropdown should have three options: a, b, c
3. ⬛ R3: When an option is selected, it should print to the console
4. ⬛ R4: The GUI should be visible to the local player
5. ⬛ R5: The dropdown should have a clear visual indicator of the current selection

## Risks

- Risk 1: Dropdown might not be visible on all screen sizes - mitigate by using UDim2 scaling
- Risk 2: Multiple clicks might cause UI state issues - mitigate by proper state management

## Decision Points

- Decision 1: Use TextButton for dropdown trigger instead of custom control for simplicity
- Decision 2: Position dropdown list below button rather than overlay for clearer visual hierarchy
- Decision 3: Use print() for console output instead of complex logging system