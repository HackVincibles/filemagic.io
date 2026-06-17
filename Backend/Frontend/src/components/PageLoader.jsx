/**
 * Purpose: Route-level suspense fallback — lightweight loading bar.
 */
import ProgressBar from './ProgressBar';

export default function PageLoader() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <p className="mb-3 text-center text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      <ProgressBar value={66} label="Page" />
    </div>
  );
}
