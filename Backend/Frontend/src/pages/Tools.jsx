/**
 * Purpose: All-tools landing page with sections mirroring PDFgear.
 */
import { Link } from 'react-router-dom';

const tools = [
  { category: 'Edit & Read', items: ['Edit PDF', 'Read PDF', 'Compress PDF', 'Merge PDF', 'Crop PDF', 'Highlight PDF', 'Annotate PDF', 'Unlock PDF', 'Split PDF'] },
  { category: 'Convert from PDF', items: ['PDF to Word', 'PDF to PNG', 'PDF to JPG', 'PDF to Excel', 'PDF to PPT', 'PDF to PPTX', 'PDF to PSD'] },
  { category: 'Convert to PDF', items: ['HEIC to PDF', 'Excel to PDF', 'RTF to PDF', 'TXT to PDF', 'Word to PDF', 'JPG to PDF', 'PNG to PDF', 'PPT to PDF', 'PSD to PDF'] },
  { category: 'More tools', items: ['Extract PDF', 'Sign PDF', 'Rotate PDF', 'Delete PDF Pages', 'Add Pages to PDF', 'Fill out PDF', 'Create Fillable PDF', 'Flatten PDF'] },
];

function toRouteId(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default function Tools() {
  return (
    <div className="bg-gradient-to-b from-mist-50 to-white pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">All PDF tools</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Pick a tool and process directly with a dedicated drop zone, preview, and download.</p>

        {tools.map((section) => (
          <section key={section.category} className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{section.category}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {section.items.map((item) => (
                <Link
                  key={item}
                  to={`/tool/${toRouteId(item)}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-sage-300 hover:bg-sage-50"
                >
                  {item}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
