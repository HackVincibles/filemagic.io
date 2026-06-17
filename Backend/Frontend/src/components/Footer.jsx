/**
 * Purpose: Site footer — HTML nav + lists.
 */
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-700 bg-white/60 dark:bg-slate-900 py-12 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">filemagic.io</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Compress, decompress, and convert files with a calm, fast web experience.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tools</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link to="/upload" className="hover:text-sage-600 dark:text-sage-400">
                File tools
              </Link>
            </li>
            <li>
              <Link to="/upload?op=COMPRESS" className="hover:text-sage-600 dark:text-sage-400">
                Compress
              </Link>
            </li>
            <li>
              <Link to="/upload?op=CONVERT" className="hover:text-sage-600 dark:text-sage-400">
                Convert text
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link to="/pricing" className="hover:text-sage-600 dark:text-sage-400">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-sage-600 dark:text-sage-400">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link to="/login" className="hover:text-sage-600 dark:text-sage-400">
                Log in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-sage-600 dark:text-sage-400">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-400">
        Inspired by modern tool suites like{' '}
        <a href="https://www.pdfgear.com/" className="underline hover:text-sage-600 dark:text-sage-400" target="_blank" rel="noreferrer">
          PDFgear
        </a>
        — built with HTML, React, and a custom engine.
      </p>
    </footer>
  );
}
