export const DEFAULT_ENTITY_TYPES = [
  "Service",
  "Component",
  "Module",
  "Interface",
  "Controller",
  "Repository",
  "Entity",
  "Utility",
  "Factory",
  "Manager",
] as const;

export const DEFAULT_CONNECTOR_TYPES = [
  "uses",
  "owns",
  "maintains",
  "implements",
  "extends",
  "depends_on",
  "configures",
  "monitors",
  "delegates_to",
  "inherits_from",
] as const;

export const NETWORK_DENSITY_MULTIPLIERS = {
  sparse: 0.5,
  medium: 1.0,
  dense: 2.0,
} as const;

export const DEFAULT_NODE_WEIGHT_RANGE = {
  min: 1,
  max: 11,
} as const;