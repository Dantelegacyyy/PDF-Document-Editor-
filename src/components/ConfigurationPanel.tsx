import React, { useState } from 'react';
import { RegistrationData, TypographyConfig, FontFamilyType } from '../types';
import { IDENTIFIED_FIELD_FONTS, DEFAULT_REGISTRATION_DATA, BLANK_REGISTRATION_DATA } from '../constants/defaults';
import { calculateTotalFee, formatFee } from '../utils/feeCalculator';
import {
  Save,
  Trash2,
  RotateCcw,
  Download,
  Printer,
  Sliders,
  Type,
  Receipt,
  FileText,
  CheckCircle2,
  Sparkles,
  Info,
  Unlock,
  Move,
  Columns,
  AlignJustify,
} from 'lucide-react';

interface ConfigurationPanelProps {
  data: RegistrationData;
  onChangeData: (data: RegistrationData) => void;
  typography: TypographyConfig;
  onChangeTypography: (typography: TypographyConfig) => void;
  onSaveToStorage: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isSaved: boolean;
  isExporting: boolean;
  exportStatus?: string;
  includePage2?: boolean;
  onChangeIncludePage2?: (include: boolean) => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  data,
  onChangeData,
  typography,
  onChangeTypography,
  onSaveToStorage,
  onExportPdf,
  onPrint,
  isSaved,
  isExporting,
  exportStatus,
  includePage2 = false,
  onChangeIncludePage2,
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'placement' | 'typography' | 'receipt'>('fields');

  const updateField = (field: keyof RegistrationData, value: any) => {
    const updated = { ...data, [field]: value };

    // When modelName changes, keep receiptModelName in sync
    if (field === 'modelName') {
      updated.receiptModelName = value;
    }

    // Auto-update total fee if autoCalculateTotal is enabled and fee fields changed
    if (
      updated.autoCalculateTotal &&
      ['plateRenewalFee', 'registrationFee', 'basicGovServicesTax', 'technologyFee'].includes(field as string)
    ) {
      const calculated = calculateTotalFee({
        plateRenewal: parseFloat(updated.plateRenewalFee) || 0,
        registrationFee: parseFloat(updated.registrationFee) || 0,
        basicGovServicesTax: parseFloat(updated.basicGovServicesTax) || 0,
        technologyFee: parseFloat(updated.technologyFee) || 0,
      });
      updated.totalFee = formatFee(calculated);
    }

    onChangeData(updated);
  };

  const handleClearFields = () => {
    onChangeData({ ...BLANK_REGISTRATION_DATA });
  };

  const handleResetToSample = () => {
    onChangeData({ ...DEFAULT_REGISTRATION_DATA });
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none shadow-sm">
      {/* Top Header & Save Actions Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-bold text-slate-800 text-sm leading-tight">Master Configuration Box</h2>
              <p className="text-[11px] text-slate-500">Live controls connected to document</p>
            </div>
          </div>

          {/* Saved Status Indicator */}
          <div className="flex items-center gap-1.5">
            {isSaved ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Locked & Saved
              </span>
            ) : (
              <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Unsaved edits
              </span>
            )}
          </div>
        </div>

        {/* Master Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSaveToStorage}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-[0.98]"
            title="Lock in all fields into browser storage so reload will never reset them"
          >
            <Save className="w-3.5 h-3.5" />
            Save & Lock In
          </button>

          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-[0.98]"
            title="Download high-resolution 8.5x11 PDF to your laptop"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* 1-Page vs 2-Page Scope Toggle */}
        <div className="flex items-center justify-between mt-2 pt-1.5 px-1 border-t border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includePage2}
              onChange={e => onChangeIncludePage2?.(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
            <span className="text-[11px] font-medium text-slate-700">Include Page 2 (Reverse Instructions)</span>
          </label>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            {includePage2 ? '2-Page PDF' : '1-Page PDF'}
          </span>
        </div>

        {/* Export status note */}
        {exportStatus && (
          <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-center font-medium animate-pulse">
            {exportStatus}
          </div>
        )}

        {/* Secondary Actions: Clear Fields, Load Sample, Print */}
        <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-200">
          <button
            onClick={handleClearFields}
            className="flex items-center gap-1 px-2 py-1 text-[11px] text-red-600 hover:bg-red-50 rounded font-medium transition"
            title="Clear all fields to start with an empty template"
          >
            <Trash2 className="w-3 h-3" /> Clear Fields
          </button>

          <button
            onClick={handleResetToSample}
            className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100 rounded font-medium transition"
            title="Reload mirror copy from the original attached PDF"
          >
            <RotateCcw className="w-3 h-3" /> Load Original
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100 rounded font-medium transition"
            title="Print or Save as PDF with native browser dialog"
          >
            <Printer className="w-3 h-3" /> Print
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveTab('fields')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
            activeTab === 'fields'
              ? 'border-blue-600 text-blue-600 bg-blue-50/30'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title="Edit Row 1, Row 2, Header, Address"
        >
          <Sliders className="w-3.5 h-3.5" /> Fields
        </button>

        <button
          onClick={() => setActiveTab('placement')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
            activeTab === 'placement'
              ? 'border-blue-600 text-blue-600 bg-blue-50/30'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title="Move Address down, Year down, Receipt gap, Disclosure down, Column widths"
        >
          <Move className="w-3.5 h-3.5" /> Placement
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
            activeTab === 'typography'
              ? 'border-blue-600 text-blue-600 bg-blue-50/30'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title="Font Inspector & Controls"
        >
          <Type className="w-3.5 h-3.5" /> Fonts
        </button>

        <button
          onClick={() => setActiveTab('receipt')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
            activeTab === 'receipt'
              ? 'border-blue-600 text-blue-600 bg-blue-50/30'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title="Receipt fees and alignment"
        >
          <Receipt className="w-3.5 h-3.5" /> Receipt
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: FORM FIELDS */}
        {activeTab === 'fields' && (
          <div className="space-y-5">
            {/* ROW 1 FIELDS SECTION */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Row 1 Fields (Upper Grid)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">7 Columns</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={data.licenseNumber}
                      onChange={e => updateField('licenseNumber', e.target.value)}
                      placeholder="e.g. 506R41"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Year (Combined Field)
                    </label>
                    <input
                      type="text"
                      value={data.year}
                      onChange={e => updateField('year', e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Make
                    </label>
                    <input
                      type="text"
                      value={data.make}
                      onChange={e => updateField('make', e.target.value)}
                      placeholder="CHEV"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Type 4 / Type
                    </label>
                    <input
                      type="text"
                      value={data.type}
                      onChange={e => updateField('type', e.target.value)}
                      placeholder="P4D"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Cyl
                    </label>
                    <input
                      type="text"
                      value={data.cyl}
                      onChange={e => updateField('cyl', e.target.value)}
                      placeholder="4"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      MSRP
                    </label>
                    <input
                      type="text"
                      value={data.msrp}
                      onChange={e => updateField('msrp', e.target.value)}
                      placeholder="53850"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Axle / Decl. Wt
                    </label>
                    <input
                      type="text"
                      value={data.declWeight}
                      onChange={e => updateField('declWeight', e.target.value)}
                      placeholder=""
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Unl. Weight
                    </label>
                    <input
                      type="text"
                      value={data.unlWeight}
                      onChange={e => updateField('unlWeight', e.target.value)}
                      placeholder="53850"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2 FIELDS SECTION */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Row 2 Fields (Lower Grid)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">5 Columns</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    VIN (Vehicle Identification Number)
                  </label>
                  <input
                    type="text"
                    value={data.vin}
                    onChange={e => updateField('vin', e.target.value)}
                    placeholder="2G1WL52J0Y1240002"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold font-mono text-slate-900"
                  />
                </div>

                {/* Model Name - Dedicated Unlocked Section */}
                <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                      <Unlock className="w-3.5 h-3.5 text-blue-600" />
                      Vehicle Model Name (Unlocked)
                    </label>
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                      Fully Editable
                    </span>
                  </div>
                  <input
                    type="text"
                    id="cfg-model-name-input"
                    value={data.modelName}
                    onChange={e => {
                      updateField('modelName', e.target.value.toUpperCase());
                    }}
                    placeholder="Enter vehicle model (e.g. LUMINA, COROLLA, MODEL Y)"
                    className="w-full px-2.5 py-1.5 text-xs border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-500 outline-none uppercase font-bold text-slate-950 bg-white shadow-xs"
                  />
                  {/* Quick Model Presets */}
                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    <span className="text-[9.5px] text-slate-500 font-medium mr-0.5">Quick Presets:</span>
                    {['LUMINA', 'CAMRY', 'CIVIC', 'MODEL Y', 'F-150', 'SILVERADO', 'COROLLA', 'MUSTANG'].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => updateField('modelName', m)}
                        className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold border transition cursor-pointer ${
                          data.modelName === m
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Fuel
                    </label>
                    <input
                      type="text"
                      value={data.fuel}
                      onChange={e => updateField('fuel', e.target.value)}
                      placeholder="G"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Decal Number
                    </label>
                    <input
                      type="text"
                      value={data.decalNumber}
                      onChange={e => updateField('decalNumber', e.target.value)}
                      placeholder="5514676"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Plate Background
                    </label>
                    <input
                      type="text"
                      value={data.plateBackground}
                      onChange={e => updateField('plateBackground', e.target.value)}
                      placeholder="HOME MEANS NEVADA"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* HEADER, DATES & TRACKING SECTION */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Header Display, Expiration &amp; References
                </h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Year Display (Large)
                    </label>
                    <input
                      type="text"
                      value={data.docYear}
                      onChange={e => updateField('docYear', e.target.value)}
                      placeholder="2022"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={data.expiresDate}
                      onChange={e => updateField('expiresDate', e.target.value)}
                      placeholder="10-14-2023"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Seq / Reference Number
                    </label>
                    <input
                      type="text"
                      value={data.seqNumber}
                      onChange={e => updateField('seqNumber', e.target.value)}
                      placeholder="186"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={data.batchNumber}
                      onChange={e => updateField('batchNumber', e.target.value)}
                      placeholder="16658"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* NAME & ADDRESS SECTION (Single Combined Field as Requested) */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Name and Address Section
                  </h3>
                </div>
                <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">
                  Single Combined Field
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Registered Owner Name &amp; Address (Multi-line)
                </label>
                <textarea
                  rows={3}
                  value={data.nameAndAddress}
                  onChange={e => updateField('nameAndAddress', e.target.value)}
                  placeholder="RUBEN AGUILAR&#10;5524 BIG SEA ST&#10;LAS VEGAS, NV 89110"
                  className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold uppercase leading-relaxed text-slate-900"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Line 1: Full Name | Line 2: Street Address | Line 3: City, State, ZIP
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLACEMENT & POSITIONING CONTROLS */}
        {activeTab === 'placement' && (
          <div className="space-y-4">
            {/* Name & Address Vertical Placement */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Move className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Name &amp; Address Vertical Placement
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-blue-600">
                  {data.addressOffsetY ?? 12}px down
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-2">
                Move the registered owner name and street address down or up.
              </p>
              <input
                type="range"
                min={-10}
                max={50}
                step={1}
                value={data.addressOffsetY ?? 12}
                onChange={e => updateField('addressOffsetY', parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex items-center justify-between mt-2 gap-1">
                <button
                  type="button"
                  onClick={() => updateField('addressOffsetY', (data.addressOffsetY ?? 12) - 3)}
                  className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                >
                  ▲ Move Up (-3px)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('addressOffsetY', 12)}
                  className="px-2 py-1 text-[10px] bg-blue-50 text-blue-700 font-semibold rounded border border-blue-200"
                >
                  Default (+12px)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('addressOffsetY', (data.addressOffsetY ?? 12) + 3)}
                  className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                >
                  ▼ Move Down (+3px)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('addressOffsetY', 30)}
                  className="px-2 py-1 text-[10px] bg-amber-50 text-amber-700 font-semibold rounded border border-amber-200"
                >
                  Lower (+30px)
                </button>
              </div>
            </div>

            {/* TOP HEADER 3-PIECE ALIGNMENT & SIZING SUITE */}
            <div className="border-2 border-indigo-200 bg-indigo-50/40 rounded-xl p-3.5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-200/80">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-700" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Top Header: 3-Piece Leveling &amp; Controls
                    </h3>
                    <p className="text-[10px] text-slate-600">
                      Independent 4-way movement, leveling, and resize for Logo, DMV Address, and Year/Expiration.
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onChangeData({
                        ...data,
                        logoOffsetY: 0,
                        addressBlockOffsetY: 0,
                        yearExpiresOffsetY: 0,
                      });
                    }}
                    className="px-2.5 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs transition-colors"
                    title="Aligns all 3 pieces perfectly on the same horizontal baseline"
                  >
                    Level All 3 Pieces
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeData({
                        ...data,
                        logoOffsetX: -10,
                        logoOffsetY: 0,
                        logoScale: 100,
                        addressBlockOffsetX: 0,
                        addressBlockOffsetY: 0,
                        addressBlockScale: 100,
                        yearExpiresOffsetX: 0,
                        yearExpiresOffsetY: 0,
                        yearExpiresScale: 100,
                      });
                    }}
                    className="px-2 py-1 text-[10px] bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* PIECE 1: DMV Logo (Left) */}
              <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className="text-[11px] font-bold text-slate-800">1. DMV Logo (Left)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700">
                    X: {data.logoOffsetX ?? -10}px | Y: {data.logoOffsetY ?? 0}px | Scale: {data.logoScale ?? 100}%
                  </span>
                </div>

                {/* Logo Left/Right */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Move Left / Right (X):</span>
                    <span className="font-mono font-bold text-slate-800">{data.logoOffsetX ?? -10}px</span>
                  </div>
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    step={1}
                    value={data.logoOffsetX ?? -10}
                    onChange={e => updateField('logoOffsetX', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateField('logoOffsetX', -15)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ◄ Far Left (-15px)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('logoOffsetX', -10)}
                      className="px-1.5 py-0.5 text-[9px] bg-blue-50 text-blue-700 border border-blue-200 rounded font-semibold"
                    >
                      Flush Left (-10px)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('logoOffsetX', 0)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      Zero (0px)
                    </button>
                  </div>
                </div>

                {/* Logo Up/Down */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Move Up / Down (Y):</span>
                    <span className="font-mono font-bold text-slate-800">{data.logoOffsetY ?? 0}px</span>
                  </div>
                  <input
                    type="range"
                    min={-20}
                    max={20}
                    step={1}
                    value={data.logoOffsetY ?? 0}
                    onChange={e => updateField('logoOffsetY', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                </div>

                {/* Logo Resize / Scale */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Resize / Scale:</span>
                    <span className="font-mono font-bold text-slate-800">{data.logoScale ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={130}
                    step={2}
                    value={data.logoScale ?? 100}
                    onChange={e => updateField('logoScale', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateField('logoScale', 85)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      85% (Smaller)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('logoScale', 100)}
                      className="px-1.5 py-0.5 text-[9px] bg-blue-50 text-blue-700 border border-blue-200 rounded font-semibold"
                    >
                      100% (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('logoScale', 115)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      115% (Larger)
                    </button>
                  </div>
                </div>
              </div>

              {/* PIECE 2: Middle DMV Address Block */}
              <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-[11px] font-bold text-slate-800">2. Middle DMV Address Block (Center)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700">
                    X: {data.addressBlockOffsetX ?? 0}px | Y: {data.addressBlockOffsetY ?? 0}px | Scale: {data.addressBlockScale ?? 100}%
                  </span>
                </div>

                {/* Address Left/Right */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Move Left / Right (X):</span>
                    <span className="font-mono font-bold text-slate-800">{data.addressBlockOffsetX ?? 0}px</span>
                  </div>
                  <input
                    type="range"
                    min={-40}
                    max={40}
                    step={1}
                    value={data.addressBlockOffsetX ?? 0}
                    onChange={e => updateField('addressBlockOffsetX', parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockOffsetX', (data.addressBlockOffsetX ?? 0) - 4)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ◄ Nudge Left
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockOffsetX', 0)}
                      className="px-1.5 py-0.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold"
                    >
                      Centered (0px)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockOffsetX', (data.addressBlockOffsetX ?? 0) + 4)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ► Nudge Right
                    </button>
                  </div>
                </div>

                {/* Address Up/Down */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Move Up / Down (Y):</span>
                    <span className="font-mono font-bold text-slate-800">{data.addressBlockOffsetY ?? 0}px</span>
                  </div>
                  <input
                    type="range"
                    min={-20}
                    max={25}
                    step={1}
                    value={data.addressBlockOffsetY ?? 0}
                    onChange={e => updateField('addressBlockOffsetY', parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockOffsetY', (data.addressBlockOffsetY ?? 0) - 2)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ▲ Move Up
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockOffsetY', 0)}
                      className="px-1.5 py-0.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold"
                    >
                      Level (0px)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockOffsetY', (data.addressBlockOffsetY ?? 0) + 2)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ▼ Move Down
                    </button>
                  </div>
                </div>

                {/* Address Resize / Scale */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Resize / Text Scale:</span>
                    <span className="font-mono font-bold text-slate-800">{data.addressBlockScale ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min={75}
                    max={135}
                    step={2}
                    value={data.addressBlockScale ?? 100}
                    onChange={e => updateField('addressBlockScale', parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockScale', 88)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      88% (Compact)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockScale', 100)}
                      className="px-1.5 py-0.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold"
                    >
                      100% (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('addressBlockScale', 112)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      112% (Enlarged)
                    </button>
                  </div>
                </div>
              </div>

              {/* PIECE 3: Year & Expiration Date (Right) */}
              <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span className="text-[11px] font-bold text-slate-800">3. Year &amp; Expiration (Right)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700">
                    X: {data.yearExpiresOffsetX ?? 0}px | Y: {data.yearExpiresOffsetY ?? 0}px | Scale: {data.yearExpiresScale ?? 100}%
                  </span>
                </div>

                {/* Year Left/Right */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Move Left / Right (X):</span>
                    <span className="font-mono font-bold text-slate-800">{data.yearExpiresOffsetX ?? 0}px</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={30}
                    step={1}
                    value={data.yearExpiresOffsetX ?? 0}
                    onChange={e => updateField('yearExpiresOffsetX', parseInt(e.target.value, 10))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresOffsetX', (data.yearExpiresOffsetX ?? 0) - 4)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ◄ Shift Left
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresOffsetX', 0)}
                      className="px-1.5 py-0.5 text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold"
                    >
                      Flush Right (0px)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresOffsetX', (data.yearExpiresOffsetX ?? 0) + 4)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ► Shift Right
                    </button>
                  </div>
                </div>

                {/* Year Up/Down */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Move Up / Down (Y):</span>
                    <span className="font-mono font-bold text-slate-800">{data.yearExpiresOffsetY ?? 0}px</span>
                  </div>
                  <input
                    type="range"
                    min={-20}
                    max={25}
                    step={1}
                    value={data.yearExpiresOffsetY ?? 0}
                    onChange={e => updateField('yearExpiresOffsetY', parseInt(e.target.value, 10))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresOffsetY', (data.yearExpiresOffsetY ?? 0) - 2)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ▲ Move Up
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresOffsetY', 0)}
                      className="px-1.5 py-0.5 text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold"
                    >
                      Level (0px)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresOffsetY', (data.yearExpiresOffsetY ?? 0) + 2)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      ▼ Move Down
                    </button>
                  </div>
                </div>

                {/* Year Resize / Scale */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>Resize / Banner Scale:</span>
                    <span className="font-mono font-bold text-slate-800">{data.yearExpiresScale ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min={75}
                    max={140}
                    step={2}
                    value={data.yearExpiresScale ?? 100}
                    onChange={e => updateField('yearExpiresScale', parseInt(e.target.value, 10))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresScale', 88)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      88% (Smaller)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresScale', 100)}
                      className="px-1.5 py-0.5 text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold"
                    >
                      100% (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('yearExpiresScale', 115)}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                    >
                      115% (Larger)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Lines Closeness & Placement */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <AlignJustify className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Receipt Lines Spacing &amp; Placement
                  </h3>
                </div>
              </div>

              {/* Line closeness / gap slider */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Line Closeness / Gap</span>
                  <span className="text-blue-600 font-mono font-bold">
                    {data.receiptLineGap ?? 1}px {data.receiptLineGap === 0 ? '(Ultra-Tight)' : data.receiptLineGap === 1 ? '(Tight)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={0.5}
                  value={data.receiptLineGap ?? 1}
                  onChange={e => updateField('receiptLineGap', parseFloat(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9.5px] text-slate-400 mt-0.5">
                  <span>0px (Closer together)</span>
                  <span>1px (Default)</span>
                  <span>6px (Spaced)</span>
                </div>
              </div>

              {/* Receipt Vertical Placement Y */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Receipt Vertical Offset (Y)</span>
                  <span className="text-blue-600 font-mono font-bold">{data.receiptOffsetY ?? 0}px</span>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={30}
                  step={1}
                  value={data.receiptOffsetY ?? 0}
                  onChange={e => updateField('receiptOffsetY', parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Receipt Horizontal Placement X */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Receipt Horizontal Offset (X)</span>
                  <span className="text-blue-600 font-mono font-bold">{data.receiptOffsetX ?? 0}px</span>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={30}
                  step={1}
                  value={data.receiptOffsetX ?? 0}
                  onChange={e => updateField('receiptOffsetX', parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Bottom Disclosure Lines Offset (More Down) */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Move className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Bottom Disclosures Placement
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-blue-600">
                  +{data.bottomDisclosureOffsetY ?? 24}px down
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-2">
                Move the bottom notice ("PLATES AND REGISTRATION MUST BE RETURNED...") more down toward the dotted line.
              </p>
              <input
                type="range"
                min={0}
                max={60}
                step={2}
                value={data.bottomDisclosureOffsetY ?? 24}
                onChange={e => updateField('bottomDisclosureOffsetY', parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex items-center justify-between mt-2 gap-1">
                <button
                  type="button"
                  onClick={() => updateField('bottomDisclosureOffsetY', 0)}
                  className="px-2 py-1 text-[10px] bg-slate-100 text-slate-700 font-semibold rounded"
                >
                  Top (0px)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('bottomDisclosureOffsetY', 24)}
                  className="px-2 py-1 text-[10px] bg-blue-50 text-blue-700 font-semibold rounded border border-blue-200"
                >
                  More Down (24px)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('bottomDisclosureOffsetY', 45)}
                  className="px-2 py-1 text-[10px] bg-purple-50 text-purple-700 font-semibold rounded border border-purple-200"
                >
                  Lowest (45px)
                </button>
              </div>
            </div>

            {/* Row 2 Column Widths: Shorten VIN & Model, Expand Plate Background */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Columns className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Row 2 Column Widths
                  </h3>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Shorten VIN and Model cells to give the Plate Background cell full room to fit "HOME MEANS NEVADA".
              </p>

              {/* VIN Cell Width Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>VIN Cell Width (Shortened)</span>
                  <span className="text-blue-600 font-mono font-bold">{data.vinCellWidth ?? 175}px</span>
                </div>
                <input
                  type="range"
                  min={140}
                  max={240}
                  step={5}
                  value={data.vinCellWidth ?? 175}
                  onChange={e => updateField('vinCellWidth', parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Model Cell Width Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Model Cell Width (Shortened)</span>
                  <span className="text-blue-600 font-mono font-bold">{data.modelCellWidth ?? 110}px</span>
                </div>
                <input
                  type="range"
                  min={85}
                  max={150}
                  step={5}
                  value={data.modelCellWidth ?? 110}
                  onChange={e => updateField('modelCellWidth', parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Resulting Plate Background Room */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-900">Plate Background Cell Room:</div>
                  <div className="text-[10px] text-emerald-700">
                    Full room for complete text (HOME MEANS NEVADA)
                  </div>
                </div>
                <span className="text-xs font-black font-mono text-emerald-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-emerald-300">
                  ~{600 - (data.vinCellWidth ?? 175) - (data.modelCellWidth ?? 110) - 35 - 70}px wide
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MASTER TYPOGRAPHY & FONT INSPECTOR */}
        {activeTab === 'typography' && (
          <div className="space-y-5">
            {/* Master Font Controls Box */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Master Typography Controls
                </h3>
              </div>

              <div className="space-y-3.5">
                {/* Font Family Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Font Family Preset
                  </label>
                  <select
                    value={typography.fontFamily}
                    onChange={e => {
                      const val = e.target.value as FontFamilyType;
                      let name = 'Arial Bold';
                      if (val.includes('Courier')) name = 'Courier Prime Monospace';
                      else if (val.includes('Roboto Mono')) name = 'Roboto Mono Digital';
                      else if (val.includes('Roboto')) name = 'Roboto Clean';
                      onChangeTypography({
                        ...typography,
                        fontFamily: val,
                        fontNameDisplay: name,
                      });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Arial, Helvetica, sans-serif">
                      Arial Bold (100% NV DMV Official Standard)
                    </option>
                    <option value='"Roboto Mono", monospace'>
                      Roboto Mono (Modern DMV Digital Matrix)
                    </option>
                    <option value='"Courier Prime", Courier, monospace'>
                      Courier Prime (Authentic DMV Typewriter / Impact)
                    </option>
                    <option value='"Roboto", sans-serif'>Roboto Standard Grotesk</option>
                    <option value="monospace">System Monospace (OCR-B)</option>
                  </select>
                </div>

                {/* Font Scale Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Master Font Scale</span>
                    <span className="text-blue-600 font-mono">{typography.masterScale}%</span>
                  </div>
                  <input
                    type="range"
                    min={80}
                    max={130}
                    step={2}
                    value={typography.masterScale}
                    onChange={e =>
                      onChangeTypography({
                        ...typography,
                        masterScale: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                    <span>80% Compact</span>
                    <span>100% Exact</span>
                    <span>130% Large</span>
                  </div>
                </div>

                {/* Letter Spacing Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Letter Spacing (Tracking)</span>
                    <span className="text-blue-600 font-mono">{typography.letterSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={3}
                    step={0.2}
                    value={typography.letterSpacing}
                    onChange={e =>
                      onChangeTypography({
                        ...typography,
                        letterSpacing: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Font Weight & Text Transform */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Font Weight
                    </label>
                    <select
                      value={typography.fontWeight}
                      onChange={e =>
                        onChangeTypography({
                          ...typography,
                          fontWeight: e.target.value as any,
                        })
                      }
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                    >
                      <option value="bold">Bold (700)</option>
                      <option value="800">Heavy Black (800)</option>
                      <option value="600">Semi-Bold (600)</option>
                      <option value="normal">Normal (400)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Text Transform
                    </label>
                    <select
                      value={typography.textTransform}
                      onChange={e =>
                        onChangeTypography({
                          ...typography,
                          textTransform: e.target.value as any,
                        })
                      }
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                    >
                      <option value="uppercase">UPPERCASE (DMV Std)</option>
                      <option value="none">As Typed (Standard)</option>
                    </select>
                  </div>
                </div>

                {/* Ink Color / Toner Density */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ink Tone / Toner Density
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={typography.textColor}
                      onChange={e =>
                        onChangeTypography({
                          ...typography,
                          textColor: e.target.value,
                        })
                      }
                      className="w-8 h-8 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <div className="flex gap-1.5 flex-1">
                      <button
                        onClick={() =>
                          onChangeTypography({
                            ...typography,
                            textColor: '#000000',
                          })
                        }
                        className="px-2 py-1 text-[10px] font-medium border border-slate-300 rounded hover:bg-slate-50"
                      >
                        Pure Black (#000)
                      </button>
                      <button
                        onClick={() =>
                          onChangeTypography({
                            ...typography,
                            textColor: '#1a1a1a',
                          })
                        }
                        className="px-2 py-1 text-[10px] font-medium border border-slate-300 rounded hover:bg-slate-50"
                      >
                        Laser Toner (#1A)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Identified Field Fonts Analysis Table */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100">
                <Info className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Analyzed Document Font Inventory
                </h3>
              </div>
              <p className="text-[10px] text-slate-500 mb-3">
                Extracted from official NVREG04 PDF. Shows authentic font family, size in pt/px, and standard style.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[10px]">
                      <th className="pb-1.5 font-semibold">Field</th>
                      <th className="pb-1.5 font-semibold">Font Family</th>
                      <th className="pb-1.5 font-semibold">Font Size</th>
                      <th className="pb-1.5 font-semibold">Section</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {IDENTIFIED_FIELD_FONTS.map(item => (
                      <tr key={item.fieldId} className="hover:bg-slate-50/80">
                        <td className="py-1.5 font-medium text-slate-800">{item.fieldName}</td>
                        <td className="py-1.5 font-mono text-[10px] text-blue-700">{item.originalFont}</td>
                        <td className="py-1.5 font-mono text-[10px] text-slate-600">{item.originalSizePt}</td>
                        <td className="py-1.5 text-[10px] text-slate-500">{item.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RECEIPT & FEES */}
        {activeTab === 'receipt' && (
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Receipt Breakdown
                  </h3>
                </div>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.autoCalculateTotal}
                    onChange={e => updateField('autoCalculateTotal', e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <span>Auto-calculate total</span>
                </label>
              </div>

              <div className="space-y-2.5">
                {/* Model Name on Receipt */}
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <Unlock className="w-3 h-3 text-blue-600" /> Model Name on Receipt
                    </label>
                    <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.showReceiptModelName !== false}
                        onChange={e => updateField('showReceiptModelName', e.target.checked)}
                        className="accent-blue-600 rounded"
                      />
                      <span>Show on Receipt</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={data.receiptModelName !== undefined ? data.receiptModelName : data.modelName}
                    onChange={e => updateField('receiptModelName', e.target.value.toUpperCase())}
                    placeholder="LUMINA"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md font-bold uppercase text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Plate Renewal Fee ($)
                  </label>
                  <input
                    type="text"
                    value={data.plateRenewalFee}
                    onChange={e => updateField('plateRenewalFee', e.target.value)}
                    placeholder="20.00"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Registration Fee - Passenger Vehicle ($)
                  </label>
                  <input
                    type="text"
                    value={data.registrationFee}
                    onChange={e => updateField('registrationFee', e.target.value)}
                    placeholder="33.00"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Basic Gov Services Tax - Las Vegas ($)
                  </label>
                  <input
                    type="text"
                    value={data.basicGovServicesTax}
                    onChange={e => updateField('basicGovServicesTax', e.target.value)}
                    placeholder="213.00"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Technology Fee - VR ($)
                  </label>
                  <input
                    type="text"
                    value={data.technologyFee}
                    onChange={e => updateField('technologyFee', e.target.value)}
                    placeholder="1.00"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-800 uppercase">
                      Total Fee ($)
                    </label>
                    <input
                      type="text"
                      value={data.totalFee}
                      onChange={e => updateField('totalFee', e.target.value)}
                      placeholder="267.00"
                      className="w-28 px-2.5 py-1.5 text-xs font-bold text-right border border-slate-300 rounded-lg font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Toggles */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Document Elements Toggle
              </h4>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showBarcode}
                  onChange={e => updateField('showBarcode', e.target.checked)}
                  className="accent-blue-600 rounded"
                />
                <span>Include 2D PDF417 Barcode</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showDottedLines}
                  onChange={e => updateField('showDottedLines', e.target.checked)}
                  className="accent-blue-600 rounded"
                />
                <span>Include Dotted Perforation / Tear Lines</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showDecalGuide}
                  onChange={e => updateField('showDecalGuide', e.target.checked)}
                  className="accent-blue-600 rounded"
                />
                <span>Include Peel-off Decal Guides &amp; Corner Ticks</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
