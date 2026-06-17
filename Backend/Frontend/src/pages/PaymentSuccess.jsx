import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PaymentSuccess() {
  const { refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-sage-100 p-3 text-sage-600 dark:text-sage-400">
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Payment Successful!</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Thank you for your purchase. Your account has been upgraded and your new limits are now active.
      </p>
      {sessionId && (
        <p className="mt-2 text-xs text-slate-400">Session ID: {sessionId}</p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/dashboard"
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lift hover:bg-slate-800"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/tools"
          className="rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800"
        >
          Explore Tools
        </Link>
      </div>
    </div>
  );
}
