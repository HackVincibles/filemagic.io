/**
 * Purpose: Static “Resources” reference page for docs, playbook, API, and setup.
 */
import { Link } from 'react-router-dom';

export default function Resources() {
  return (
    <div className="bg-gradient-to-b from-mist-50 to-white pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900">Resources & Docs</h1>
          <p className="mt-2 text-slate-600">
            Find architecture notes, compression/conversion algorithm details, and integration guidance for cloud storage + payments.
          </p>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="font-semibold text-slate-900">Core platform features</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-600">
            <li>Custom compression engine (Huffman / LZ77 / RLE) inside `file-processing-engine` module.</li>
            <li>Spring Boot API with rate limiting, guest + JWT auth, and per-plan file size limits.</li>
            <li>React + Tailwind frontend with real-time upload/download progress bars and responsive page layout.</li>
          </ul>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="font-semibold text-slate-900">What changed in this sprint</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-600">
            <li>Added top nav item `Resources` and route `/resources`.</li>
            <li>Frontend now uses auto compression algorithm by default; internal selection hidden for normal users.</li>
            <li>Progress log updated in `docs/PROJECT_DEVELOPMENT_LOG.md`.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="font-semibold text-slate-900">Next implementation tasks</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-600">
            <li>Implement file history persistence and auto-expire (7/15 days) in backend + MySQL.</li>
            <li>Integrate Razorpay, create checkout API and webhook handlers.</li>
            <li>Build S3 persistence service and switch storage based on plan (guest in-memory vs premium object store).</li>
            <li>Batch upload queue (RabbitMQ/Kafka) for premium workloads.</li>
          </ul>
        </section>

        <div className="mt-8 text-sm text-slate-500">
          <Link to="/" className="font-medium text-sage-600 hover:underline">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
