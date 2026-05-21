/**
 * Purpose: Sticky top navigation — HTML nav + links.
 */
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-sage-500/15 text-sage-600' : 'text-slate-600 hover:text-sage-600'
  }`;

export default function Navbar({ theme = 'light', setTheme = () => {} }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-slate-900">
          filemagic<span className="text-sage-500">.io</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <NavLink to="/" className={linkCls} end>
            Home
          </NavLink>

          <div className="relative group">
            <button type="button" className={`${linkCls({isActive:false})} inline-flex items-center gap-1`}>
              PDF online tools <span aria-hidden="true">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-30 mt-1 w-72 whitespace-nowrap rounded-lg border border-slate-200 bg-white p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <ul className="space-y-2 text-sm text-slate-700">
                <li><NavLink to="/tools" className="block px-2 py-1 hover:bg-slate-100 rounded">All tools</NavLink></li>
                <li><NavLink to="/tool/compress" className="block px-2 py-1 hover:bg-slate-100 rounded">Compress file</NavLink></li>
                <li><NavLink to="/tool/decompress" className="block px-2 py-1 hover:bg-slate-100 rounded">Decompress file</NavLink></li>
                <li><NavLink to="/tool/convert-text" className="block px-2 py-1 hover:bg-slate-100 rounded">Convert text</NavLink></li>
                <li><NavLink to="/tool/pdf-to-word" className="block px-2 py-1 hover:bg-slate-100 rounded">PDF to Word</NavLink></li>
              </ul>
            </div>
          </div>

          <div className="relative group">
            <button type="button" className={`${linkCls({isActive:false})} inline-flex items-center gap-1`}>
              PDF tools <span aria-hidden="true">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-30 mt-1 w-80 whitespace-nowrap rounded-lg border border-slate-200 bg-white p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Edit & Read</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li><NavLink to="/tool/edit-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Edit PDF</NavLink></li>
                <li><NavLink to="/tool/read-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Read PDF</NavLink></li>
                <li><NavLink to="/tool/compress-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Compress PDF</NavLink></li>
                <li><NavLink to="/tool/merge-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Merge PDF</NavLink></li>
                <li><NavLink to="/tool/crop-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Crop PDF</NavLink></li>
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Convert from PDF</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li><NavLink to="/tool/pdf-to-word" className="block px-2 py-1 hover:bg-slate-100 rounded">PDF to Word</NavLink></li>
                <li><NavLink to="/tool/pdf-to-png" className="block px-2 py-1 hover:bg-slate-100 rounded">PDF to PNG</NavLink></li>
                <li><NavLink to="/tool/pdf-to-jpg" className="block px-2 py-1 hover:bg-slate-100 rounded">PDF to JPG</NavLink></li>
                <li><NavLink to="/tool/pdf-to-excel" className="block px-2 py-1 hover:bg-slate-100 rounded">PDF to Excel</NavLink></li>
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-400">More</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li><NavLink to="/tool/extract-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Extract PDF</NavLink></li>
                <li><NavLink to="/tool/sign-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Sign PDF</NavLink></li>
                <li><NavLink to="/tool/flatten-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Flatten PDF</NavLink></li>
                <li><NavLink to="/tool/split-pdf" className="block px-2 py-1 hover:bg-slate-100 rounded">Split PDF</NavLink></li>
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
            className="rounded-xl border px-3 py-2 text-sm font-medium text-slate-600 hover:bg-mist-100 md:px-4"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 hidden sm:inline">
                {user.displayName}
              </span>
              <button
                onClick={logout}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-mist-100 md:px-4"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-mist-100 md:px-4"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-sage-500 to-plum-500 px-3 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-95 md:px-4"
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
