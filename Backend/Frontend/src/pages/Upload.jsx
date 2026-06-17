/**
 * Purpose: Dedicated file tools page — full upload UI (PDFGear-style workflow).
 */
import { Link, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import FileUpload from '../components/FileUpload';

export default function Upload() {
  const [params] = useSearchParams();
  const initialOp = useMemo(() => {
    const op = (params.get('op') || '').toUpperCase();
    if (['COMPRESS', 'DECOMPRESS', 'CONVERT'].includes(op)) return op;
    return 'COMPRESS';
  }, [params]);

  return (
    <div className="bg-gradient-to-b from-mist-50 to-white pb-20 pt-8">
      <div className="mx-auto max-w-4xl px-4">
        <nav className="text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-sage-600 dark:text-sage-400">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-800 dark:text-slate-200">File tools</li>
          </ol>
        </nav>

        <header className="mt-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sage-600 dark:text-sage-400">Online tools</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Upload &amp; process your file
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Choose compress, decompress, or text conversion. Upload and download progress are shown in real time. Guest
            limits apply until you sign in.
          </p>
        </header>

        <div className="mt-10">
          <FileUpload showAdPlaceholder initialOperation={initialOp} />
        </div>

        <section className="mt-12 rounded-2xl border border-slate-200/80 dark:border-slate-700 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900 dark:bg-slate-900/70 p-6 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400" aria-labelledby="tips-heading">
          <h2 id="tips-heading" className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Quick tips
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>Compress outputs use our custom formats (FMH1 / FML1 / FMR1) — use Decompress to restore.</li>
            <li>Conversion modes expect UTF-8 text unless you use UTF-16 BE options.</li>
            <li>Connect the API and MySQL locally for full account limits and history (premium).</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
