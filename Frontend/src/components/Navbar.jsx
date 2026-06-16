/**
 * Purpose: Sticky top navigation - purple theme
 */
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary-500/15 text-primary-600 dark:bg-primary-400/20 dark:text-primary-400'
      : 'text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400'
  }`;

export default function Navbar({ theme = 'light', setTheme = () => {} }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 dark:border-primary-900/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          filemagic<span className="text-primary-600 dark:text-primary-400">.io</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <NavLink to="/" className={linkCls} end>
            Home
          </NavLink>

          <div className="relative group">
            <button type="button" className={`${linkCls({ isActive: false })} inline-flex items-center gap-1`}>
              PDF online tools <span aria-hidden="true">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-30 mt-1 w-72 whitespace-nowrap rounded-lg border border-primary-200 dark:border-primary-800 bg-white dark:bg-slate-900 p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <li><NavLink to="/tools" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">All tools</NavLink></li>
                <li><NavLink to="/upload?op=COMPRESS" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Compress file</NavLink></li>
                <li><NavLink to="/upload?op=DECOMPRESS" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Decompress file</NavLink></li>
                <li><NavLink to="/upload?op=CONVERT" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Convert text</NavLink></li>
                <li><NavLink to="/tool/pdf-to-word" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">PDF to Word</NavLink></li>
              </ul>
            </div>
          </div>

          <div className="relative group">
            <button type="button" className={`${linkCls({ isActive: false })} inline-flex items-center gap-1`}>
              PDF tools <span aria-hidden="true">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-30 mt-1 w-80 whitespace-nowrap rounded-lg border border-primary-200 dark:border-primary-800 bg-white dark:bg-slate-900 p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 dark:text-primary-400">Edit & Read</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                <li><NavLink to="/tool/edit-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Edit PDF</NavLink></li>
                <li><NavLink to="/tool/read-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Read PDF</NavLink></li>
                <li><NavLink to="/tool/compress-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Compress PDF</NavLink></li>
                <li><NavLink to="/tool/merge-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Merge PDF</NavLink></li>
                <li><NavLink to="/tool/crop-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Crop PDF</NavLink></li>
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary-500 dark:text-primary-400">Convert from PDF</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                <li><NavLink to="/tool/pdf-to-word" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">PDF to Word</NavLink></li>
                <li><NavLink to="/tool/pdf-to-png" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">PDF to PNG</NavLink></li>
                <li><NavLink to="/tool/pdf-to-jpg" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">PDF to JPG</NavLink></li>
                <li><NavLink to="/tool/pdf-to-excel" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">PDF to Excel</NavLink></li>
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary-500 dark:text-primary-400">More</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                <li><NavLink to="/tool/extract-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Extract PDF</NavLink></li>
                <li><NavLink to="/tool/sign-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Sign PDF</NavLink></li>
                <li><NavLink to="/tool/flatten-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Flatten PDF</NavLink></li>
                <li><NavLink to="/tool/split-pdf" className="block px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded">Split PDF</NavLink></li>
              </ul>
            </div>
          </div>

          <NavLink to="/pricing" className={linkCls}>
            {user && (user.subscriptionPlanId === 3 || user.subscriptionPlanId === 4) ? 'Plan Details' : 'Buy Premium'}
          </NavLink>
          <NavLink to="/resources" className={linkCls}>
            Resources
          </NavLink>
          <NavLink to="/about" className={linkCls}>
            About
          </NavLink>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-2 rounded-xl border border-primary-300 dark:border-primary-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 md:px-4 transition-colors"
          >
            {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">
                {user.displayName}
              </span>
              <button
                onClick={logout}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 md:px-4 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 md:px-4 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-95 md:px-4"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
