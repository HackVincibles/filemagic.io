/**
 * Purpose: Determinate progress strip for uploads, downloads, and page loading states.
 */
export default function ProgressBar({ value, label }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-mist-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sage-500 to-plum-500 transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
