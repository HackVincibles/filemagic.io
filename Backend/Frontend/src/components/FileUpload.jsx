/**
 * Purpose: Drag-drop + file input (HTML) + operation controls + XHR progress.
 */
import { useCallback, useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { processFile, fetchPlans, normalizePlan } from '../services/fileService';

const operations = [
  { id: 'COMPRESS', label: 'Compress', hint: 'Huffman / LZ77 / RLE (custom engine)' },
  { id: 'DECOMPRESS', label: 'Decompress', hint: 'Auto-detect FMH1 · FML1 · FMR1' },
  { id: 'CONVERT', label: 'Convert text', hint: 'UTF-8 ↔ UTF-16, line endings, CSV→TSV' },
];

const algos = [
  { id: 'AUTO', label: 'Auto' },
  { id: 'HUFFMAN', label: 'Huffman' },
  { id: 'LZ77', label: 'LZ77' },
  { id: 'RLE', label: 'RLE' },
];

const convModes = [
  { id: 'UTF8_TO_UTF16BE', label: 'UTF-8 → UTF-16 BE' },
  { id: 'UTF16BE_TO_UTF8', label: 'UTF-16 BE → UTF-8' },
  { id: 'LINE_CRLF', label: 'Line endings → CRLF' },
  { id: 'LINE_LF', label: 'Line endings → LF' },
  { id: 'CSV_TO_TSV', label: 'CSV → TSV' },
];

export default function FileUpload({ showAdPlaceholder = true, initialOperation = 'COMPRESS' }) {
  const fileInputId = useId();
  const convertSelectId = useId();
  const [file, setFile] = useState(null);
  const [operation, setOperation] = useState(initialOperation);
  const [compressionAlgorithm, setCompressionAlgorithm] = useState('AUTO');
  const [conversionMode, setConversionMode] = useState('UTF8_TO_UTF16BE');
  const [uploadPct, setUploadPct] = useState(0);
  const [downloadPct, setDownloadPct] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (['COMPRESS', 'DECOMPRESS', 'CONVERT'].includes(initialOperation)) {
      setOperation(initialOperation);
    }
  }, [initialOperation]);

  useEffect(() => {
    fetchPlans().then((plans) => {
      // Assume guest plan for now; in real app, check auth
      const guestPlan = plans.find(p => p.code === 'GUEST') || plans[0];
      setPlan(normalizePlan(guestPlan));
    }).catch(() => {
      // Fallback
      setPlan({ maxFileBytes: 52428800, displayName: 'Guest' });
    });
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }, []);

  const run = async () => {
    if (!file) {
      setError('Choose a file first.');
      return;
    }
    setError('');
    setBusy(true);
    setUploadPct(0);
    setDownloadPct(0);
    try {
      const opts = { operation };
      if (operation === 'CONVERT') opts.conversionMode = conversionMode;
      if (operation === 'COMPRESS') opts.compressionAlgorithm = compressionAlgorithm;
      const { blob, filename } = await processFile(
        file,
        opts,
        (p) => setUploadPct(p),
        (p) => setDownloadPct(p)
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || 'Processing failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-glass rounded-2xl p-6 shadow-soft md:p-8">
      {showAdPlaceholder && (
        <div className="mb-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-mist-50/80 dark:bg-slate-950 px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
          Ad slot — hidden for premium users (integrate AdSense / your network here).
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="fm-card-3d cursor-pointer rounded-2xl border-2 border-dashed border-sage-300/60 bg-white/50 dark:bg-slate-900 px-6 py-10 text-center"
      >
        <input
          type="file"
          className="sr-only"
          id={fileInputId}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <label htmlFor={fileInputId} className="cursor-pointer">
          <p className="font-display text-lg font-semibold text-slate-800 dark:text-slate-200">Drop a file here</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">or click to browse — one file at a time</p>
          {plan && (
            <p className="mt-1 text-xs text-slate-400">
              Max size: {(plan.maxFileBytes / 1048576).toFixed(0)} MB ({plan.displayName} plan)
            </p>
          )}
        </label>
        {file && (
          <p className="mt-4 text-sm font-medium text-sage-600 dark:text-sage-400">
            {file.name} <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
          </p>
        )}
      </div>

      <fieldset className="mt-6 grid gap-4 border-0 md:grid-cols-3">
        <legend className="sr-only">Choose operation</legend>
        {operations.map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => setOperation(op.id)}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              operation === op.id
                ? 'border-sage-500 bg-sage-500/10 shadow-soft'
                : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 hover:border-sage-300'
            }`}
          >
            <p className="font-semibold text-slate-800 dark:text-slate-200">{op.label}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{op.hint}</p>
          </button>
        ))}
      </fieldset>

      {operation === 'COMPRESS' && (
        <p className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-mist-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
          Filemagic will pick the best algorithm automatically based on filesize and content fingerprint (Huffman / LZ77 / RLE internally). You can still set `compressionAlgorithm` for debugging in advanced mode later.
        </p>
      )}

      {operation === 'CONVERT' && (
        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={convertSelectId}>
          Conversion mode
          <select
            id={convertSelectId}
            className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm"
            value={conversionMode}
            onChange={(e) => setConversionMode(e.target.value)}
          >
            {convModes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {busy && (
        <div className="mt-6 space-y-3">
          <ProgressBar value={uploadPct} label="Upload" />
          <ProgressBar value={downloadPct} label="Download" />
        </div>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={run}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sage-500 to-plum-500 py-3.5 font-semibold text-white shadow-lift transition hover:opacity-95 disabled:opacity-50"
      >
        {busy ? 'Working…' : 'Process & download'}
      </button>

      {error && (
        <div className="mt-3 text-center">
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
          {error.includes('limit reached') && (
            <Link to="/pricing" className="mt-2 inline-block text-xs font-semibold text-sage-600 dark:text-sage-400 underline">
              Upgrade your plan for higher limits
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
