/**
 * Purpose: Marketing landing — PDFGear-style sections: hero, tools, trust, features, FAQ, CTA (semantic HTML).
 */
import { Link } from 'react-router-dom';

const onlineTools = [
  { title: 'Compress file', desc: 'Smaller archives with Huffman, LZ77, or RLE.', href: '/upload?op=COMPRESS', tag: 'Popular' },
  { title: 'Decompress', desc: 'Restore FMH1, FML1, or FMR1 outputs.', href: '/upload?op=DECOMPRESS', tag: 'Lossless' },
  { title: 'Convert text', desc: 'UTF-8 ↔ UTF-16, line endings, CSV→TSV.', href: '/upload?op=CONVERT', tag: 'Text' },
  { title: 'Batch (soon)', desc: 'Premium — process many files in one queue.', href: '/pricing', tag: 'Pro' },
  { title: 'File history', desc: 'Premium — re-download from cloud storage.', href: '/pricing', tag: 'Soon' },
  { title: 'API-ready', desc: 'Spring Boot backend for auth & limits.', href: '/pricing', tag: 'Dev' },
];

const whyUs = [
  { title: 'Custom engine', text: 'Core compression is implemented in Java — no ZIP libraries for the main codecs.' },
  { title: 'Clear limits', text: 'Guests, free, and paid tiers with daily quotas — enforced server-side.' },
  { title: 'Progress everywhere', text: 'Upload and download bars so you always see what is happening.' },
];

const steps = [
  { n: '1', title: 'Pick a tool', text: 'Open File tools and choose compress, decompress, or convert.' },
  { n: '2', title: 'Upload one file', text: 'Drag & drop or browse. We process one file at a time on free tiers.' },
  { n: '3', title: 'Download result', text: 'Your browser saves the output when processing completes.' },
];

const faqs = [
  {
    q: 'Is filemagic.io free?',
    a: 'Yes — guests can use core tools with limits. Sign up for higher limits; premium adds batch and history.',
  },
  {
    q: 'Do you use ZIP or PDF libraries for compression?',
    a: 'No — our engine uses custom Huffman, LZ77, and RLE formats (FMH1, FML1, FMR1). Decompress detects the format.',
  },
  {
    q: 'Where are my files stored?',
    a: 'Processing runs against your upload stream. Premium history + cloud storage will use your chosen provider (e.g. S3) when you connect the backend.',
  },
  {
    q: 'Do I need to install Spring Boot?',
    a: 'No separate app — you need JDK + Maven (or Docker) to run the API. The frontend is this React site only.',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-mist-100 via-white to-mist-50"
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-plum-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-sage-400/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 md:flex md:items-center md:gap-12 md:pt-20">
          <div className="flex-1">
            <p className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-sage-600 shadow-sm ring-1 ring-sage-500/20">
              Free online · No clutter · Built for speed
            </p>
            <h1 id="hero-heading" className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
              PDF & file tasks made <span className="text-sage-600">easy</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Compress, decompress, and convert — in the browser, with a soft minimal UI inspired by leading tool
              suites. Connect the API when you are ready for accounts and payments.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-800 ring-1 ring-amber-200/80">
                <span aria-hidden="true">★★★★★</span> <span className="font-semibold">4.9</span>
                <span className="text-amber-700/80">(demo rating)</span>
              </span>
              <span>Trusted workflow · HTTPS-ready</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/upload"
                className="inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lift hover:bg-slate-800"
              >
                Open file tools
              </Link>
              <Link
                to="/pricing"
                className="inline-flex rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-sage-300"
              >
                View plans
              </Link>
            </div>
          </div>
          <div className="relative mt-12 flex flex-1 justify-center md:mt-0">
            <div className="animate-float fm-glass relative w-full max-w-md rounded-3xl p-6 shadow-lift">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-sage-400/30 to-plum-500/20 blur-xl" />
              <div className="relative space-y-3">
                <div className="h-3 w-3/4 rounded-full bg-mist-200" />
                <div className="h-3 w-1/2 rounded-full bg-sage-200" />
                <div className="h-24 rounded-2xl bg-gradient-to-br from-mist-100 to-white ring-1 ring-slate-100" />
                <div className="flex gap-2">
                  <span className="h-8 flex-1 rounded-lg bg-sage-500/20" />
                  <span className="h-8 flex-1 rounded-lg bg-plum-500/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-200/60 bg-white/50 py-10" aria-labelledby="trust-heading">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 id="trust-heading" className="sr-only">
            Trusted by teams
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Trusted style</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale">
            {['Creators', 'Teams', 'Studios', 'Startups', 'Ops'].map((x) => (
              <span key={x} className="font-display text-lg font-semibold text-slate-500">
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Online tools grid — PDFGear “Free Online Tools” style */}
      <section id="tools" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="font-display text-center text-3xl font-bold text-slate-900">
          Free online tools
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          A focused set of utilities — same spirit as suites like{' '}
          <a href="https://www.pdfgear.com/" className="text-sage-600 underline" target="_blank" rel="noreferrer">
            PDFgear
          </a>
          , with a calmer palette and a custom engine.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {onlineTools.map((t) => (
            <article key={t.title} className="fm-card-3d fm-glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-slate-900">{t.title}</h3>
                <span className="shrink-0 rounded-full bg-plum-500/10 px-2 py-0.5 text-xs font-semibold text-plum-600">
                  {t.tag}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
              <Link to={t.href} className="mt-4 inline-block text-sm font-semibold text-sage-600 hover:underline">
                Open →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="border-y border-slate-200/60 bg-mist-50/80 py-16" aria-labelledby="why-heading">
        <div className="mx-auto max-w-6xl px-4">
          <h2 id="why-heading" className="text-center font-display text-2xl font-bold text-slate-900">
            Why filemagic.io
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {whyUs.map((w) => (
              <article key={w.title} className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-slate-900">{w.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-center font-display text-2xl font-bold text-slate-900">
          How it works
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <span className="font-display text-3xl font-bold text-sage-200">{s.n}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Security */}
      <section className="bg-slate-900 py-14 text-white" aria-labelledby="security-heading">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 id="security-heading" className="font-display text-2xl font-bold">
            Security &amp; privacy
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            The frontend talks to your Spring Boot API over HTTPS in production. Use strong JWT secrets, rate limits,
            and validated uploads. Premium file history should use encrypted storage (e.g. S3 with SSE) and retention
            policies you control.
          </p>
        </div>
      </section>

      {/* FAQ — native HTML details/summary */}
      <section className="mx-auto max-w-3xl px-4 py-16" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-center font-display text-2xl font-bold text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 open:shadow-md">
              <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/80 bg-gradient-to-r from-sage-500/10 to-plum-500/10 py-16" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 id="cta-heading" className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
            Ready to process a file?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-slate-600">
            No install required in the browser — connect MySQL and run the API when you want full accounts and Razorpay.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/upload"
              className="inline-flex rounded-2xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lift hover:bg-slate-800"
            >
              Go to file tools
            </Link>
            <Link
              to="/register"
              className="inline-flex rounded-2xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-800 hover:border-sage-400"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
