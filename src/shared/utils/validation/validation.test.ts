/**
 * Test cases for validation utilities
 * 
 * Tests injection attack prevention and edge cases
 */

import { 
  validateString, 
  validateNodeName,
  containsInjectionPattern,
  escapeHtml 
} from "./stringValidation";
import { 
  validateArray, 
  validateNodeArray,
  hasCircularReference 
} from "./arrayValidation";

/**
 * Run validation tests
 */
export function runValidationTests(): void {
  print("\n🧪 Running validation tests...\n");
  
  // Test string validation
  testStringValidation();
  
  // Test injection prevention
  testInjectionPrevention();
  
  // Test array validation
  testArrayValidation();
  
  // Test circular reference detection
  testCircularReferences();
  
  print("\n✅ All validation tests completed!\n");
}

function testStringValidation(): void {
  print("📝 Testing string validation...");
  
  // Test valid strings
  const validTests = [
    { input: "ValidNodeName", expected: true },
    { input: "Node_123", expected: true },
    { input: "Test-Node", expected: true },
    { input: "A B C", expected: true },
  ];
  
  for (const test of validTests) {
    const result = validateNodeName(test.input);
    if (result.isValid !== test.expected) {
      error(`❌ Failed: "${test.input}" expected ${test.expected}, got ${result.isValid}`);
    } else {
      print(`✓ Valid: "${test.input}"`);
    }
  }
  
  // Test invalid strings
  const invalidTests = [
    { input: "", reason: "empty string" },
    { input: "A".rep(51), reason: "exceeds 50 char limit" },
    { input: "Node<script>", reason: "contains injection" },
    { input: "Node&quot;", reason: "contains escape sequence" },
  ];
  
  for (const test of invalidTests) {
    const result = validateNodeName(test.input);
    if (result.isValid) {
      error(`❌ Failed to reject: "${test.input}" (${test.reason})`);
    } else {
      print(`✓ Rejected: "${test.input}" - ${result.error}`);
    }
  }
}

function testInjectionPrevention(): void {
  print("\n🛡️ Testing injection prevention...");
  
  const injectionTests = [
    // SQL injection attempts
    "'; DROP TABLE users; --",
    "1' OR '1'='1",
    "admin'--",
    
    // XSS attempts
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert('XSS')>",
    "javascript:alert('XSS')",
    
    // HTML injection
    "<div onclick='malicious()'>Click</div>",
    "&lt;script&gt;alert('XSS')&lt;/script&gt;",
    
    // Path traversal
    "../../../etc/passwd",
    "..\\..\\..\\windows\\system32",
  ];
  
  for (const maliciousInput of injectionTests) {
    const result = validateString(maliciousInput, {
      maxLength: 100,
      blockSpecialChars: true,
    });
    
    if (result.isValid && result.sanitized === maliciousInput) {
      error(`❌ Failed to sanitize injection: "${maliciousInput}"`);
    } else {
      const sanitized = result.sanitized || "(rejected)";
      print(`✓ Sanitized: "${maliciousInput.sub(1, 30)}..." → "${sanitized.sub(1, 30)}..."`);
    }
    
    // Also test specific injection detection
    if (containsInjectionPattern(maliciousInput)) {
      print(`  ✓ Detected injection pattern`);
    }
  }
  
  // Test HTML escaping
  const htmlTests = [
    { input: "<div>Test</div>", expected: "&lt;div&gt;Test&lt;/div&gt;" },
    { input: "A & B", expected: "A &amp; B" },
    { input: '"Quote"', expected: "&quot;Quote&quot;" },
    { input: "It's", expected: "It&#x27;s" },
  ];
  
  for (const test of htmlTests) {
    const escaped = escapeHtml(test.input);
    if (escaped === test.expected) {
      print(`✓ HTML escaped: "${test.input}" → "${escaped}"`);
    } else {
      error(`❌ HTML escape failed: expected "${test.expected}", got "${escaped}"`);
    }
  }
}

function testArrayValidation(): void {
  print("\n📊 Testing array validation...");
  
  // Test valid arrays
  const validArrays = [
    { data: [1, 2, 3], maxSize: 5 },
    { data: [], maxSize: 10, allowEmpty: true },
    { data: ["a", "b", "c"], maxSize: 3 },
  ];
  
  for (const test of validArrays) {
    const result = validateArray(test.data, {
      maxSize: test.maxSize,
      allowEmpty: test.allowEmpty,
    });
    
    if (result.isValid) {
      print(`✓ Valid array: size=${test.data.size()}`);
    } else {
      error(`❌ Rejected valid array: ${result.error}`);
    }
  }
  
  // Test invalid arrays
  const invalidArrays = [
    { data: [1, 2, 3, 4, 5], maxSize: 3, reason: "exceeds max size" },
    { data: [], allowEmpty: false, reason: "empty not allowed" },
    { data: "not an array" as any, reason: "not an array" },
  ];
  
  for (const test of invalidArrays) {
    const result = validateArray(test.data, {
      maxSize: test.maxSize,
      allowEmpty: test.allowEmpty,
    });
    
    if (!result.isValid) {
      print(`✓ Rejected: ${test.reason} - ${result.error}`);
    } else {
      error(`❌ Failed to reject: ${test.reason}`);
    }
  }
  
  // Test node array validation
  const validNodes = [
    { uuid: "node1", name: "Node 1" },
    { uuid: "node2", name: "Node 2" },
  ];
  
  const nodeResult = validateNodeArray(validNodes);
  if (nodeResult.isValid) {
    print(`✓ Valid node array`);
  } else {
    error(`❌ Failed to validate node array: ${nodeResult.error}`);
  }
  
  // Test invalid nodes
  const invalidNodes = [
    { uuid: "node1" }, // missing name
    { name: "Node 2" }, // missing uuid
  ];
  
  const invalidNodeResult = validateNodeArray(invalidNodes);
  if (!invalidNodeResult.isValid) {
    print(`✓ Rejected invalid nodes: ${invalidNodeResult.error}`);
  } else {
    error(`❌ Failed to reject invalid nodes`);
  }
}

function testCircularReferences(): void {
  print("\n🔄 Testing circular reference detection...");
  
  // Create circular reference
  const obj1: any = { name: "obj1" };
  const obj2: any = { name: "obj2", ref: obj1 };
  obj1.ref = obj2; // circular!
  
  if (hasCircularReference([obj1])) {
    print(`✓ Detected circular reference`);
  } else {
    error(`❌ Failed to detect circular reference`);
  }
  
  // Test non-circular nested structure
  const nested = {
    level1: {
      level2: {
        level3: {
          data: "deep value"
        }
      }
    }
  };
  
  if (!hasCircularReference([nested])) {
    print(`✓ Correctly identified non-circular structure`);
  } else {
    error(`❌ False positive on nested structure`);
  }
  
  // Test self-reference
  const selfRef: any = { name: "self" };
  selfRef.self = selfRef;
  
  if (hasCircularReference([selfRef])) {
    print(`✓ Detected self-reference`);
  } else {
    error(`❌ Failed to detect self-reference`);
  }
}