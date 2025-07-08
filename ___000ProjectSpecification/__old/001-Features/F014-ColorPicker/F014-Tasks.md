# Feature 014: Color Picker Tasks

## T14.1: Controller Structure Setup

1. ⬛ T14.1.1: Create colorPicker.controller.ts in src/client/controllers/
2. ⬛ T14.1.2: Define ColorPickerController class with proper exports
3. ⬛ T14.1.3: Import required Roblox services (Players)
4. ⬛ T14.1.4: Define class properties for GUI elements and state
5. ⬛ T14.1.5: Create selectedColors Map for color storage

## T14.2: Collapsible GUI Implementation

1. ⬛ T14.2.1: Create initialize() method as entry point
2. ⬛ T14.2.2: Implement createGUI() method for base structure
3. ⬛ T14.2.3: Create collapsible header frame (200x40)
4. ⬛ T14.2.4: Add toggle button with arrow indicator
5. ⬛ T14.2.5: Create expandable content frame (400x500)
6. ⬛ T14.2.6: Implement toggleCollapse() animation logic
7. ⬛ T14.2.7: Position GUI in lower left corner

## T14.3: BrickColor Grid Generation

1. ⬛ T14.3.1: Create createColorGrid() method
2. ⬛ T14.3.2: Generate ScrollingFrame container
3. ⬛ T14.3.3: Configure UIGridLayout (10 columns, 30x30 cells)
4. ⬛ T14.3.4: Iterate through all BrickColor palette
5. ⬛ T14.3.5: Create TextButton for each BrickColor
6. ⬛ T14.3.6: Apply color and border styling
7. ⬛ T14.3.7: Store button references for state management

## T14.4: Selection System

1. ⬛ T14.4.1: Implement toggleColorSelection() method
2. ⬛ T14.4.2: Update button border on selection (yellow, 3px)
3. ⬛ T14.4.3: Maintain selectedColors Map state
4. ⬛ T14.4.4: Create updateSelectionCount() display
5. ⬛ T14.4.5: Add hover effects for color buttons
6. ⬛ T14.4.6: Implement click event handlers

## T14.5: Output Formatting

1. ⬛ T14.5.1: Create formatOutput() method
2. ⬛ T14.5.2: Convert Color3 values to string format
3. ⬛ T14.5.3: Format as TypeScript array syntax
4. ⬛ T14.5.4: Include proper indentation and line breaks
5. ⬛ T14.5.5: Implement outputColors() to print to console
6. ⬛ T14.5.6: Add timestamp to output for clarity

## T14.6: Control Features

1. ⬛ T14.6.1: Create Output button in control panel
2. ⬛ T14.6.2: Create Clear button in control panel
3. ⬛ T14.6.3: Implement clearSelection() method
4. ⬛ T14.6.4: Update button states based on selection
5. ⬛ T14.6.5: Style control buttons consistently
6. ⬛ T14.6.6: Add selection counter label

## T14.7: Integration and Testing

1. ⬛ T14.7.1: Update main.client.ts to initialize ColorPicker
2. ⬛ T14.7.2: Test collapsible behavior
3. ⬛ T14.7.3: Verify all BrickColors display correctly
4. ⬛ T14.7.4: Test multi-selection functionality
5. ⬛ T14.7.5: Validate output format in console
6. ⬛ T14.7.6: Test clear functionality
7. ⬛ T14.7.7: Performance test with many selections