/**
 * Validation and sanitization rules for Nevada DMV Registration fields
 */

export function sanitizeField(val: string, uppercase = true): string {
  if (!val) return '';
  return uppercase ? val.toUpperCase() : val;
}

export function validateVin(vin: string): { valid: boolean; message?: string } {
  const cleaned = vin.trim().toUpperCase();
  if (!cleaned) {
    return { valid: false, message: 'VIN is required' };
  }
  // Standard VIN is 17 alphanumeric chars (excluding I, O, Q)
  if (cleaned.length !== 17) {
    return {
      valid: false,
      message: `Standard VIN should be 17 characters (currently ${cleaned.length})`,
    };
  }
  if (/[IOQ]/.test(cleaned)) {
    return {
      valid: true,
      message: 'Note: VIN contains letters I, O, or Q which are uncommon in standard 17-digit VINs',
    };
  }
  return { valid: true };
}

export function validateYear(year: string): { valid: boolean; message?: string } {
  const cleaned = year.trim();
  if (!cleaned) {
    return { valid: false, message: 'Year is required' };
  }
  const num = parseInt(cleaned, 10);
  if (isNaN(num) || num < 1900 || num > 2100) {
    return { valid: false, message: 'Enter a valid 4-digit vehicle model year (e.g. 2000)' };
  }
  return { valid: true };
}

export function formatAddressMultiline(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}
