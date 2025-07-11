/**
 * String validation utilities for input sanitization and security
 */

export interface StringValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowEmpty?: boolean;
  blockSpecialChars?: boolean;
  customPattern?: string;
  trimWhitespace?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

// Default limits based on common Roblox constraints
export const STRING_LIMITS = {
  NODE_NAME: 50,
  LABEL_TEXT: 100,
  DESCRIPTION: 200,
  SHORT_TEXT: 25,
  MAX_SAFE_LENGTH: 1000,
} as const;

// Pattern for detecting potentially malicious characters
// Note: In Roblox Lua, we use string patterns instead of regex

/**
 * Validates a node name with specific constraints
 */
export function validateNodeName(name: string): ValidationResult {
  return validateString(name, {
    maxLength: STRING_LIMITS.NODE_NAME,
    minLength: 1,
    blockSpecialChars: true,
    trimWhitespace: true,
  });
}

/**
 * Validates label text with appropriate constraints
 */
export function validateLabelText(text: string): ValidationResult {
  return validateString(text, {
    maxLength: STRING_LIMITS.LABEL_TEXT,
    minLength: 0,
    allowEmpty: true,
    blockSpecialChars: true,
    trimWhitespace: true,
  });
}

/**
 * General string validation with configurable options
 */
export function validateString(
  input: string | undefined,
  options: StringValidationOptions = {}
): ValidationResult {
  // Handle undefined
  if (input === undefined) {
    if (options.allowEmpty) {
      return { isValid: true, sanitized: "" };
    }
    return { isValid: false, error: "Input is required" };
  }

  // Ensure input is a string
  if (!typeIs(input, "string")) {
    return { isValid: false, error: "Input must be a string" };
  }

  let sanitized = input;

  // Trim whitespace if requested
  if (options.trimWhitespace) {
    // Use Roblox string matching to trim
    sanitized = string.match(sanitized, "^%s*(.-)%s*$")[0] as string || sanitized;
  }

  // Check empty string
  if (sanitized.size() === 0 && !options.allowEmpty) {
    return { isValid: false, error: "Input cannot be empty" };
  }

  // Check minimum length
  if (options.minLength !== undefined && sanitized.size() < options.minLength) {
    return {
      isValid: false,
      error: `Input must be at least ${options.minLength} characters`,
    };
  }

  // Check maximum length
  const maxLength = options.maxLength || STRING_LIMITS.MAX_SAFE_LENGTH;
  if (sanitized.size() > maxLength) {
    return {
      isValid: false,
      error: `Input exceeds maximum length of ${maxLength} characters`,
    };
  }

  // Check for injection attempts
  if (string.match(sanitized, "[<>\"'&\\]")[0] !== undefined) {
    if (options.blockSpecialChars) {
      // Remove dangerous characters
      sanitized = string.gsub(sanitized, "[<>\"'&\\]", "")[0];
      // Recheck length after sanitization
      if (sanitized.size() === 0 && !options.allowEmpty) {
        return {
          isValid: false,
          error: "Input contains only invalid characters",
        };
      }
    } else {
      return {
        isValid: false,
        error: "Input contains potentially dangerous characters",
      };
    }
  }

  // Apply custom pattern if provided
  if (options.customPattern) {
    if (!string.match(sanitized, options.customPattern)[0]) {
      return {
        isValid: false,
        error: "Input does not match required pattern",
      };
    }
  }

  // Remove all special characters if requested
  if (options.blockSpecialChars) {
    sanitized = string.gsub(sanitized, "[^a-zA-Z0-9\s\-_.,!?]", " ")[0];
    // Clean up multiple spaces
    sanitized = string.gsub(sanitized, "%s+", " ")[0];
    // Trim again
    sanitized = string.match(sanitized, "^%s*(.-)%s*$")[0] as string || sanitized;
  }

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * Sanitizes a string by removing dangerous characters
 */
export function sanitizeString(input: string, maxLength?: number): string {
  const result = validateString(input, {
    maxLength: maxLength || STRING_LIMITS.MAX_SAFE_LENGTH,
    blockSpecialChars: true,
    trimWhitespace: true,
    allowEmpty: true,
  });

  return result.sanitized || "";
}

/**
 * Validates an array of strings
 */
export function validateStringArray(
  inputs: string[],
  options: StringValidationOptions = {}
): ValidationResult {
  if (!typeIs(inputs, "table")) {
    return { isValid: false, error: "Input must be an array" };
  }

  const sanitizedArray: string[] = [];
  
  for (let i = 0; i < inputs.size(); i++) {
    const result = validateString(inputs[i], options);
    if (!result.isValid) {
      return {
        isValid: false,
        error: `Item ${i + 1}: ${result.error}`,
      };
    }
    sanitizedArray.push(result.sanitized || inputs[i]);
  }

  return {
    isValid: true,
    sanitized: sanitizedArray.join("|"), // Return as delimited string
  };
}

/**
 * Checks if a string contains injection patterns
 */
export function containsInjectionPattern(input: string): boolean {
  return string.match(input, "[<>\"'&\\]")[0] !== undefined;
}

/**
 * Escapes HTML/XML special characters
 */
export function escapeHtml(input: string): string {
  let result = input;
  result = string.gsub(result, "&", "&amp;")[0];
  result = string.gsub(result, "<", "&lt;")[0];
  result = string.gsub(result, ">", "&gt;")[0];
  result = string.gsub(result, '"', "&quot;")[0];
  result = string.gsub(result, "'", "&#x27;")[0];
  return result;
}