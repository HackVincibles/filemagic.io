package io.filemagic.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class PdfService {

    public byte[] performOcr(byte[] imageBytes) throws IOException {
        Tesseract tesseract = new Tesseract();
        try {
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
            String result = tesseract.doOCR(image);
            return result.getBytes();
        } catch (TesseractException e) {
            throw new IOException("OCR failed", e);
        }
    }

    public String summarizePdf(byte[] input) throws IOException {
        try (PDDocument doc = Loader.loadPDF(input)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);
            return "Summary of " + doc.getNumberOfPages() + " pages:\n" + 
                   (text.length() > 500 ? text.substring(0, 500) + "..." : text);
        }
    }

    public byte[] compressPdf(byte[] input) throws IOException {
        try (PDDocument doc = Loader.loadPDF(input)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    public byte[] mergePdfs(List<byte[]> inputs) throws IOException {
        PDFMergerUtility merger = new PDFMergerUtility();
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            merger.setDestinationStream(out);
            for (byte[] input : inputs) {
                merger.addSource(new RandomAccessReadBuffer(input));
            }
            merger.mergeDocuments(null);
            return out.toByteArray();
        }
    }

    public List<byte[]> splitPdf(byte[] input) throws IOException {
        try (PDDocument doc = Loader.loadPDF(input)) {
            Splitter splitter = new Splitter();
            List<PDDocument> pages = splitter.split(doc);
            try {
                return pages.stream().map(p -> {
                    try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                        p.save(out);
                        return out.toByteArray();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    } finally {
                        try { p.close(); } catch (IOException ignored) {}
                    }
                }).toList();
            } finally {
                for (PDDocument p : pages) {
                    try { p.close(); } catch (IOException ignored) {}
                }
            }
        }
    }

    public byte[] rotatePdf(byte[] input, int degrees) throws IOException {
        try (PDDocument doc = Loader.loadPDF(input)) {
            for (PDPage page : doc.getPages()) {
                page.setRotation(degrees);
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    public byte[] cropPdf(byte[] input, float x, float y, float width, float height) throws IOException {
        try (PDDocument doc = Loader.loadPDF(input)) {
            for (PDPage page : doc.getPages()) {
                PDRectangle rect = new PDRectangle(x, y, width, height);
                page.setCropBox(rect);
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    // Placeholder for more complex operations
    public byte[] pdfToWord(byte[] input) throws IOException {
        // Real PDF to Word is complex. This is a very basic placeholder using POI.
        try (XWPFDocument doc = new XWPFDocument()) {
            doc.createParagraph().createRun().setText("PDF Content Placeholder");
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.write(out);
            return out.toByteArray();
        }
    }
}
