export interface RegistrationData {
  // Row 1
  licenseNumber: string;
  year: string;
  make: string;
  type: string;
  cyl: string;
  msrp: string;
  axle: string;
  declWeight: string;
  unlWeight: string;

  // Row 2
  vin: string;
  modelName: string;
  fuel: string;
  decalNumber: string;
  plateBackground: string;

  // Header / Dates
  docYear: string; // e.g. "2022"
  expiresDate: string; // e.g. "10-14-2023"
  dmvOffice: string;
  dmvAddress: string;
  dmvCityStateZip: string;
  dmvPhone: string;

  // Address & Reference
  nameAndAddress: string;
  seqNumber: string; // "186"
  batchNumber: string; // "16658"
  formCode: string; // "Form NVREG04"

  // Receipt lines
  receiptModelName: string;
  plateRenewalFee: string;
  registrationFee: string;
  basicGovServicesTax: string;
  technologyFee: string;
  totalFee: string;
  autoCalculateTotal: boolean;

  // Decal and Layout flags
  showBarcode: boolean;
  showDottedLines: boolean;
  showDecalGuide: boolean;
  showReceiptModelName?: boolean;

  // Custom Placement & Layout Controls
  addressOffsetY?: number; // px offset to move owner name and address down
  receiptOffsetY?: number; // px vertical placement for receipt
  receiptOffsetX?: number; // px horizontal placement for receipt
  receiptLineGap?: number; // px gap between receipt lines (closer together)
  bottomDisclosureOffsetY?: number; // px offset to move bottom disclosures more down
  vinCellWidth?: number; // px width for VIN cell (shortened)
  modelCellWidth?: number; // px width for Model cell (shortened)

  // Top Header 3-Piece Independent Placement & Resize Controls
  logoOffsetX?: number; // moves DMV logo left / right
  logoOffsetY?: number; // moves DMV logo up / down
  logoScale?: number; // DMV logo scale % (70-130)

  addressBlockOffsetX?: number; // moves middle DMV address left / right
  addressBlockOffsetY?: number; // moves middle DMV address up / down
  addressBlockScale?: number; // middle DMV address text scale % (70-140)

  yearExpiresOffsetX?: number; // moves year & expiration left / right
  yearExpiresOffsetY?: number; // moves year & expiration up / down
  yearExpiresScale?: number; // year & expiration resize scale % (70-140)
}

export type FontFamilyType =
  | 'Arial, Helvetica, sans-serif'
  | '"Courier Prime", Courier, monospace'
  | '"Roboto Mono", monospace'
  | '"Roboto", sans-serif'
  | 'monospace';

export interface TypographyConfig {
  fontFamily: FontFamilyType;
  fontNameDisplay: string;
  masterScale: number; // percentage, e.g. 100
  fontWeight: 'bold' | '600' | '700' | '800' | 'normal';
  letterSpacing: number; // in px
  textTransform: 'uppercase' | 'none';
  textColor: string;
  fieldOverrides?: Record<string, { fontSize?: number; fontWeight?: string }>;
}

export interface ViewerConfig {
  zoom: number; // 0.5 to 2.0
  activePage: 1 | 2 | 'both';
  editableInline: boolean;
  showFieldOutlines: boolean;
}
