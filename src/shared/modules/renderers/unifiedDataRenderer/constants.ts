/**
 * Constants for Unified Data Renderer
 */

// Color palettes from SimpleDataGeneratorService
export const COLOR_PALETTES = {
  NODE_COLORS: [
    [0.2, 0.4, 0.8],  // Blue
    [0.8, 0.4, 0.2],  // Orange
    [0.2, 0.8, 0.2],  // Green
    [0.8, 0.2, 0.8],  // Magenta
    [0.8, 0.8, 0.2],  // Yellow
    [0.2, 0.8, 0.8],  // Cyan
    [0.8, 0.2, 0.2],  // Red
    [0.4, 0.2, 0.6],  // Purple
    [0.6, 0.4, 0.2],  // Brown
    [0.5, 0.5, 0.5],  // Gray
  ] as [number, number, number][],

  LINK_COLORS: [
    [0.2, 0.8, 0.2],  // Green
    [0.8, 0.2, 0.8],  // Magenta
    [0.8, 0.8, 0.2],  // Yellow
    [0.2, 0.8, 0.8],  // Cyan
    [0.8, 0.2, 0.2],  // Red
    [0.4, 0.2, 0.6],  // Purple
    [0.6, 0.4, 0.2],  // Brown
    [0.5, 0.5, 0.5],  // Gray
    [0.9, 0.5, 0.1],  // Orange-Red
    [0.1, 0.5, 0.9],  // Sky Blue
  ] as [number, number, number][],
};

// Node type names
// export const NODE_TYPE_NAMES = ["People", "Animals", "Buildings", "Vehicles", "Plants", "Minerals", "Technology", "Food", "Tools", "Weather"];
export const NODE_TYPE_NAMES = ["man", "woman", "child", "grandparent"];

// Default animal types for Animals nodes
export const ANIMAL_TYPES = ["Dog", "Cat", "Bird", "Fish", "Horse", "Rabbit", "Snake", "Bear", "Hamster", "Lizard"];

// Pet types for people nodes
export const PET_TYPES = ["Dog", "Cat", "Bird", "Fish", "None", "Hamster", "Rabbit"];

// Pet colors for people nodes
export const PET_COLORS = ["Brown", "Black", "White", "Gray", "Orange", "Golden", "Spotted"];

// Name lists for person nodes
export const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert",
  "Jennifer", "Michael", "Linda", "William", "Elizabeth"
];

export const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones",
  "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"
];

// Default attachments for nodes
export const DEFAULT_ATTACHMENTS = ["top", "bottom", "left", "right", "front", "back"];