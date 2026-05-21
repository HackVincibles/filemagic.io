/**
 * Purpose: Simple about page.
 */
export default function About() {
  return (
    <div className="bg-gradient-to-b from-mist-50 to-white pb-20 pt-10">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-slate-900">About filemagic.io</h1>
        <p className="mt-4 text-slate-600">
          filemagic.io is a file utility platform built for compression, decompression, and conversion. The site uses a custom Java processing engine for core lossless compression algorithms.
        </p>
      </div>
    </div>
  );
}
