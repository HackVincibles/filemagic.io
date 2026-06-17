/**
 * Purpose: Router shell — lazy routes for smaller initial JS.
 */
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import ErrorBoundary from './components/ErrorBoundary';

const Home          = lazy(() => import('./pages/Home'));
const Upload        = lazy(() => import('./pages/Upload'));
const Tools         = lazy(() => import('./pages/Tools'));
const PdfTools      = lazy(() => import('./pages/PdfTools'));
const ToolRunner    = lazy(() => import('./pages/ToolRunner'));
const Resources     = lazy(() => import('./pages/Resources'));
const About         = lazy(() => import('./pages/About'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Pricing       = lazy(() => import('./pages/Pricing'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const NotFound      = lazy(() => import('./pages/NotFound'));

export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <ErrorBoundary>
        <div className="flex min-h-screen flex-col" data-theme={theme}>
          <Navbar theme={theme} setTheme={setTheme} />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"                element={<Home />} />
                <Route path="/upload"          element={<Upload />} />
                <Route path="/tools"           element={<Tools />} />
                <Route path="/pdf-tools"       element={<PdfTools />} />
                <Route path="/tool/:id"        element={<ToolRunner />} />
                <Route path="/resources"       element={<Resources />} />
                <Route path="/about"           element={<About />} />
                <Route path="/login"           element={<Login />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/dashboard"       element={<Dashboard />} />
                <Route path="/pricing"         element={<Pricing />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                {/* Catch-all → 404 */}
                <Route path="*"               element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
