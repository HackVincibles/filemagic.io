/**
 * Purpose: Site footer — HTML nav + lists.
 */
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/60 py-12 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-slate-900">filemagic.io</p>
          <p className="mt-2 text-sm text-slate-500">
            Compress, decompress, and convert files with a calm, fast web experience.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Tools</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/upload" className="hover:text-sage-600">
                File tools
              </Link>
            </li>
            <li>
              <Link to="/upload?op=COMPRESS" className="hover:text-sage-600">
                Compress
              </Link>
            </li>
            <li>
              <Link to="/upload?op=CONVERT" className="hover:text-sage-600">
                Convert text
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/pricing" className="hover:text-sage-600">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-sage-600">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/login" className="hover:text-sage-600">
                Log in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-sage-600">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-400">
        Inspired by modern tool suites like{' '}
        <a href="https://www.pdfgear.com/" className="underline hover:text-sage-600" target="_blank" rel="noreferrer">
          PDFgear
        </a>
        — built with HTML, React, and a custom engine.
      </p>
    </footer>
  );
}
