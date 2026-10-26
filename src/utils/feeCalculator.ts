/**
 * Fee calculation and formatting for Nevada DMV NVREG04 Receipt
 */

export interface ReceiptFees {
  plateRenewal: number;
  registrationFee: number;
  basicGovServicesTax: number;
  technologyFee: number;
}

export function parseFeeInput(val: string | number): number {
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : Number(val.toFixed(2));
  }
  const cleaned = val.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Number(parsed.toFixed(2));
}

export function formatFee(val: number | string): string {
  const num = typeof val === 'number' ? val : parseFeeInput(val);
  return num.toFixed(2);
}

export function calculateTotalFee(fees: ReceiptFees): number {
  const total =
    parseFeeInput(fees.plateRenewal) +
    parseFeeInput(fees.registrationFee) +
    parseFeeInput(fees.basicGovServicesTax) +
    parseFeeInput(fees.technologyFee);
  return Number(total.toFixed(2));
}

export function validateFeeSum(fees: ReceiptFees, expectedTotal: number | string): boolean {
  const calculated = calculateTotalFee(fees);
  const expected = typeof expectedTotal === 'number' ? expectedTotal : parseFeeInput(expectedTotal);
  return Math.abs(calculated - expected) < 0.009;
}
