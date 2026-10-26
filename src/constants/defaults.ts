import { RegistrationData, TypographyConfig } from '../types';

export const DEFAULT_REGISTRATION_DATA: RegistrationData = {
  // Row 1
  licenseNumber: '506R41',
  year: '2000',
  make: 'CHEV',
  type: 'P4D',
  cyl: '4',
  msrp: '53850',
  axle: '',
  declWeight: '',
  unlWeight: '53850',

  // Row 2
  vin: '2G1WL52J0Y1240002',
  modelName: 'LUMINA',
  fuel: 'G',
  decalNumber: '5514676',
  plateBackground: 'HOME MEANS NEVADA',

  // Header
  docYear: '2022',
  expiresDate: '10-14-2023',
  dmvOffice: 'Department of Motor Vehicles',
  dmvAddress: '555 Wright Way',
  dmvCityStateZip: 'Carson City NV 89711-0625',
  dmvPhone: '(775) 684-4368',

  // Name & Address (Single multiline field as requested)
  nameAndAddress: 'RUBEN AGUILAR\n5524 BIG SEA ST\nLAS VEGAS, NV 89110',
  seqNumber: '186',
  batchNumber: '16658',
  formCode: 'Form NVREG04',

  // Receipt lines
  receiptModelName: 'LUMINA',
  plateRenewalFee: '20.00',
  registrationFee: '33.00',
  basicGovServicesTax: '213.00',
  technologyFee: '1.00',
  totalFee: '267.00',
  autoCalculateTotal: true,

  showBarcode: true,
  showDottedLines: true,
  showDecalGuide: true,
  showReceiptModelName: true,

  // Custom Placement & Layout Offsets
  addressOffsetY: 12,
  receiptOffsetY: 0,
  receiptOffsetX: 0,
  receiptLineGap: 1,
  bottomDisclosureOffsetY: 24,
  vinCellWidth: 175,
  modelCellWidth: 110,

  // Top Header 3-Piece Alignment, Placement & Resize Defaults
  logoOffsetX: -10, // moved more left to align flush with table
  logoOffsetY: 0,
  logoScale: 100,

  addressBlockOffsetX: 0,
  addressBlockOffsetY: 0,
  addressBlockScale: 100,

  yearExpiresOffsetX: 0,
  yearExpiresOffsetY: 0, // Level with logo and address
  yearExpiresScale: 100,
};

export const BLANK_REGISTRATION_DATA: RegistrationData = {
  // Cleared fields
  licenseNumber: '',
  year: '',
  make: '',
  type: '',
  cyl: '',
  msrp: '',
  axle: '',
  declWeight: '',
  unlWeight: '',

  vin: '',
  modelName: '',
  fuel: '',
  decalNumber: '',
  plateBackground: 'HOME MEANS NEVADA',

  docYear: new Date().getFullYear().toString(),
  expiresDate: '',
  dmvOffice: 'Department of Motor Vehicles',
  dmvAddress: '555 Wright Way',
  dmvCityStateZip: 'Carson City NV 89711-0625',
  dmvPhone: '(775) 684-4368',

  nameAndAddress: '',
  seqNumber: '186',
  batchNumber: '16658',
  formCode: 'Form NVREG04',

  receiptModelName: '',
  plateRenewalFee: '20.00',
  registrationFee: '33.00',
  basicGovServicesTax: '0.00',
  technologyFee: '1.00',
  totalFee: '54.00',
  autoCalculateTotal: true,

  showBarcode: true,
  showDottedLines: true,
  showDecalGuide: true,
  showReceiptModelName: true,

  addressOffsetY: 12,
  receiptOffsetY: 0,
  receiptOffsetX: 0,
  receiptLineGap: 1,
  bottomDisclosureOffsetY: 24,
  vinCellWidth: 175,
  modelCellWidth: 110,

  logoOffsetX: -10,
  logoOffsetY: 0,
  logoScale: 100,

  addressBlockOffsetX: 0,
  addressBlockOffsetY: 0,
  addressBlockScale: 100,

  yearExpiresOffsetX: 0,
  yearExpiresOffsetY: 0,
  yearExpiresScale: 100,
};

export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontNameDisplay: 'Arial Bold (NV DMV Standard)',
  masterScale: 100,
  fontWeight: 'bold',
  letterSpacing: 0.2,
  textTransform: 'uppercase',
  textColor: '#0a0a0a',
};

export interface FieldFontInfo {
  fieldName: string;
  fieldId: string;
  section: string;
  originalFont: string;
  originalSizePt: string;
  description: string;
  standardValue: string;
}

export const IDENTIFIED_FIELD_FONTS: FieldFontInfo[] = [
  {
    fieldName: 'License Number',
    fieldId: 'licenseNumber',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Vehicle plate identifier, all uppercase bold sans-serif',
    standardValue: '506R41',
  },
  {
    fieldName: 'Year',
    fieldId: 'year',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Vehicle model year (single combined field)',
    standardValue: '2000',
  },
  {
    fieldName: 'Make',
    fieldId: 'make',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Manufacturer code (e.g. CHEV, FORD, TOYT)',
    standardValue: 'CHEV',
  },
  {
    fieldName: 'Type',
    fieldId: 'type',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Body type code (e.g. P4D = Passenger 4 Door)',
    standardValue: 'P4D',
  },
  {
    fieldName: 'Cylinder (CYL)',
    fieldId: 'cyl',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Number of cylinders (e.g. 4, 6, 8)',
    standardValue: '4',
  },
  {
    fieldName: 'MSRP',
    fieldId: 'msrp',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Base manufacturer suggested retail price in whole dollars',
    standardValue: '53850',
  },
  {
    fieldName: 'Axle',
    fieldId: 'axle',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Axle count for heavy vehicles / trailers',
    standardValue: '',
  },
  {
    fieldName: 'Decl. Weight',
    fieldId: 'declWeight',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Declared vehicle weight (commercial/heavy)',
    standardValue: '',
  },
  {
    fieldName: 'Unl. Weight',
    fieldId: 'unlWeight',
    section: 'Row 1',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Unladen weight of vehicle',
    standardValue: '53850',
  },
  {
    fieldName: 'VIN (Vehicle Identification No.)',
    fieldId: 'vin',
    section: 'Row 2',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: '17-character vehicle identification number',
    standardValue: '2G1WL52J0Y1240002',
  },
  {
    fieldName: 'Model Name',
    fieldId: 'modelName',
    section: 'Row 2',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '12pt / 16px',
    description: 'Vehicle model name',
    standardValue: 'LUMINA',
  },
  {
    fieldName: 'Fuel',
    fieldId: 'fuel',
    section: 'Row 2',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Fuel type code (G = Gas, D = Diesel, E = Electric, H = Hybrid)',
    standardValue: 'G',
  },
  {
    fieldName: 'Decal Number',
    fieldId: 'decalNumber',
    section: 'Row 2',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '13pt / 17px',
    description: 'Sequential registration sticker decal serial',
    standardValue: '5514676',
  },
  {
    fieldName: 'Plate Background',
    fieldId: 'plateBackground',
    section: 'Row 2',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '11.5pt / 15px',
    description: 'Plate graphic style (HOME MEANS NEVADA / THE SILVER STATE)',
    standardValue: 'HOME MEANS NEVADA',
  },
  {
    fieldName: 'Large Year Display',
    fieldId: 'docYear',
    section: 'Header',
    originalFont: 'Arial-BoldMT / Impact',
    originalSizePt: '38pt / 50px',
    description: 'Prominent renewal registration year banner',
    standardValue: '2022',
  },
  {
    fieldName: 'Expiration Date',
    fieldId: 'expiresDate',
    section: 'Header',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '10.5pt / 14px',
    description: 'Official expiration date (MM-DD-YYYY)',
    standardValue: '10-14-2023',
  },
  {
    fieldName: 'Name and Address',
    fieldId: 'nameAndAddress',
    section: 'Owner',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '11.5pt / 15px',
    description: 'Registered owner name and mailing street address (single multi-line block)',
    standardValue: 'RUBEN AGUILAR\n5524 BIG SEA ST\nLAS VEGAS, NV 89110',
  },
  {
    fieldName: 'Sequence Reference ("186")',
    fieldId: 'seqNumber',
    section: 'Tracking',
    originalFont: 'Arial-BoldMT',
    originalSizePt: '10pt / 13px',
    description: 'Batch sequence locator reference',
    standardValue: '186',
  },
];
