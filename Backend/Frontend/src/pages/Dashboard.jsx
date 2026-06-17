/**
 * Purpose: Post-login hub — token status + quick link to tools.
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {user ? `Welcome back, ${user.displayName}! You are on the ${user.subscriptionPlanCode === 'INDIVIDUAL' ? 'Individual' : user.subscriptionPlanCode === 'BUSINESS' ? 'Business' : 'Free'} plan.` : 'Sign in for registered user limits.'}
          </p>
        </div>
        {user ? (
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-mist-100"
          >
            Log out
          </button>
        ) : (
          <Link
            to="/login"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Log in
          </Link>
        )}
      </div>
      <p className="mt-6">
        <Link
          to="/upload"
          className="inline-flex rounded-xl bg-gradient-to-r from-sage-500 to-plum-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:opacity-95"
        >
          Open full file tools page
        </Link>
      </p>
      <div className="mt-10">
        <FileUpload showAdPlaceholder={!user} />
      </div>
      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/pricing" className="text-sage-600 dark:text-sage-400 underline">
          Upgrade
        </Link>{' '}
        for batch processing and file history.
      </p>
    </div>
  );
}
