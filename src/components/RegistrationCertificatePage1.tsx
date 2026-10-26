import React from 'react';
import { RegistrationData, TypographyConfig } from '../types';

interface Page1Props {
  data: RegistrationData;
  typography: TypographyConfig;
  editableInline?: boolean;
  onChangeField?: (field: keyof RegistrationData, value: any) => void;
  scale?: number;
}

export const RegistrationCertificatePage1: React.FC<Page1Props> = ({
  data,
  typography,
  editableInline = true,
  onChangeField,
}) => {
  const fontStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight,
    letterSpacing: `${typography.letterSpacing}px`,
    color: typography.textColor,
  };

  const masterFontScale = typography.masterScale / 100;

  const handleInput = (field: keyof RegistrationData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onChangeField) {
      const val = typography.textTransform === 'uppercase' ? e.target.value.toUpperCase() : e.target.value;
      onChangeField(field, val);

      // If user edits modelName, also keep receiptModelName in sync
      if (field === 'modelName') {
        onChangeField('receiptModelName', val);
      }
    }
  };

  // Layout offsets & sizing
  const addressOffsetY = data.addressOffsetY ?? 12;
  const receiptOffsetY = data.receiptOffsetY ?? 0;
  const receiptOffsetX = data.receiptOffsetX ?? 0;
  const receiptLineGap = data.receiptLineGap ?? 1;
  const bottomDisclosureOffsetY = data.bottomDisclosureOffsetY ?? 24;
  const vinWidth = data.vinCellWidth ?? 175;
  const modelWidth = data.modelCellWidth ?? 110;

  // Header 3-Piece Layout Offsets & Sizing
  const logoOffsetX = data.logoOffsetX ?? -10;
  const logoOffsetY = data.logoOffsetY ?? 0;
  const logoScale = data.logoScale ?? 100;

  const addressBlockOffsetX = data.addressBlockOffsetX ?? 0;
  const addressBlockOffsetY = data.addressBlockOffsetY ?? 0;
  const addressBlockScale = data.addressBlockScale ?? 100;

  const yearExpiresOffsetX = data.yearExpiresOffsetX ?? 0;
  const yearExpiresOffsetY = data.yearExpiresOffsetY ?? 0;
  const yearExpiresScale = data.yearExpiresScale ?? 100;

  return (
    <div
      id="nv-registration-page-1"
      className="relative bg-white text-black select-text shadow-xl print-page mx-auto"
      style={{
        width: '816px',
        height: '1056px',
        padding: '38px 44px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Upper Section: Certificate (Left) and Decal (Right) */}
      <div className="relative flex w-full" style={{ height: '375px' }}>
        {/* Left Side: The Main Registration Certificate */}
        <div style={{ width: '600px', paddingRight: '20px' }}>
          {/* Header Row: 3 Independent Pieces (DMV Logo, Centered Address, Year & Expiration) - Level & Centered */}
          <div
            className="flex items-center justify-between"
            style={{
              marginBottom: '14px',
              minHeight: '70px',
              position: 'relative',
            }}
          >
            {/* Piece 1: DMV Logo (Moved left flush with grid border, independent X/Y & Scale) */}
            <div
              style={{
                width: `${135 * (logoScale / 100)}px`,
                transform: `translate(${logoOffsetX}px, ${logoOffsetY}px)`,
                transformOrigin: 'left center',
                flexShrink: 0,
                transition: 'transform 0.1s ease',
              }}
            >
              <img
                src="/assets/dmv/clean_dmv_logo.png"
                alt="Nevada DMV"
                className="w-full h-auto object-contain block"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>

            {/* Piece 2: DMV Name and Address (Centered between logo & year, text-centered, independent X/Y & Scale) */}
            <div
              className="flex-1 flex flex-col items-center justify-center text-center px-2"
              style={{
                transform: `translate(${addressBlockOffsetX}px, ${addressBlockOffsetY}px) scale(${addressBlockScale / 100})`,
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease',
              }}
            >
              <div
                style={{
                  fontSize: '8px',
                  lineHeight: '1.25',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  color: '#111827',
                  textAlign: 'center',
                }}
              >
                <div className="font-bold text-[8.5px]">Department of Motor Vehicles</div>
                <div>555 Wright Way</div>
                <div>Carson City NV 89711-0625</div>
                <div>(775) 684-4368</div>
              </div>
            </div>

            {/* Piece 3: Year & Expiration (Independent X/Y & Scale, Level with header baseline) */}
            <div
              className="flex items-center gap-3 transition-transform"
              style={{
                transform: `translate(${yearExpiresOffsetX}px, ${yearExpiresOffsetY}px) scale(${yearExpiresScale / 100})`,
                transformOrigin: 'right center',
                flexShrink: 0,
                transition: 'transform 0.1s ease',
              }}
            >
              <div className="relative group">
                <input
                  type="text"
                  value={data.docYear}
                  onChange={handleInput('docYear')}
                  className="bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-black text-right border-0 outline-none p-0 transition-colors cursor-text"
                  style={{
                    fontSize: `${38 * masterFontScale}px`,
                    width: '110px',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    lineHeight: '1',
                  }}
                  title="Click to edit Year Display (e.g. 2022)"
                />
              </div>

              <div
                style={{
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  lineHeight: '1.2',
                }}
              >
                <div className="font-bold text-[9px] tracking-wider text-black">EXPIRES</div>
                <input
                  type="text"
                  value={data.expiresDate}
                  onChange={handleInput('expiresDate')}
                  className="bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold text-[11px] text-black tracking-tight border-0 outline-none p-0 w-24 cursor-text"
                  title="Click to edit Expiration Date"
                />
              </div>
            </div>
          </div>

          {/* Form Grid: Row 1 and Row 2 */}
          <div
            className="w-full border-[1.5px] border-black bg-white"
            style={{ marginBottom: '14px' }}
          >
            {/* ROW 1 */}
            <div className="flex border-b border-black text-black" style={{ height: '36px' }}>
              {/* License Number (width 130px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '130px' }}
              >
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  LICENSE NUMBER
                </span>
                <input
                  type="text"
                  value={data.licenseNumber}
                  onChange={handleInput('licenseNumber')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit License Number"
                  placeholder="506R41"
                />
              </div>

              {/* Year (Combined single field, width 60px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '60px' }}
              >
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  YEAR
                </span>
                <input
                  type="text"
                  value={data.year}
                  onChange={handleInput('year')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit Vehicle Year"
                  placeholder="2000"
                />
              </div>

              {/* Make (width 60px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '60px' }}
              >
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  MAKE
                </span>
                <input
                  type="text"
                  value={data.make}
                  onChange={handleInput('make')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit Vehicle Make"
                  placeholder="CHEV"
                />
              </div>

              {/* Type (width 45px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '45px' }}
              >
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  TYPE
                </span>
                <input
                  type="text"
                  value={data.type}
                  onChange={handleInput('type')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit Body Type"
                  placeholder="P4D"
                />
              </div>

              {/* Cyl (width 35px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '35px' }}
              >
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  CYL
                </span>
                <input
                  type="text"
                  value={data.cyl}
                  onChange={handleInput('cyl')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit Cylinders"
                  placeholder="4"
                />
              </div>

              {/* MSRP (width 85px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '85px' }}
              >
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  MSRP
                </span>
                <input
                  type="text"
                  value={data.msrp}
                  onChange={handleInput('msrp')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit MSRP"
                  placeholder="53850"
                />
              </div>

              {/* Axle Decl. Weght (width 85px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '85px' }}
              >
                <span className="text-[6.2px] font-bold tracking-tight text-black uppercase">
                  AXLE DECL. WEGHT
                </span>
                <input
                  type="text"
                  value={data.declWeight}
                  onChange={handleInput('declWeight')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit Axle Decl. Weight"
                />
              </div>

              {/* Unl. Weght (remaining width) */}
              <div className="flex-1 flex flex-col justify-between p-[2px_4px] group">
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  UNL WEGHT
                </span>
                <input
                  type="text"
                  value={data.unlWeight}
                  onChange={handleInput('unlWeight')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit Unladen Weight"
                  placeholder="53850"
                />
              </div>
            </div>

            {/* ROW 2: Shortened VIN & Model cell, Expanded Plate Background */}
            <div className="flex text-black" style={{ height: '38px' }}>
              {/* VIN: Shortened from 250px to 175px (configurable) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: `${vinWidth}px` }}
              >
                <span className="text-[6.2px] font-bold tracking-tight text-black uppercase">
                  VEHICLE INDENTIFICATION NUMBER
                </span>
                <input
                  type="text"
                  value={data.vin}
                  onChange={handleInput('vin')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wider border-0 outline-none p-0 transition-colors cursor-text font-mono truncate"
                  style={{ ...fontStyle, fontSize: `${11 * masterFontScale}px` }}
                  title="Click to edit VIN"
                  placeholder="2G1WL52J0Y1240002"
                />
              </div>

              {/* Model Name: Shortened from 165px to 110px (configurable) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group relative bg-amber-50/30 hover:bg-blue-50/50 transition-colors"
                style={{ width: `${modelWidth}px` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                    MODEL NAME
                  </span>
                  <span className="text-[6px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity no-print">
                    ✎
                  </span>
                </div>
                <input
                  type="text"
                  id="doc-model-name-input"
                  value={data.modelName}
                  onChange={handleInput('modelName')}
                  className="w-full bg-transparent hover:bg-blue-100/50 focus:bg-blue-100/80 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate text-slate-950"
                  style={{ ...fontStyle, fontSize: `${12 * masterFontScale}px` }}
                  title="Model Name (Click to edit)"
                  placeholder="LUMINA"
                />
              </div>

              {/* Fuel (width 35px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '35px' }}
              >
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  FUEL
                </span>
                <input
                  type="text"
                  value={data.fuel}
                  onChange={handleInput('fuel')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate text-center"
                  style={{ ...fontStyle, fontSize: `${12.5 * masterFontScale}px` }}
                  title="Click to edit Fuel"
                  placeholder="G"
                />
              </div>

              {/* Decal Number (width 70px) */}
              <div
                className="border-r border-black flex flex-col justify-between p-[2px_4px] group"
                style={{ width: '70px' }}
              >
                <span className="text-[6.5px] font-bold tracking-tight text-black uppercase">
                  DECAL NUMBER
                </span>
                <input
                  type="text"
                  value={data.decalNumber}
                  onChange={handleInput('decalNumber')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-wide border-0 outline-none p-0 transition-colors cursor-text truncate"
                  style={{ ...fontStyle, fontSize: `${12 * masterFontScale}px` }}
                  title="Click to edit Decal Number"
                  placeholder="5514676"
                />
              </div>

              {/* Plate Background: Expanded with all remaining room (~210px) to comfortably fit HOME MEANS NEVADA! */}
              <div className="flex-1 flex flex-col justify-between p-[2px_6px] group bg-slate-50/40">
                <span className="text-[6.2px] font-bold tracking-tight text-black uppercase">
                  PLATE BACKGROUND
                </span>
                <input
                  type="text"
                  value={data.plateBackground}
                  onChange={handleInput('plateBackground')}
                  className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold uppercase tracking-tight border-0 outline-none p-0 transition-colors cursor-text"
                  style={{ ...fontStyle, fontSize: `${11 * masterFontScale}px` }}
                  title="Click to edit Plate Background (Full room to fit entire text)"
                  placeholder="HOME MEANS NEVADA"
                />
              </div>
            </div>
          </div>

          {/* Bottom Area: Left (Sequence, Name/Address, Disclosures) & Right (Receipt & Barcode) */}
          <div className="flex justify-between items-start" style={{ minHeight: '190px' }}>
            {/* Left Block: 186 Ref, Owner Name and Address (with Y-offset control), and Disclosures (more down) */}
            <div className="flex flex-col justify-between" style={{ width: '270px', minHeight: '190px' }}>
              {/* Name & Address Container with custom Y offset */}
              <div
                className="transition-transform"
                style={{
                  transform: `translateY(${addressOffsetY}px)`,
                }}
              >
                {/* 186 Reference */}
                <div
                  className="font-bold text-[11px] text-black"
                  style={{ marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  <input
                    type="text"
                    value={data.seqNumber}
                    onChange={handleInput('seqNumber')}
                    className="bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded font-bold text-[11px] text-black border-0 outline-none p-0 w-16 cursor-text"
                    title="Click to edit Sequence Number"
                  />
                </div>

                {/* Name and Address: Single Fillable Box as requested */}
                <div style={{ marginBottom: '10px' }}>
                  <textarea
                    rows={3}
                    value={data.nameAndAddress}
                    onChange={handleInput('nameAndAddress')}
                    className="w-full bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 p-1 text-[11px] font-bold uppercase leading-snug rounded border-0 outline-none resize-none cursor-text transition-colors"
                    style={{ ...fontStyle, fontSize: `${11 * masterFontScale}px` }}
                    title="Click to edit Owner Name & Address (Multiline)"
                    placeholder="OWNER NAME & ADDRESS"
                  />
                </div>
              </div>

              {/* Bottom Disclosures (Moved more down with custom offset) */}
              <div
                className="transition-all"
                style={{
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontSize: '7.8px',
                  lineHeight: '1.3',
                  color: '#000000',
                  marginTop: `${14 + bottomDisclosureOffsetY}px`,
                }}
              >
                <div className="font-bold tracking-tight">
                  PLATES AND REGISTRATION MUST BE RETURNED WHEN NOT OPERATING VEHICLE
                </div>
                <div className="font-normal text-[7.5px] mt-[1px]">
                  {data.formCode} Batch {data.batchNumber} Seq {data.seqNumber}
                </div>
              </div>
            </div>

            {/* Right Block: Receipt Fees and Authentic Barcode */}
            <div className="flex items-start gap-4">
              {/* Receipt Block: Custom placement & line spacing (closer together) */}
              <div
                className="text-[8px] font-bold text-black transition-all"
                style={{
                  width: '215px',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  transform: `translate(${receiptOffsetX}px, ${receiptOffsetY}px)`,
                }}
              >
                {/* Receipt Line 0: Model Name */}
                {data.showReceiptModelName !== false && (
                  <div
                    className="flex justify-between items-baseline group"
                    style={{ marginBottom: `${receiptLineGap}px` }}
                  >
                    <span className="truncate pr-1 uppercase text-left font-bold text-slate-800">
                      MODEL NAME
                    </span>
                    <input
                      type="text"
                      value={data.receiptModelName !== undefined ? data.receiptModelName : data.modelName}
                      onChange={e => {
                        const val = typography.textTransform === 'uppercase' ? e.target.value.toUpperCase() : e.target.value;
                        onChangeField?.('receiptModelName', val);
                      }}
                      className="text-right uppercase font-bold bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded border-0 outline-none w-28 p-0 cursor-text"
                      title="Receipt Model Name (Click to edit)"
                      placeholder="MODEL"
                    />
                  </div>
                )}

                {/* Receipt Line 1: Plate Renewal */}
                <div
                  className="flex justify-between items-baseline group"
                  style={{ marginBottom: `${receiptLineGap}px` }}
                >
                  <span className="truncate pr-1 uppercase text-left">PLATE RENEWAL</span>
                  <input
                    type="text"
                    value={data.plateRenewalFee}
                    onChange={handleInput('plateRenewalFee')}
                    className="text-right tabular-nums bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded border-0 outline-none w-16 p-0 cursor-text font-mono font-bold"
                  />
                </div>

                {/* Receipt Line 2: Registration Fee */}
                <div
                  className="flex justify-between items-baseline group"
                  style={{ marginBottom: `${receiptLineGap}px` }}
                >
                  <span className="truncate pr-1 uppercase text-left">REGISTRATION FEE-PASSENGER VEHICL</span>
                  <input
                    type="text"
                    value={data.registrationFee}
                    onChange={handleInput('registrationFee')}
                    className="text-right tabular-nums bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded border-0 outline-none w-16 p-0 cursor-text font-mono font-bold"
                  />
                </div>

                {/* Receipt Line 3: Basic Gov Services Tax */}
                <div
                  className="flex justify-between items-baseline group"
                  style={{ marginBottom: `${receiptLineGap}px` }}
                >
                  <span className="truncate pr-1 uppercase text-left">BASIC GOV SERVICES TAX - LAS VEGAS</span>
                  <input
                    type="text"
                    value={data.basicGovServicesTax}
                    onChange={handleInput('basicGovServicesTax')}
                    className="text-right tabular-nums bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded border-0 outline-none w-16 p-0 cursor-text font-mono font-bold"
                  />
                </div>

                {/* Receipt Line 4: Technology Fee */}
                <div
                  className="flex justify-between items-baseline group"
                  style={{ marginBottom: `${receiptLineGap}px` }}
                >
                  <span className="truncate pr-1 uppercase text-left">TECHNOLOGY FEE-VR</span>
                  <input
                    type="text"
                    value={data.technologyFee}
                    onChange={handleInput('technologyFee')}
                    className="text-right tabular-nums bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded border-0 outline-none w-16 p-0 cursor-text font-mono font-bold"
                  />
                </div>

                {/* Total Fee Line */}
                <div className="flex justify-between items-baseline pt-1 mt-1 font-black text-[9.5px] border-t border-black/20">
                  <span className="uppercase text-left">TOTAL FEE:</span>
                  <input
                    type="text"
                    value={data.totalFee}
                    onChange={handleInput('totalFee')}
                    className="text-right tabular-nums font-black bg-transparent hover:bg-blue-50/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded border-0 outline-none w-20 p-0 cursor-text font-mono"
                  />
                </div>
              </div>

              {/* Barcode Section */}
              {data.showBarcode && (
                <div style={{ width: '65px' }} className="flex flex-col items-center">
                  <img
                    src="/assets/dmv/clean_barcode.png"
                    alt="Nevada DMV 2D Barcode"
                    className="w-full h-auto object-contain block"
                    style={{
                      maxHeight: '190px',
                      imageRendering: 'pixelated',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vertical Dotted Cut / Tear Line */}
        {data.showDottedLines && (
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: '608px',
              borderLeft: '1.5px dotted #000000',
              height: '100%',
            }}
          />
        )}

        {/* Right Side: Peel-off Decal and Application Instructions */}
        <div
          className="flex-1 flex flex-col justify-between items-center"
          style={{ paddingLeft: '22px' }}
        >
          {/* Decal Placeholder Box with Clean Vector Corner Marks */}
          {data.showDecalGuide && (
            <div
              className="relative w-[110px] h-[135px] mt-2 flex flex-col justify-between items-center text-black"
              style={{
                fontFamily: 'Arial, Helvetica, sans-serif',
                userSelect: 'none',
              }}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 110 135" fill="none" stroke="#000000" strokeWidth="1.2">
                <path d="M 6 16 L 6 6 L 16 6" />
                <path d="M 52 6 L 55 10 L 58 6" />
                <path d="M 94 6 L 104 6 L 104 16" />
                <path d="M 6 36 L 10 39 L 6 42" />
                <path d="M 104 36 L 100 39 L 104 42" />
                <path d="M 6 93 L 10 96 L 6 99" />
                <path d="M 104 93 L 100 96 L 104 99" />
                <path d="M 6 119 L 6 129 L 16 129" />
                <path d="M 52 129 L 55 125 L 58 129" />
                <path d="M 94 129 L 104 129 L 104 119" />
              </svg>

              <div className="text-center font-bold my-auto pt-2">
                <div className="text-[8.5px] uppercase tracking-wider text-neutral-400">
                  PEEL-OFF DECAL
                </div>
                <div className="text-[13px] font-black text-black mt-1 leading-tight">{data.docYear}</div>
                <div className="text-[8.5px] font-mono text-neutral-700 tracking-wider mt-0.5">{data.decalNumber}</div>
              </div>
            </div>
          )}

          {/* Decal instructions as on original */}
          <div
            className="text-[7.5px] text-neutral-800 leading-tight text-left mt-6"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif', maxWidth: '120px' }}
          >
            Instructions for applying the decal to the rear license plate are on the reversed of this form.
          </div>
        </div>
      </div>

      {/* Horizontal Dotted Tear Line */}
      {data.showDottedLines && (
        <div
          className="w-full my-4"
          style={{
            borderTop: '1.5px dotted #000000',
            marginTop: '14px',
            marginBottom: '20px',
          }}
        />
      )}

      {/* Lower Page Area (Notice / Blank Tear-off Form as on original document) */}
      <div className="w-full flex flex-col justify-between" style={{ minHeight: '520px' }}>
        <div className="text-neutral-400 text-[10px] text-center pt-8 select-none">
          <div className="border border-dashed border-neutral-300 rounded p-6 max-w-lg mx-auto bg-neutral-50/50">
            <div className="font-semibold text-neutral-600 text-[11px] mb-1">
              STATE OF NEVADA &bull; DEPARTMENT OF MOTOR VEHICLES
            </div>
            <div className="text-[9.5px] text-neutral-500">
              OFFICIAL VEHICLE REGISTRATION CERTIFICATE AND PEEL-OFF EXPIRATION DECAL
            </div>
            <div className="text-[8.5px] text-neutral-400 mt-2">
              Fold or detach upper card along dotted lines to carry in vehicle.
            </div>
          </div>
        </div>

        {/* Bottom Page Numbering */}
        <div className="flex justify-between items-center text-[8px] text-neutral-400 px-2 pb-2">
          <span>NVREG04 (REV. 10/2021)</span>
          <span>PAGE 1 OF 2</span>
        </div>
      </div>
    </div>
  );
};
