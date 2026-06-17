/**
 * Purpose: PDF tools overview page for all PDF-related feature links.
 */
import { Link } from 'react-router-dom';

const categories = [
  { title: 'Edit & Read', items: ['Edit PDF', 'Read PDF', 'Compress PDF', 'Merge PDF', 'Crop PDF', 'Highlight PDF', 'Annotate PDF', 'Unlock PDF', 'Split PDF'] },
  { title: 'AI & OCR', items: ['OCR PDF', 'Summarize PDF'] },
  { title: 'Convert from PDF', items: ['PDF to Word', 'PDF to PNG', 'PDF to JPG', 'PDF to Excel', 'PDF to PPT', 'PDF to PPTX', 'PDF to PSD'] },
  { title: 'Convert to PDF', items: ['HEIC to PDF', 'Excel to PDF', 'RTF to PDF', 'TXT to PDF', 'Word to PDF', 'JPG to PDF', 'PNG to PDF', 'PPT to PDF', 'PSD to PDF'] },
  { title: 'More tools', items: ['Extract PDF', 'Sign PDF', 'Rotate PDF', 'Delete PDF Pages', 'Add Pages to PDF', 'Fill out PDF', 'Create Fillable PDF', 'Flatten PDF', 'Redact PDF', 'Watermark PDF', 'Add Page Numbers', 'Bates Numbering', 'Compare PDFs', 'Validate PDF/A', 'Repair PDF', 'Convert PDF to HTML', 'Convert HTML to PDF', 'Convert EPUB to PDF', 'Convert PDF to EPUB'] },
];

const nameToId = (name) => name.toLowerCase().replace(/\s+/g, '-');

export default function PdfTools() {
  return (
    <div className="bg-gradient-to-b from-mist-50 to-white pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">PDF Tools</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">All PDF operations in one place, with a workflow that redirects to a dedicated upload process.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {categories.map((category) => (
            <section key={category.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{category.title}</h2>
              <div className="mt-3 grid gap-2">
                {category.items.map((item) => (
                  <Link
                    key={item}
                    to={`/tool/${nameToId(item)}`}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-sage-300 hover:bg-sage-50"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
