/**
 * Shared string utility functions
 */

/**
 * Pads a number with leading zeros to reach the specified length
 * @param num - The number to pad
 * @param length - The desired string length
 * @returns The padded string
 * @example
 * padNumber(5, 3) // returns "005"
 * padNumber(42, 3) // returns "042"
 * padNumber(123, 3) // returns "123"
 */
export function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}