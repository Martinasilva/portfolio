import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { 
  ZoomIn, ZoomOut, RotateCcw, 
  FileText, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { dataUrlToBlob } from '../data/documentVault';

// Set pdfjs worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface AuthenticDocumentViewerProps {
  dataUrl: string;
  title: string;
  fileName?: string;
  onReplace?: () => void;
  lang?: 'en' | 'fr' | 'pt';
}

// Individual PDF Page renderer component
const PdfPage: React.FC<{
  pdf: pdfjsLib.PDFDocumentProxy;
  pageNum: number;
  scale: number;
}> = ({ pdf, pageNum, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: any = null;

    const render = async () => {
      try {
        const page = await pdf.getPage(pageNum);
        if (isCancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale });
        const context = canvas.getContext('2d');
        if (!context) return;

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined;

        renderTask = page.render({
          canvasContext: context,
          canvas: canvas,
          transform: transform as any,
          viewport: viewport
        });

        await renderTask.promise;
      } catch (err: any) {
        if (!isCancelled && err?.name !== 'RenderingCancelledException') {
          console.warn(`Error rendering page ${pageNum}:`, err);
        }
      }
    };

    render();

    return () => {
      isCancelled = true;
      if (renderTask && renderTask.cancel) {
        try {
          renderTask.cancel();
        } catch (_) {}
      }
    };
  }, [pdf, pageNum, scale]);

  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-700/60 mb-6 flex justify-center">
      <canvas ref={canvasRef} className="block max-w-full" />
    </div>
  );
};

export const AuthenticDocumentViewer: React.FC<AuthenticDocumentViewerProps> = ({
  dataUrl,
  title,
  fileName,
  onReplace,
  lang = 'pt'
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.15);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [viewEngine, setViewEngine] = useState<'canvas' | 'embed'>('embed');

  const isImage = dataUrl.startsWith('data:image');
  const isPdf = !isImage;

  // Create clean Blob URL for external viewing, embed, or fallback
  useEffect(() => {
    try {
      const blob = dataUrlToBlob(dataUrl);
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.warn('Failed to generate blob URL from dataUrl:', err);
      setBlobUrl(dataUrl);
    }
  }, [dataUrl]);

  // PDFs are displayed with the browser's native viewer below. This is more
  // reliable than rendering each page to canvas, which could leave a black area.
  useEffect(() => {
    if (isPdf && dataUrl) {
      setIsLoading(false);
      setRenderError(null);
      setViewEngine('embed');
    } else {
      setIsLoading(false);
    }
  }, [dataUrl, isPdf]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setScale(1.15);


  return (
    <div className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* Top Document Controls Bar */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        
        {/* Document Info */}
        <div className="flex items-center gap-2 truncate max-w-sm sm:max-w-md">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-white text-xs sm:text-sm truncate">{title}</h4>
            <p className="text-[11px] text-slate-400 truncate font-mono">
              {fileName || (isImage ? 'imagem_oficial.png' : 'certificado_oficial.pdf')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Zoom controls for PDF Canvas & Image */}
          {(!isPdf || viewEngine === 'canvas') && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                title="Reduzir Zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono text-slate-400 tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer text-slate-400"
                title="Repor Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Replace file button if callback passed */}
          {onReplace && (
            <button
              onClick={onReplace}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer text-xs"
              title="Substituir por outro ficheiro"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'pt' ? 'Substituir' : 'Replace'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Viewer Body Canvas */}
      <div className="relative bg-white overflow-auto p-2 sm:p-4 flex flex-col items-center justify-start min-h-[500px] max-h-[850px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-20 space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-xs text-slate-300 font-medium">
              {lang === 'pt' ? 'A abrir documento autêntico...' : 'Opening authentic document...'}
            </p>
          </div>
        )}

        {/* IMAGE RENDERER */}
        {isImage && (
          <div className="flex justify-center items-center transition-transform duration-150">
            <img
              src={dataUrl}
              alt={title}
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
              className="max-w-full rounded-lg shadow-2xl border border-slate-800 transition-all"
            />
          </div>
        )}

        {/* PDF CANVAS RENDERER */}
        {isPdf && viewEngine === 'canvas' && pdfDoc && (
          <div className="space-y-4 flex flex-col items-center w-full">
            {Array.from({ length: numPages }, (_, index) => (
              <PdfPage
                key={`page-${index + 1}-${scale}`}
                pdf={pdfDoc}
                pageNum={index + 1}
                scale={scale}
              />
            ))}
          </div>
        )}

        {/* PDF NATIVE EMBED RENDERER */}
        {isPdf && viewEngine === 'embed' && blobUrl && (
          <div className="w-full h-[750px] bg-white rounded-xl overflow-hidden border border-slate-300">
            <iframe
              src={`${blobUrl}#view=FitH&toolbar=1`}
              title={title}
              className="w-full h-full border-none bg-white"
              style={{ minHeight: '750px', display: 'block', colorScheme: 'light' }}
            />
          </div>
        )}

        {/* PDF FALLBACK IF ERROR OCCURS */}
        {renderError && !blobUrl && (
          <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 my-auto">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-white">
                {lang === 'pt' ? 'Documento Pronto para Visualização' : 'Document Ready to View'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'pt' 
                  ? 'Não foi possível apresentar este documento. Consulte a descrição do certificado.' 
                  : 'This document could not be displayed. Please consult the certificate description.'}
              </p>
            </div>

          </div>
        )}
      </div>

      {/* Footer bar with page counts for multi-page documents */}
      {isPdf && numPages > 1 && (
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>
            {lang === 'pt' ? `Total de páginas: ${numPages}` : `Total pages: ${numPages}`}
          </span>
          <span className="font-mono text-[11px] text-emerald-400">
            {lang === 'pt' ? 'Documento Autêntico Verificado' : 'Authentic Verified Document'}
          </span>
        </div>
      )}
    </div>
  );
};
