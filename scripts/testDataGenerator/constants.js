/**
 * Constants for the test data generator
 */

// Test configuration
const TEST_CONFIG = {
  numLevel1Nodes: 1, // 2 root nodes
  numLevel2Nodes: 6, // 6 second-level nodes
  numLevel3Nodes: 12, // 12 third-level nodes
  childrenPerNode: 3, // Max 3 children per parent
  numNodeTypes: 2, // People and Animals
  numLinkTypes: 3, // Owns, Wants, Eats
};

// Draw.io scaling constants for better visualization
const DRAW_IO_SCALING = {
  NODE_WIDTH_SCALE: 5, // Make nodes 5x wider
  NODE_HEIGHT_SCALE: 2, // Make nodes 2x taller
  LEVEL_SPACING_SCALE: 2, // Double the vertical spacing between levels
};

// Name pools
const GENERATOR_CONSTANTS = {
  PEOPLE_NAMES: [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Iris",
    "Jack",
  ],
  LAST_NAMES: [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ],
  ANIMAL_NAMES: [
    "Fifi",
    "Bongo",
    "Rex",
    "Luna",
    "Max",
    "Bella",
    "Rocky",
    "Daisy",
    "Shadow",
    "Buddy",
  ],
  ANIMAL_TYPES: [
    "cat",
    "dog",
    "bird",
    "rabbit",
    "hamster",
    "fish",
    "turtle",
    "snake",
    "lizard",
    "parrot",
  ],
};

// Layout constants
const LAYOUT_CONSTANTS = {
  UNIT_SIZE: 20, // Base unit in pixels
  NODE_WIDTH_UNITS: 1, // Nodes are 1 unit wide
  COLUMN_WIDTH_UNITS: 2, // Columns are 2 units wide
  TYPE_GROUP_SPACING_UNITS: 3, // Space between type groups
  LEVEL_SPACING_UNITS: 10, // Space between levels vertically
  CANVAS_PADDING_UNITS: 2, // Padding on sides
};

module.exports = {
  TEST_CONFIG,
  DRAW_IO_SCALING,
  GENERATOR_CONSTANTS,
  LAYOUT_CONSTANTS,
};
