/**
 * Array validation utilities for bounds checking and type safety
 */

export interface ArrayValidationOptions {
  maxSize?: number;
  minSize?: number;
  allowEmpty?: boolean;
  itemValidator?: (item: unknown) => boolean;
}

export interface ArrayValidationResult<T = unknown> {
  isValid: boolean;
  error?: string;
  sanitized?: T[];
}

// Default array size limits
export const ARRAY_LIMITS = {
  MAX_NODES: 1000,
  MAX_LAYERS: 20,
  MAX_CONNECTIONS: 5000,
  MAX_LABELS: 10,
  MAX_SAFE_SIZE: 10000,
} as const;

/**
 * Validates array bounds and optionally validates each item
 */
export function validateArray<T extends defined>(
  input: unknown,
  options: ArrayValidationOptions = {}
): ArrayValidationResult<T> {
  // Check if input is an array
  if (!typeIs(input, "table")) {
    return { isValid: false, error: "Input must be an array" };
  }

  const arr = input as T[];

  // Check empty array
  if (arr.size() === 0 && !options.allowEmpty) {
    return { isValid: false, error: "Array cannot be empty" };
  }

  // Check minimum size
  if (options.minSize !== undefined && arr.size() < options.minSize) {
    return {
      isValid: false,
      error: `Array must have at least ${options.minSize} items`,
    };
  }

  // Check maximum size
  const maxSize = options.maxSize || ARRAY_LIMITS.MAX_SAFE_SIZE;
  if (arr.size() > maxSize) {
    return {
      isValid: false,
      error: `Array exceeds maximum size of ${maxSize} items`,
    };
  }

  // Validate each item if validator provided
  if (options.itemValidator) {
    const sanitized: T[] = [];
    
    for (let i = 0; i < arr.size(); i++) {
      if (!options.itemValidator(arr[i])) {
        return {
          isValid: false,
          error: `Invalid item at index ${i}`,
        };
      }
      sanitized.push(arr[i]);
    }
    
    return {
      isValid: true,
      sanitized,
    };
  }

  return {
    isValid: true,
    sanitized: [...arr],
  };
}

/**
 * Validates array of nodes with specific constraints
 */
export function validateNodeArray(nodes: unknown): ArrayValidationResult {
  return validateArray(nodes, {
    maxSize: ARRAY_LIMITS.MAX_NODES,
    allowEmpty: false,
    itemValidator: (item) => {
      if (!typeIs(item, "table")) return false;
      const node = item as { uuid?: string; name?: string };
      return typeIs(node.uuid, "string") && typeIs(node.name, "string");
    },
  });
}

/**
 * Validates array bounds for layers
 */
export function validateLayerArray(layers: unknown): ArrayValidationResult {
  return validateArray(layers, {
    maxSize: ARRAY_LIMITS.MAX_LAYERS,
    minSize: 1,
    allowEmpty: false,
  });
}

/**
 * Validates connection/link array bounds
 */
export function validateConnectionArray(connections: unknown): ArrayValidationResult {
  return validateArray(connections, {
    maxSize: ARRAY_LIMITS.MAX_CONNECTIONS,
    allowEmpty: true,
  });
}

/**
 * Checks for circular references in an array
 */
export function hasCircularReference(arr: unknown[]): boolean {
  const seen = new Set<unknown>();
  
  function checkCircular(obj: unknown): boolean {
    if (obj === undefined || !typeIs(obj, "table")) {
      return false;
    }
    
    if (seen.has(obj)) {
      return true;
    }
    
    seen.add(obj);
    
    if (typeIs(obj, "table")) {
      for (const [_, item] of pairs(obj as unknown[])) {
        if (checkCircular(item)) {
          return true;
        }
      }
    } else {
      for (const [_, value] of pairs(obj)) {
        if (checkCircular(value)) {
          return true;
        }
      }
    }
    
    seen.delete(obj);
    return false;
  }
  
  return checkCircular(arr);
}

/**
 * Safely slices an array to maximum size
 */
export function truncateArray<T extends defined>(arr: T[], maxSize: number): T[] {
  if (arr.size() <= maxSize) {
    return arr;
  }
  
  const truncated: T[] = [];
  for (let i = 0; i < maxSize; i++) {
    truncated.push(arr[i]);
  }
  
  return truncated;
}