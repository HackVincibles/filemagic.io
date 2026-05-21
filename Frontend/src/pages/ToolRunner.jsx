/**
 * Purpose: Dedicated tool runner with single-file mode + type restrictions + auto upload.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { processFile } from '../services/fileService';
import ProgressBar from '../components/ProgressBar';

const toolConfig = {
  'compress': { label: 'Compress file', operation: 'COMPRESS', accept: '*/*', allowAuto: true },
  'decompress': { label: 'Decompress file', operation: 'DECOMPRESS', accept: '*/*', allowAuto: true },
  'convert-text': { label: 'Convert text', operation: 'CONVERT', accept: '.txt,.csv,.md', conversionMode: 'UTF8_TO_UTF16BE' },
  'pdf-to-word': { label: 'PDF to Word', operation: 'PDF_TO_WORD', accept: '.pdf' },
  'compress-pdf': { label: 'Compress PDF', operation: 'PDF_COMPRESS', accept: '.pdf' },
  'merge-pdf': { label: 'Merge PDF', operation: 'PDF_MERGE', accept: '.pdf' },
  'split-pdf': { label: 'Split PDF', operation: 'PDF_SPLIT', accept: '.pdf' },
  'rotate-pdf': { label: 'Rotate PDF', operation: 'PDF_ROTATE', accept: '.pdf' },
  'ocr-pdf': { label: 'OCR PDF', operation: 'PDF_OCR', accept: '.pdf,.png,.jpg,.jpeg' },
  'summarize-pdf': { label: 'Summarize PDF', operation: 'PDF_SUMMARIZE', accept: '.pdf' },
  'edit-pdf': { label: 'Edit PDF', operation: 'PDF_EDIT', accept: '.pdf', notAvailable: true },
  'read-pdf': { label: 'Read PDF', operation: 'PDF_READ', accept: '.pdf', notAvailable: true },
  'crop-pdf': { label: 'Crop PDF', operation: 'PDF_CROP', accept: '.pdf', notAvailable: true },
  'highlight-pdf': { label: 'Highlight PDF', operation: 'PDF_HIGHLIGHT', accept: '.pdf', notAvailable: true },
  'annotate-pdf': { label: 'Annotate PDF', operation: 'PDF_ANNOTATE', accept: '.pdf', notAvailable: true },
  'unlock-pdf': { label: 'Unlock PDF', operation: 'PDF_UNLOCK', accept: '.pdf', notAvailable: true },
  'sign-pdf': { label: 'Sign PDF', operation: 'PDF_SIGN', accept: '.pdf', notAvailable: true },
  'flatten-pdf': { label: 'Flatten PDF', operation: 'PDF_FLATTEN', accept: '.pdf', notAvailable: true },
};

export default function ToolRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tool = toolConfig[id] || { label: 'Unknown tool', accept: '*/*', operation: null };

  const [file, setFile] = useState(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [downloadPct, setDownloadPct] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [processed, setProcessed] = useState(false);

  const run = async (selectedFile) => {
    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }
    setError('');
    setBusy(true);
    setUploadPct(0);
    setDownloadPct(0);
    setResult(null);
    setProcessed(false);

    try {
      const opts = { operation: tool.operation };
      if (tool.conversionMode) opts.conversionMode = tool.conversionMode;
      if (tool.operation === 'COMPRESS') opts.compressionAlgorithm = 'AUTO';

      const res = await processFile(selectedFile, opts, setUploadPct, setDownloadPct);
      setResult({ 
        blob: res.blob, 
        filename: res.filename, 
        originalSize: selectedFile.size,
        processedSize: res.blob.size
      });
      setProcessed(true);
    } catch (e) {
      setError(e.message || 'Processing failed.');
    } finally {
      setBusy(false);
    }
  };

  const triggerDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [previewVisible, setPreviewVisible] = useState(false);
  const objectUrl = useMemo(() => result ? URL.createObjectURL(result.blob) : null, [result]);

  function formatBytes(n) {
    if (n >= 1e6) return `${(n / 1048576).toFixed(2)} MB`;
    if (n >= 1e3) return `${(n / 1024).toFixed(2)} KB`;
    return `${n} B`;
  }

  const reduction = result ? ((1 - result.processedSize / result.originalSize) * 100).toFixed(1) : 0;

  return (
    <div className="bg-gradient-to-b from-mist-50 to-white pb-20 pt-10">
      <div className="mx-auto max-w-4xl px-4">
        <button className="text-sm text-sage-600 underline" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">{tool.label}</h1>
        
        <div className="mt-6 rounded-2xl border border-dashed border-sage-300/70 bg-white p-6 shadow-sm">
          {!processed && (
            <>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-10 text-center hover:border-sage-400 transition-colors">
                <div className="rounded-full bg-sage-100 p-3 text-sage-600 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">Click to upload or drag and drop</span>
                <span className="text-xs text-slate-500 mt-1">Accepted: {tool.accept || '*/*'}</span>
                <input
                  type="file"
                  accept={tool.accept}
                  disabled={busy}
                  className="sr-only"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setError('');
                  }}
                />
              </label>

              {file && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sage-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <button
                className="mt-6 w-full rounded-xl bg-sage-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-sage-700 transition-all disabled:opacity-50"
                disabled={busy || !file}
                onClick={() => run(file)}
              >
                {busy ? 'Processing...' : 'Process File'}
              </button>
            </>
          )}

          {busy && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Optimizing content...</span>
                <span>{uploadPct > 0 && uploadPct < 100 ? `Uploading ${uploadPct}%` : downloadPct > 0 ? `Downloading ${downloadPct}%` : ''}</span>
              </div>
              <ProgressBar label="Progress" value={uploadPct > 0 && uploadPct < 100 ? uploadPct : downloadPct} />
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
              {error.includes('limit reached') && (
                <Link to="/pricing" className="mt-2 block text-xs font-bold text-sage-700 underline">
                  Upgrade your plan for higher limits
                </Link>
              )}
            </div>
          )}

          {processed && result && (
            <div className="mt-4 space-y-6">
              <div className="p-6 bg-sage-50 rounded-2xl border border-sage-100 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-200 text-sage-700 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Task Completed!</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Original</p>
                    <p className="text-lg font-bold text-slate-700">{formatBytes(result.originalSize)}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm border-2 border-sage-200">
                    <p className="text-xs text-sage-600 uppercase font-bold tracking-wider">Compressed</p>
                    <p className="text-lg font-bold text-sage-900">{formatBytes(result.processedSize)}</p>
                  </div>
                </div>
                {reduction > 0 && (
                  <p className="mt-3 text-sm font-medium text-sage-600">
                    Reduced by {reduction}%
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  className="flex-1 rounded-xl border-2 border-sage-600 py-3 text-sm font-bold text-sage-600 hover:bg-sage-50 transition-colors"
                  onClick={() => setPreviewVisible(!previewVisible)}
                >
                  {previewVisible ? 'Hide Preview' : 'Preview File'}
                </button>
                <button 
                  className="flex-1 rounded-xl bg-sage-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-sage-700 transition-all"
                  onClick={triggerDownload}
                >
                  Download Now
                </button>
              </div>

              <button 
                className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => {
                  setProcessed(false);
                  setFile(null);
                  setResult(null);
                }}
              >
                Process another file
              </button>

              {previewVisible && (
                <div className="mt-6 border-t pt-6">
                  <p className="text-sm font-bold text-slate-800 mb-3">File Preview:</p>
                  <div className="rounded-xl overflow-hidden border bg-slate-100 min-h-[200px] flex items-center justify-center">
                    {result.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                      <img src={objectUrl} alt="preview" className="max-w-full" />
                    ) : result.filename.toLowerCase().endsWith('.pdf') ? (
                      <iframe title="PDF Preview" src={objectUrl} className="h-[500px] w-full" />
                    ) : result.filename.toLowerCase().match(/\.(txt|md|csv|log)$/) ? (
                      <iframe title="Text Preview" src={objectUrl} className="h-[400px] w-full bg-white p-4 font-mono text-xs" />
                    ) : result.filename.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? (
                      <video controls className="max-w-full max-h-[500px]">
                        <source src={objectUrl} type={result.blob.type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="text-center p-10">
                        <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm text-slate-500">Direct preview not available for this file type.</p>
                        <p className="text-xs text-slate-400 mt-1">{result.filename}</p>
                        <p className="text-xs text-slate-400">Please download to view the full content.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
