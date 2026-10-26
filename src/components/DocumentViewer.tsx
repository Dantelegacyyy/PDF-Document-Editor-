import React, { useRef, useState, useEffect } from 'react';
import { RegistrationData, TypographyConfig, ViewerConfig } from '../types';
import { RegistrationCertificatePage1 } from './RegistrationCertificatePage1';
import { RegistrationInstructionsPage2 } from './RegistrationInstructionsPage2';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  Edit3,
  Layers,
  Eye,
} from 'lucide-react';

interface DocumentViewerProps {
  data: RegistrationData;
  typography: TypographyConfig;
  viewerConfig: ViewerConfig;
  onChangeViewerConfig: (config: ViewerConfig) => void;
  onChangeDataField: (field: keyof RegistrationData, value: any) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  data,
  typography,
  viewerConfig,
  onChangeViewerConfig,
  onChangeDataField,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(viewerConfig.zoom || 0.85);

  useEffect(() => {
    if (viewerConfig.zoom && viewerConfig.zoom !== scale) {
      setScale(viewerConfig.zoom);
    }
  }, [viewerConfig.zoom]);

  const handleZoom = (delta: number) => {
    const newZoom = Math.min(Math.max(Number((scale + delta).toFixed(2)), 0.4), 2.2);
    setScale(newZoom);
    onChangeViewerConfig({ ...viewerConfig, zoom: newZoom });
  };

  const handleZoomPreset = (val: number) => {
    setScale(val);
    onChangeViewerConfig({ ...viewerConfig, zoom: val });
  };

  const handleFitWidth = () => {
    if (containerRef.current) {
      const availableWidth = containerRef.current.clientWidth - 80;
      const targetZoom = Number((availableWidth / 816).toFixed(2));
      const clamped = Math.min(Math.max(targetZoom, 0.4), 1.8);
      setScale(clamped);
      onChangeViewerConfig({ ...viewerConfig, zoom: clamped });
    }
  };

  const handleFitPage = () => {
    if (containerRef.current) {
      const availableHeight = containerRef.current.clientHeight - 100;
      const targetZoom = Number((availableHeight / 1056).toFixed(2));
      const clamped = Math.min(Math.max(targetZoom, 0.4), 1.5);
      setScale(clamped);
      onChangeViewerConfig({ ...viewerConfig, zoom: clamped });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden select-none">
      {/* Top Floating Control Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xs z-10 no-print">
        {/* Page Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => onChangeViewerConfig({ ...viewerConfig, activePage: 1 })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
              viewerConfig.activePage === 1
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Page 1: Front (Certificate)
          </button>

          <button
            onClick={() => onChangeViewerConfig({ ...viewerConfig, activePage: 2 })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
              viewerConfig.activePage === 2
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Page 2: Reverse (Instructions)
          </button>

          <button
            onClick={() => onChangeViewerConfig({ ...viewerConfig, activePage: 'both' })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
              viewerConfig.activePage === 'both'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Both Pages
          </button>
        </div>

        {/* Live Direct Inline Editing Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onChangeViewerConfig({
                ...viewerConfig,
                editableInline: !viewerConfig.editableInline,
              })
            }
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md border transition flex items-center gap-1.5 ${
              viewerConfig.editableInline
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle inline cell editing directly on the document canvas"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Click &amp; Type on Document: Active</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-1.5 text-slate-700 hover:bg-white rounded hover:shadow-xs transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="text-xs font-mono font-bold px-2 py-1 text-slate-800">
            {Math.round(scale * 100)}%
          </div>

          <button
            onClick={() => handleZoom(0.1)}
            className="p-1.5 text-slate-700 hover:bg-white rounded hover:shadow-xs transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            onClick={() => handleZoomPreset(1.0)}
            className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-white rounded hover:shadow-xs transition"
            title="Actual Size (100%)"
          >
            100%
          </button>

          <button
            onClick={handleFitWidth}
            className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-white rounded hover:shadow-xs transition"
            title="Fit Width"
          >
            Fit Width
          </button>

          <button
            onClick={handleFitPage}
            className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-white rounded hover:shadow-xs transition flex items-center gap-1"
            title="Fit Page Height"
          >
            <Maximize2 className="w-3 h-3" /> Fit Page
          </button>
        </div>
      </div>

      {/* Main Document Canvas Scroll Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-8 flex flex-col items-center justify-start bg-slate-200/70"
      >
        <div
          className="transition-transform duration-150 origin-top flex flex-col items-center gap-10"
          style={{
            transform: `scale(${scale})`,
            marginBottom: `${(1056 * (scale - 1)) / 2 + 80}px`,
          }}
        >
          {/* Render Page 1 */}
          {(viewerConfig.activePage === 1 || viewerConfig.activePage === 'both') && (
            <div className="relative">
              <RegistrationCertificatePage1
                data={data}
                typography={typography}
                editableInline={viewerConfig.editableInline}
                onChangeField={onChangeDataField}
                scale={scale}
              />
              <div className="absolute -top-6 left-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider no-print">
                Nevada DMV Registration Form NVREG04 &bull; Page 1 (Front)
              </div>
            </div>
          )}

          {/* Render Page 2 */}
          {(viewerConfig.activePage === 2 || viewerConfig.activePage === 'both') && (
            <div className="relative">
              <RegistrationInstructionsPage2 />
              <div className="absolute -top-6 left-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider no-print">
                Official Application Instructions &amp; Ownership &bull; Page 2 (Reverse)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
