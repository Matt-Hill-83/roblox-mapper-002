export const robloxColors: Color3[] = [
  new Color3(0.8, 0.2, 0.2), // Red
  new Color3(0.2, 0.8, 0.2), // Green
  new Color3(0.2, 0.2, 0.8), // Blue
  new Color3(0.8, 0.8, 0.2), // Yellow
  new Color3(0.8, 0.2, 0.8), // Magenta
  new Color3(0.2, 0.8, 0.8), // Cyan
  new Color3(0.6, 0.3, 0.1), // Brown
  new Color3(1, 0.5, 0), // Orange
  new Color3(0.5, 0, 0.5), // Purple
  new Color3(0, 0.5, 0), // Dark Green
];

export const LINK_COLORS: Color3[] = [
  new Color3(0.098, 0.424, 0.753), // blue010: rgb(25, 108, 192)
  new Color3(1.0, 0.435, 0), // orange009: rgba(255, 111, 0, 1)
  new Color3(0.6431, 0.3608, 0.6471), // Base 19 saturated 200%
  new Color3(0.137, 0.451, 0.137), // green007: rgba(35, 115, 35, 1)
  new Color3(0.2, 0.2, 0.8), // Blue
  new Color3(0.922, 0.302, 0.302), // red008: rgba(235, 77, 77, 1)
  new Color3(0.51, 0.235, 0.706), // purple007: rgba(130, 60, 180, 1)
  new Color3(0.098, 0.424, 0.753), // blue010: rgb(25, 108, 192)
];
export const Y_AXIS_COLORS: Color3[] = [
  new Color3(0.6431, 0.3608, 0.6471), // Base 19 saturated 200%
  new Color3(0.3608, 0.7529, 0.3608), // Base 20 saturated 200%
  new Color3(0.3608, 0.5333, 1.0), // Base 15 saturated 200%
  new Color3(0.948, 0.7186, 0.7422), // Base 1 saturated 150%
  new Color3(0.3608, 0.5333, 1.0), // Base 18 saturated 200%
  new Color3(1.0, 0.5333, 0.3608), // Base 11 saturated 200%
  new Color3(0.9863, 0.6804, 0.7118), // Base 1 saturated 200%
  new Color3(0.3608, 1.0, 0.5333), // Base 9 saturated 200%
  new Color3(1.0, 0.6549, 0.3608), // Base 14 saturated 200%
];

export const Z_AXIS_COLORS: Color3[] = [
  new Color3(0.6431, 0.3608, 0.6471), // Base 19 saturated 200%
  new Color3(0.3608, 0.7529, 0.3608), // Base 20 saturated 200%
  new Color3(0.3608, 0.5333, 1.0), // Base 15 saturated 200%
  new Color3(0.948, 0.7186, 0.7422), // Base 1 saturated 150%
  new Color3(0.3608, 0.5333, 1.0), // Base 18 saturated 200%
  new Color3(1.0, 0.5333, 0.3608), // Base 11 saturated 200%
  new Color3(0.9863, 0.6804, 0.7118), // Base 1 saturated 200%
  new Color3(0.3608, 1.0, 0.5333), // Base 9 saturated 200%
  new Color3(1.0, 0.6549, 0.3608), // Base 14 saturated 200%
];
export const X_AXIS_COLORS: Color3[] = [
  new Color3(0.3608, 0.5333, 1.0), // Base 18 saturated 200%
  new Color3(1.0, 0.5333, 0.3608), // Base 11 saturated 200%
  new Color3(0.9863, 0.6804, 0.7118), // Base 1 saturated 200%
  new Color3(0.3608, 1.0, 0.5333), // Base 9 saturated 200%
  new Color3(1.0, 0.6549, 0.3608), // Base 14 saturated 200%
  new Color3(0.8, 0.4, 0.0), // Hue 19
  new Color3(0.0, 0.4, 0.4), // Hue 9
  new Color3(0.2, 0.4, 0.0), // Hue 6
  new Color3(0.8, 0.4, 0.0), // Hue 19
  new Color3(0.4, 0.6, 0.0), // Hue 5wwd
  new Color3(0.6, 0.2, 0.0), // Hue 2
  new Color3(0.0, 0.4, 0.0), // Hue 7
  new Color3(0.4, 0.0, 0.4), // Hue 13
  new Color3(0.0, 0.4, 0.2), // Hue 8
  new Color3(0.0, 0.2, 0.4), // Hue 10
  new Color3(0.0, 0.0, 0.4), // Hue 11
  new Color3(0.6, 0.0, 0.0), // Hue 1
  new Color3(0.2, 0.0, 0.4), // Hue 12
  new Color3(0.6, 0.0, 0.4), // Hue 14
  new Color3(0.8, 0.0, 0.4), // Hue 15
  new Color3(0.8, 0.0, 0.2), // Hue 16
  new Color3(0.8, 0.0, 0.0), // Hue 17
  new Color3(0.8, 0.2, 0.0), // Hue 18
  new Color3(0.8, 0.6, 0.0), // Hue 20
];

// Person type colors (used for nodes themselves, not swimlanes)
// Colors are assigned sequentially based on NODE_TYPE_NAMES order:
// Index 0: man (Blue)
// Index 1: woman (Magenta)
// Index 2: child (Green)
// Index 3: grandparent (Yellow)
// Index 4: Animals (Orange) - if needed
// X-parallel lane colors - pastel/lighter shades for visual distinction from Z-parallel lanes
export const X_PARALLEL_LANE_COLORS: Color3[] = [
  new Color3(0.9, 0.7, 0.7), // Light pink
  new Color3(0.7, 0.9, 0.7), // Light green
  new Color3(0.7, 0.7, 0.9), // Light blue
  new Color3(0.9, 0.9, 0.7), // Light yellow
  new Color3(0.9, 0.7, 0.9), // Light magenta
  new Color3(0.7, 0.9, 0.9), // Light cyan
  new Color3(0.8, 0.7, 0.6), // Light brown
  new Color3(1.0, 0.8, 0.6), // Light orange
  new Color3(0.8, 0.7, 0.8), // Light purple
];

export const personColors: Color3[] = [
  new Color3(0.0, 0.4, 0.4), // Hue 9
  new Color3(0.2, 0.4, 0.0), // Hue 6
  new Color3(0.8, 0.4, 0.0), // Hue 19
  new Color3(0.6, 0.6, 0.0), // Hue 4
  new Color3(0.4, 0.6, 0.0), // Hue 5
];

/**
 * Highlight colors for link selection
 * Used when nodes are clicked to highlight their connections
 */
export const LINK_HIGHLIGHT_COLORS: Color3[] = [
  new Color3(0/255, 162/255, 255/255), // Bright blue for first node
  new Color3(255/255, 234/255, 0/255), // Bright yellow for second node
  new Color3(0/255, 255/255, 128/255), // Bright green for common links (blend of blue + yellow)
];
