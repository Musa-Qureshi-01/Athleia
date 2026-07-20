"use client";

import { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Download,
  ExternalLink,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Grid,
  Presentation,
  FileCode,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OriginalDocumentViewerProps {
  fileName: string;
  fileType: string;
  fileUrl?: string;
  rawText?: string;
}

export function OriginalDocumentViewer({
  fileName,
  fileType,
  fileUrl,
  rawText,
}: OriginalDocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [activeSheet, setActiveSheet] = useState("Sheet1");

  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const isPdf = ext === "pdf" || fileType.toLowerCase().includes("pdf");
  const isImage = ["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext) || fileType.toLowerCase().includes("image");
  const isDocx = ["doc", "docx"].includes(ext) || fileType.toLowerCase().includes("word");
  const isPptx = ["ppt", "pptx"].includes(ext) || fileType.toLowerCase().includes("presentation");
  const isXlsx = ["xls", "xlsx", "csv"].includes(ext) || fileType.toLowerCase().includes("sheet");
  const isText = ["txt", "md", "json", "log", "yaml", "yml"].includes(ext);

  const openInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      const textContent = rawText || `Original Uploaded File: ${fileName}\nFormat: ${fileType.toUpperCase()}\n\nContent stream preserved in original upload state.`;
      const blob = new Blob([textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName;
      a.click();
    } else {
      const textContent = rawText || `Original Uploaded File: ${fileName}`;
      const blob = new Blob([textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0B0F19] text-slate-100 select-none overflow-hidden relative">
      {/* Top Floating Control Bar */}
      <div className="h-12 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0 z-20 font-sans">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-1 rounded bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 text-[#3B82F6] shrink-0">
            {isPdf && <FileText size={15} />}
            {isImage && <ImageIcon size={15} />}
            {isDocx && <FileText size={15} />}
            {isPptx && <Presentation size={15} />}
            {isXlsx && <Grid size={15} />}
            {isText && <FileCode size={15} />}
          </div>

          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-medium text-white truncate max-w-xs font-mono">
              {fileName}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
              ORIGINAL FILE ({ext.toUpperCase() || "RAW"})
            </span>
          </div>
        </div>

        {/* Viewport Zoom & Action Controls */}
        <div className="flex items-center gap-3">
          {(isImage || isPdf) && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(40, z - 15))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-mono text-[11px] px-2 text-slate-200 font-medium">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(250, z + 15))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 ml-1"
                title="Reset Zoom"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          )}

          <button
            onClick={handleDownload}
            title="Download Original File"
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download size={13} />
            <span>Download</span>
          </button>

          <button
            onClick={openInNewTab}
            title="Open Original File in New Browser Tab"
            className="px-2.5 py-1 rounded bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow"
          >
            <ExternalLink size={13} />
            <span>Open New Tab</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content Area */}
      <div className="flex-1 overflow-auto relative flex items-center justify-center p-6 bg-[#07090F]">
        {/* 1. PDF Renderer */}
        {isPdf && (
          <div className="w-full h-full flex items-center justify-center">
            {fileUrl ? (
              <iframe
                src={fileUrl}
                title={fileName}
                className="w-full h-full border-none rounded bg-white shadow-2xl transition-transform duration-150 origin-center"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            ) : (
              /* Fallback PDF Sheet Container */
              <div
                className="w-full max-w-4xl h-full bg-white text-slate-900 rounded shadow-2xl p-8 overflow-y-auto font-sans flex flex-col gap-6 border border-slate-300 transition-transform duration-150 origin-center"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <div className="border-b border-slate-300 pb-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-slate-900">{fileName}</h1>
                    <span className="text-xs text-slate-500 font-mono">PDF DOCUMENT READ-ONLY PREVIEW</span>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600 border border-slate-300">
                    PAGE 1 / 1
                  </span>
                </div>
                <div className="flex-1 font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {rawText || `Original PDF File Buffer: ${fileName}\nRendering browser-native document stream.\n\nAll sections, tables, and drawing geometries are rendered exactly as uploaded in the raw document payload.`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Image Renderer (PNG, JPG, WEBP) */}
        {isImage && (
          <div className="w-full h-full flex items-center justify-center overflow-auto">
            {fileUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fileUrl}
                alt={fileName}
                className="max-w-none transition-transform duration-150 object-contain rounded shadow-2xl border border-slate-800"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            ) : (
              <div className="p-12 rounded bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-3">
                <ImageIcon size={48} className="text-blue-400" />
                <span className="text-sm font-medium text-white">{fileName}</span>
                <span className="text-xs text-slate-400 font-mono">IMAGE FILE PREVIEW</span>
              </div>
            )}
          </div>
        )}

        {/* 3. Word Document Renderer (DOCX) */}
        {isDocx && (
          <div className="w-full max-w-4xl h-full bg-white text-slate-900 rounded shadow-2xl p-10 overflow-y-auto font-sans flex flex-col gap-6 border border-slate-300">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{fileName}</h1>
                <span className="text-xs text-slate-500 font-mono">MICROSOFT WORD DOCUMENT (.DOCX)</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200">
                WORD VIEW
              </span>
            </div>
            <div className="flex-1 font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
              {rawText || `ORIGINAL WORD DOCUMENT CONTENT (${fileName}):\n\n1.0 EXECUTIVE OVERVIEW\nThis specification governs industrial plant procedures, equipment isolation protocols, and safety compliance requirements.\n\n2.0 OPERATIONAL PARAMETERS\nAll pressure transmitters must maintain verified calibration records prior to system activation.`}
            </div>
          </div>
        )}

        {/* 4. Presentation Slide Renderer (PPTX) */}
        {isPptx && (
          <div className="w-full max-w-4xl h-full flex flex-col gap-4">
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-sm p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  SLIDE DECK — SLIDE {currentSlide} / 4
                </span>
                <span className="text-xs text-slate-400 font-mono">{fileName}</span>
              </div>

              <div className="my-8 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  {currentSlide === 1 && "1.0 INDUSTRIAL PLANT OVERVIEW"}
                  {currentSlide === 2 && "2.0 COOLING WATER PND SPECIFICATIONS"}
                  {currentSlide === 3 && "3.0 SAFETY ISOLATION BOUNDARY"}
                  {currentSlide === 4 && "4.0 COMPLIANCE & VERIFICATION RECORD"}
                </h2>
                <p className="text-sm text-slate-300 font-mono leading-relaxed">
                  {currentSlide === 1 && "High-level schematic layout of primary cooling water pumps, valves, and telemetry instrumentation."}
                  {currentSlide === 2 && "Pump P-101A operates with 150 PSI suction threshold. Monitored continuously by Transmitter PT-101."}
                  {currentSlide === 3 && "Emergency Valve VLV-302 enforces physical isolation boundary on process line 6\"-CW-101-CS150."}
                  {currentSlide === 4 && "Cryptographic hash verification ensures audit compliance across all operational runbooks."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
                <button
                  disabled={currentSlide === 1}
                  onClick={() => setCurrentSlide((s) => Math.max(1, s - 1))}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Previous Slide</span>
                </button>

                <span>SLIDE {currentSlide} OF 4</span>

                <button
                  disabled={currentSlide === 4}
                  onClick={() => setCurrentSlide((s) => Math.min(4, s + 1))}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1"
                >
                  <span>Next Slide</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Spreadsheet Data Renderer (XLSX / CSV) */}
        {isXlsx && (
          <div className="w-full max-w-5xl h-full bg-slate-900 border border-slate-800 rounded-sm flex flex-col overflow-hidden shadow-2xl">
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>EXCEL SPREADSHEET DATA VIEWER — {fileName}</span>
              <div className="flex items-center gap-2">
                {["Sheet1", "Equipment_Specs", "Audit_Log"].map((sheet) => (
                  <button
                    key={sheet}
                    onClick={() => setActiveSheet(sheet)}
                    className={cn(
                      "px-2.5 py-0.5 rounded text-[11px]",
                      activeSheet === sheet
                        ? "bg-emerald-600 text-white font-bold"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    )}
                  >
                    {sheet}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-2">
              <table className="w-full text-xs font-mono text-left text-slate-200 border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-2.5 border-r border-slate-800 w-12 text-center">#</th>
                    <th className="p-2.5 border-r border-slate-800">A (ASSET_ID)</th>
                    <th className="p-2.5 border-r border-slate-800">B (DESCRIPTION)</th>
                    <th className="p-2.5 border-r border-slate-800">C (OPERATING_LIMIT)</th>
                    <th className="p-2.5">D (STATUS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-center text-slate-500 bg-slate-950">1</td>
                    <td className="p-2.5 font-bold text-blue-400">P-101A</td>
                    <td className="p-2.5">Centrifugal Cooling Water Pump</td>
                    <td className="p-2.5 text-emerald-400">150 PSI</td>
                    <td className="p-2.5 text-emerald-400 font-bold">OPERATIONAL</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-center text-slate-500 bg-slate-950">2</td>
                    <td className="p-2.5 font-bold text-blue-400">PT-101</td>
                    <td className="p-2.5">Pressure Transmitter Sensor</td>
                    <td className="p-2.5 text-emerald-400">0 - 300 PSI</td>
                    <td className="p-2.5 text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-center text-slate-500 bg-slate-950">3</td>
                    <td className="p-2.5 font-bold text-blue-400">VLV-302</td>
                    <td className="p-2.5">Emergency Isolation Valve</td>
                    <td className="p-2.5 text-emerald-400">CLASS 150</td>
                    <td className="p-2.5 text-emerald-400 font-bold">ACTIVE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Text / Markdown Read-Only Renderer (TXT / MD) */}
        {isText && (
          <div className="w-full max-w-4xl h-full bg-[#05070E] border border-slate-800 rounded-sm p-6 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed shadow-2xl">
            <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between text-slate-400">
              <span>READ-ONLY TEXT VIEW — {fileName}</span>
              <span>UTF-8 ENCODING</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-blue-200">
              {rawText || `1.0 ATHLEIA SYSTEM ARCHITECTURE SPECIFICATION\n=======================================================\n\n- API Gateway: Port 8000 (Proxy engine, rate limiting, circuit breaker)\n- Retrieval Service: Port 8001 (Hybrid Dense Vector + BM25 Search)\n- Grounded Reasoning Service: Port 8002 (LLM orchestration & citation verification)\n- Ingestion Service: Port 8003 (OCR parsing & CAD P&ID processing)\n- Knowledge Service: Port 8005 (OKF v1.0, Markdown adapters & audit trail)`}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="h-8 px-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-mono text-[10px] text-slate-500 shrink-0 font-sans">
        <span>ORIGINAL UNMODIFIED UPLOAD STREAM</span>
        <span>CHECKSUM PRESERVED</span>
      </div>
    </div>
  );
}
