import { FiCpu, FiLock, FiZap, FiLayers } from 'react-icons/fi';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pt-20 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-primary-500/10 dark:bg-primary-400/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 mb-6 relative z-10">
            About filemagic.io
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed relative z-10">
            The ultimate utility platform for everything files. From lossless compression to seamless conversions, powered by a lightning-fast custom Java processing engine.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          <div className="fm-glass dark:fm-glass-dark rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300 border border-white/50 dark:border-slate-800/50 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-6 relative z-10">
              <FiCpu className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">Custom Java Engine</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              At the heart of filemagic is a bespoke Java processing engine, engineered for highly optimized data handling. We don't just rely on standard libraries; we built our own algorithms to ensure maximum efficiency.
            </p>
          </div>

          <div className="fm-glass dark:fm-glass-dark rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300 border border-white/50 dark:border-slate-800/50 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-6 relative z-10">
              <FiZap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">Lightning Fast</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              Designed from the ground up to minimize latency. Operations like PDF manipulation, text encoding conversions, and image extractions happen in milliseconds.
            </p>
          </div>

          <div className="fm-glass dark:fm-glass-dark rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300 border border-white/50 dark:border-slate-800/50 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-6 relative z-10">
              <FiLock className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">Privacy First</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              Your files are your business. Uploaded files are processed securely in memory and are strictly purged from our servers to ensure absolute confidentiality.
            </p>
          </div>

          <div className="fm-glass dark:fm-glass-dark rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300 border border-white/50 dark:border-slate-800/50 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="w-14 h-14 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-6 relative z-10">
              <FiLayers className="w-7 h-7 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">Versatile Formats</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              Compress, decompress, merge, convert. Whether it's PDFs, raw text, or binary data, filemagic provides the unified interface you need to master your workflow.
            </p>
          </div>

        </div>

        {/* Bottom Call to Action */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-indigo-600/20"></div>
          <div className="relative p-10 md:p-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to experience the magic?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">Join thousands of users who are optimizing their daily digital tasks with our advanced toolkit.</p>
            <a href="/" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-slate-900 bg-white hover:bg-slate-100 transition-colors duration-200">
              Try It Now
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
