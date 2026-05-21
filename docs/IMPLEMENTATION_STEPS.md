# Implementation Steps (current sprint)

1. Inspect existing structure
   - Confirmed modules: `Frontend`, `Backend`, `file-processing-engine`, `database`, `docs`, etc.
   - Identified hand-written compression engine in `file-processing-engine` (Huffman, LZ77, RLE). 

2. Fix network path / upload flow
   - Reviewed `Frontend/src/services/fileService.js` and ensured `/api/files/process` is target.
   - Validated Vite proxy config in `Frontend/vite.config.js` pointed to `http://localhost:8080`.
   - Added error handling to show backend JSON errors if present.

3. Add navigation and tool pages
   - Updated `Frontend/src/components/Navbar.jsx`: menu items: Home, PDF online tools, PDF tools, Premium, Resources, About, Login, Sign up, theme toggle.
   - Added hover dropdown submenus with category groups mirroring PDFgear.
   - Updated `Frontend/src/App.jsx`: routes `/tools`, `/pdf-tools`, `/tool/:id`, `/resources`, `/about`.
   - Created `Frontend/src/pages/Tools.jsx`, `PdfTools.jsx`, `ToolRunner.jsx`, `About.jsx`.

4. Tool runner behavior
   - Tool runner supports:
     - compress/decompress for any files (one file, auto/selected by tool config),
     - convert text operations, 
     - preview for image/pdf results,
     - download button.
   - Automatic start when file selected (except placeholders for not-yet-supported conversions like `pdf-to-word`).

5. UI wording and product alignment
   - changed `Upload` action text and `Home` text to include PDF tasks.
   - renamed nav label from `File tools` to `PDF online tools`.
   - set `Pricing` nav label to `Premium`.

6. Theme toggle
   - Added dark/light mode toggling in `App` and `Navbar`.

7. Documentation and workflow log updates
   - `docs/PROJECT_DEVELOPMENT_LOG.md` updated.
   - `docs/IMPLEMENTATION_STEPS.md` created.
   - `readme.md` extended with cloud/premium and payment integration guidance.

8. Build and validation
   - Frontend build: success.
   - Backend build: not available due missing Maven binary in environment at check time.

9. UI enhancements
   - Updated FileUpload to display max file size based on fetched user plan.
   - Enhanced Pricing page with 4 cards, premium styling for Individual/Business, and purchase buttons.

## Pending tasks for full pdfgear parity

- Implement full PDF conversions (PDF→Word/PPT/XLS, etc.) with strong tool-specific parsers.
- Add OCR and image conversions (JPG/PNG to PDF), plus signature and manipulation features.
- Add real batch endpoints + queue for premium uploads.
- Add database file history + retention job.
- Add Razorpay checkout enforce subscription plan in backend.
- Add full test coverage for each `/tool/:id` endpoint and UI.
