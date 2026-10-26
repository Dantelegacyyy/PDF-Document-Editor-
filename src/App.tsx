import React, { useState, useEffect, useCallback } from 'react';
import { RegistrationData, TypographyConfig, ViewerConfig } from './types';
import { DEFAULT_REGISTRATION_DATA, DEFAULT_TYPOGRAPHY } from './constants/defaults';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { DocumentViewer } from './components/DocumentViewer';
import { exportToPdf, printDocument } from './utils/pdfExport';
import {
  FileText,
  Save,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Unlock,
} from 'lucide-react';

const STORAGE_KEY_DATA = 'nv_registration_form_data_v2';
const STORAGE_KEY_TYPO = 'nv_registration_typography_v2';

export default function App() {
  // Load initial data from localStorage if available
  const [data, setData] = useState<RegistrationData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved data from localStorage:', e);
    }
    return DEFAULT_REGISTRATION_DATA;
  });

  const [typography, setTypography] = useState<TypographyConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TYPO);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved typography from localStorage:', e);
    }
    return DEFAULT_TYPOGRAPHY;
  });

  const [viewerConfig, setViewerConfig] = useState<ViewerConfig>({
    zoom: 0.95,
    activePage: 1,
    editableInline: true,
    showFieldOutlines: true,
  });

  const [includePage2, setIncludePage2] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Mark unsaved when data or typography changes
  const handleDataChange = useCallback((newData: RegistrationData) => {
    setData(newData);
    setIsSaved(false);
  }, []);

  const handleTypographyChange = useCallback((newTypo: TypographyConfig) => {
    setTypography(newTypo);
    setIsSaved(false);
  }, []);

  const handleDataFieldChange = useCallback((field: keyof RegistrationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  }, []);

  // Save to localStorage
  const handleSaveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY_TYPO, JSON.stringify(typography));
      setIsSaved(true);
      setExportStatus('All changes locked in and saved to browser storage!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data, typography]);

  // Export to PDF
  const handleExportPdf = useCallback(async (customIncludePage2?: boolean) => {
    setIsExporting(true);

    const shouldIncludePage2 =
      customIncludePage2 !== undefined
        ? customIncludePage2
        : includePage2 || viewerConfig.activePage === 'both' || viewerConfig.activePage === 2;

    setExportStatus(
      shouldIncludePage2
        ? 'Preparing complete 2-page PDF (Front & Back)...'
        : 'Preparing high-resolution Certificate PDF...'
    );

    const originalActivePage = viewerConfig.activePage;
    let switchedTemporarily = false;

    // Ensure required page elements are rendered in DOM for capture
    if (!document.getElementById('nv-registration-page-1') || (shouldIncludePage2 && !document.getElementById('nv-registration-page-2'))) {
      setViewerConfig(prev => ({ ...prev, activePage: 'both' }));
      switchedTemporarily = true;
      // Allow DOM to update
      await new Promise(r => setTimeout(r, 120));
    }

    try {
      const success = await exportToPdf({
        includePage2: shouldIncludePage2,
        filename: `Nevada_DMV_Registration_${data.licenseNumber || 'NVREG04'}.pdf`,
        onProgress: msg => setExportStatus(msg),
      });

      if (success) {
        setTimeout(() => setExportStatus(''), 4500);
      }
    } catch (e: any) {
      console.error('PDF Export encountered an error:', e);
      setExportStatus(`Export error: ${e?.message || 'Unknown error'}`);
    } finally {
      if (switchedTemporarily) {
        setViewerConfig(prev => ({ ...prev, activePage: originalActivePage }));
      }
      setIsExporting(false);
    }
  }, [data.licenseNumber, viewerConfig.activePage]);

  // Print Document
  const handlePrint = useCallback(() => {
    printDocument();
  }, []);

  // Save with keyboard shortcut (Cmd+S or Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveToStorage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveToStorage]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      {/* Top Main Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-xs z-20 no-print">
        {/* Left: App Title and Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            title={sidebarOpen ? 'Hide Master Controls' : 'Show Master Controls'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black shadow-xs text-xs tracking-tighter">
              DMV
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-tight">
                Nevada Vehicle Registration Editor
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Form NVREG04 &bull; Mirror Replica &bull; Fillable &amp; Editable
              </p>
            </div>
          </div>
        </div>

        {/* Center: Save Status & Quick Info */}
        <div className="hidden md:flex items-center gap-2">
          {isSaved ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Locked in (Saved)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Unsaved Changes &bull; Press Save</span>
            </div>
          )}
        </div>

        {/* Center-Right: Fast Model Name Editor */}
        <div className="hidden sm:flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200">
          <label
            htmlFor="header-model-input"
            className="flex items-center gap-1 text-[11px] font-bold text-blue-900 cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5 text-blue-600" />
            <span>Model:</span>
          </label>
          <input
            id="header-model-input"
            type="text"
            value={data.modelName}
            onChange={e => {
              const val = e.target.value.toUpperCase();
              setData(prev => ({ ...prev, modelName: val, receiptModelName: val }));
              setIsSaved(false);
            }}
            placeholder="MODEL NAME"
            className="w-28 px-1.5 py-0.5 text-xs font-bold uppercase bg-white border border-blue-300 rounded text-slate-950 outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            title="Vehicle Model Name (Unlocked & Editable)"
          />
        </div>

        {/* Right: Master Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToStorage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition active:scale-95"
            title="Save changes to browser storage"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={() => handleExportPdf(includePage2)}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg shadow-xs transition active:scale-95"
            title={`Download ${includePage2 ? '2-Page (Certificate + Reverse Instructions)' : '1-Page (Front Certificate)'} PDF to device`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isExporting ? 'Exporting...' : includePage2 ? 'Export PDF (2-Page)' : 'Export PDF'}
            </span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            title="Print or Save via Browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="Guide & Field Information"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Master Configuration Box */}
        {sidebarOpen && (
          <aside className="w-96 min-w-[340px] max-w-md h-full z-10 no-print">
            <ConfigurationPanel
              data={data}
              onChangeData={handleDataChange}
              typography={typography}
              onChangeTypography={handleTypographyChange}
              onSaveToStorage={handleSaveToStorage}
              onExportPdf={() => handleExportPdf(includePage2)}
              onPrint={handlePrint}
              isSaved={isSaved}
              isExporting={isExporting}
              exportStatus={exportStatus}
              includePage2={includePage2}
              onChangeIncludePage2={setIncludePage2}
            />
          </aside>
        )}

        {/* Center / Right: Live Interactive Document Viewer */}
        <main className="flex-1 h-full overflow-hidden flex flex-col">
          <DocumentViewer
            data={data}
            typography={typography}
            viewerConfig={viewerConfig}
            onChangeViewerConfig={setViewerConfig}
            onChangeDataField={handleDataFieldChange}
          />
        </main>
      </div>

      {/* Field Identification & Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Nevada Form NVREG04 Reference &amp; Guidelines
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                This application creates a 1:1 mirror reproduction of the official Nevada Department of Motor Vehicles Vehicle Registration Certificate (Form NVREG04).
              </p>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-1">Key Features Implemented:</h4>
                <ul className="list-disc pl-4 space-y-1 text-blue-800">
                  <li><strong>Row 1 Fields:</strong> License Number, Year (combined), Make, Type 4, MSRP, Axle, Decl. Weight, Unl. Weight.</li>
                  <li><strong>Row 2 Fields:</strong> VIN, Model Name, Fuel, Decal Number (5514676), Plate Background (HOME MEANS NEVADA).</li>
                  <li><strong>Name and Address:</strong> Single large fillable field for registered owner.</li>
                  <li><strong>Receipt Section:</strong> Four aligned lines with fees and accurate total fee.</li>
                  <li><strong>Typography &amp; Fonts:</strong> Analyzed official Arial Bold and computer monospace with full size/spacing controls.</li>
                  <li><strong>Persistence:</strong> &ldquo;Save &amp; Lock In&rdquo; persists your values in local storage so refreshing won&apos;t clear them.</li>
                  <li><strong>Export:</strong> Download direct 8.5&times;11 inch PDF or print with native browser dialog.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Authentic Elements:</h4>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li>Original Nevada DMV state ribbon logo and Carson City headquarters address</li>
                  <li>Large registration year banner and expiration date</li>
                  <li>Reference &ldquo;186&rdquo; and &ldquo;Form NVREG04 Batch 16658 Seq 186&rdquo;</li>
                  <li>Bottom statutory disclosure notice</li>
                  <li>Authentic 2D PDF417 registration barcode and peel-off decal guides</li>
                  <li>Reverse page with application instructions and legal ownership rules</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
