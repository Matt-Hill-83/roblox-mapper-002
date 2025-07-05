# Screen GUI Specification

## Quick Reference

### Inputs (Single Group Configuration)
| Input | Type | Range | Description |
|-------|------|-------|-------------|
| Number of Level 1 Nodes | Number | 1-10 | How many root/top-level nodes in this group |
| Number of Level 2 Nodes | Number | 1-50 | How many second-level nodes in this group |
| Number of Level 3 Nodes | Number | 1-100 | How many third-level nodes in this group |
| Children per Node | Number | 1-5 | Maximum number of children each parent node can have |
| Node Types | Number | 1-10 | Number of different entity types (e.g., People, Animals) |
| Link Types | Number | 1-10 | Number of different relationship types (e.g., Owns, Wants, Eats) |

**Note**: This GUI currently configures a single hierarchical group. Multiple group support will be added in a future update.

### Outputs
| Output | Type | Description |
|--------|------|-------------|
| Configuration Update | GeneratorConfig object | Sent when user clicks "Regenerate" button |
| Visual Feedback | UI changes | Button color change and input validation indicators |

## Overview

The Configuration GUI is a Roblox ScreenGui that provides an interface for users to configure the simple data generator parameters in real-time. It is positioned in the upper left corner of the screen and allows dynamic adjustment of the 3D visualization. Currently, it generates a single hierarchical group with the specified node distribution across three levels.

## Current Implementation

### GUI Structure

- **ScreenGui Name**: "ConfigurationGUI"
- **Position**: Upper left corner (10px from left, 10px from top)
- **Size**: 300px width × 250px height
- **Background Color**: Dark gray (0.2, 0.2, 0.2)
- **Corner Radius**: 8px
- **Reset On Spawn**: false

### Components

#### Title Section
- **Text**: "Generator Configuration"
- **Font**: SourceSansBold
- **Color**: White
- **Height**: 30px
- **Position**: Top of frame

#### Input Fields

The GUI displays 5 configuration parameters with the following structure:

| Parameter | Label | Variable Name | Current Min | Current Max |
|-----------|-------|---------------|-------------|-------------|
| Groups | Number of Groups | numGroups | 1 | 10 |
| Levels | Number of Levels | numLevels | 1 | 5 |
| Branches | Branches per Parent | numBranches | 1 | 5 |
| Node Types | Node Types | numNodeTypes | 1 | 2 |
| Link Types | Link Types | numLinkTypes | 1 | 3 |

##### Input Field Layout
- **Label**: 
  - Width: 50% of frame minus 10px padding
  - Alignment: Left
  - Color: Light gray (0.9, 0.9, 0.9)
  - Font: SourceSans
- **TextBox**:
  - Width: 30% of frame
  - Position: 70% from left
  - Background: Medium gray (0.3, 0.3, 0.3)
  - Corner Radius: 4px
  - Text Color: White
  - Font: SourceSans

##### Spacing
- **Row Height**: 35px
- **Starting Y Offset**: 40px from top

#### Regenerate Button
- **Size**: 80% of frame width × 30px height
- **Position**: Centered horizontally, 40px from bottom
- **Color**: Green (0.2, 0.6, 0.2)
- **Hover Color**: Lighter green (0.3, 0.7, 0.3)
- **Text**: "Regenerate"
- **Font**: SourceSansBold
- **Corner Radius**: 6px

### Validation

Each input field includes validation with the following behavior:
- Only accepts numeric values
- Enforces minimum and maximum limits
- Rounds to nearest integer
- Visual feedback:
  - Invalid input flashes red (1, 0.5, 0.5) for 0.5 seconds
  - Reverts to last valid value if input is invalid

### User Interactions

1. **Text Input**:
   - User can click on any TextBox to edit
   - Validation occurs on focus lost
   - Invalid values are rejected with visual feedback

2. **Regenerate Button**:
   - Click triggers configuration update
   - Button briefly darkens (0.1, 0.4, 0.1) for 0.2 seconds as feedback
   - Calls the configured callback with new parameters

### Technical Details

- **Service**: ConfigGUIService (client-side)
- **Controller**: ConfigGUIController 
- **Interface**: GeneratorConfig from simpleDataGenerator.interface
- **Parent**: PlayerGui
- **Input Storage**: Map<keyof GeneratorConfig, TextBox>

### Current Limitations

1. **Hard-coded Limits**: 
   - Node Types maximum is hard-coded to 2
   - Link Types maximum is hard-coded to 3
   - These limits need to be made configurable (R80.4)

2. **Fixed Parameters**: 
   - Only 5 parameters are configurable
   - No support for additional configuration options

3. **Layout Constraints**:
   - Fixed frame size may not accommodate additional inputs
   - No scrolling support for extended parameter lists

## Future Considerations

Based on R80 requirements:
- Increase maximum levels to 10
- Increase maximum node types to 10
- Remove hard-coded validation limits
- Make limits data-driven and configurable