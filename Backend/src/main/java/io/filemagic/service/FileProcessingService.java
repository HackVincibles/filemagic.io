/*
 * Purpose: Delegates to file-processing-engine (Huffman, LZ77, RLE, text conversion).
 */
package io.filemagic.service;

import io.filemagic.document.SubscriptionPlan;
import io.filemagic.engine.conversion.text.TextTranscoder;
import io.filemagic.engine.core.CompressionAlgorithm;
import io.filemagic.engine.core.CompressionEngine;
import io.filemagic.repository.StoredFileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Service
public class FileProcessingService {

    private final PdfService pdfService;
    private final FileStorageService storageService;
    private final StoredFileRepository storedFileRepository;

    public FileProcessingService(PdfService pdfService, FileStorageService storageService, StoredFileRepository storedFileRepository) {
        this.pdfService = pdfService;
        this.storageService = storageService;
        this.storedFileRepository = storedFileRepository;
    }

    public ProcessedFile process(
            MultipartFile multipart,
            SubscriptionPlan plan,
            String operation,
            String conversionMode,
            String compressionAlgorithm,
            String userId
    ) {
        if (multipart == null || multipart.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "file is required");
        }
        long size = multipart.getSize();
        if (size > plan.getMaxFileBytes()) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "File exceeds plan limit");
        }
        byte[] input;
        try {
            input = multipart.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read upload");
        }
        String originalName = sanitizeFileName(multipart.getOriginalFilename());
        String originalContentType = multipart.getContentType();
        if (originalContentType == null) originalContentType = "application/octet-stream";

        ProcessedFile processed = switch (operation.toUpperCase()) {
            case "COMPRESS" -> compress(originalName, originalContentType, input, compressionAlgorithm);
            case "DECOMPRESS" -> decompress(originalName, input);
            case "CONVERT" -> convert(originalName, input, conversionMode);
            case "PDF_COMPRESS" -> pdfOperation(originalName, input, "COMPRESS");
            case "PDF_MERGE" -> pdfOperation(originalName, input, "MERGE");
            case "PDF_SPLIT" -> pdfOperation(originalName, input, "SPLIT");
            case "PDF_ROTATE" -> pdfOperation(originalName, input, "ROTATE");
            case "PDF_TO_WORD" -> pdfOperation(originalName, input, "TO_WORD");
            case "PDF_OCR" -> pdfOperation(originalName, input, "OCR");
            case "PDF_SUMMARIZE" -> pdfOperation(originalName, input, "SUMMARIZE");
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown operation");
        };

        // Handle persistence
        try {
            String storagePath = storageService.store(processed.bytes(), processed.downloadName());
            java.time.Instant expiresAt = (userId == null)
                ? java.time.Instant.now() // Guest: expire now for instant cleanup
                : java.time.Instant.now().plus(7, java.time.temporal.ChronoUnit.DAYS); // Registered: 7 days

            storedFileRepository.insert(
                userId,
                originalName,
                processed.contentType(),
                processed.bytes().length,
                storagePath,
                "sha256_placeholder",
                operation,
                expiresAt
            );
        } catch (IOException e) {
            // Log error but don't fail the request as the user already got the processed file
        }

        return processed;
    }

    private ProcessedFile pdfOperation(String originalName, byte[] input, String subOp) {
        try {
            byte[] out = switch (subOp) {
                case "COMPRESS" -> pdfService.compressPdf(input);
                case "MERGE" -> pdfService.mergePdfs(List.of(input)); // Simplified
                case "SPLIT" -> pdfService.splitPdf(input).get(0); // Simplified
                case "ROTATE" -> pdfService.rotatePdf(input, 90);
                case "TO_WORD" -> pdfService.pdfToWord(input);
                case "OCR" -> pdfService.performOcr(input);
                case "SUMMARIZE" -> pdfService.summarizePdf(input).getBytes();
                default -> throw new IllegalArgumentException("Unknown PDF sub-op");
            };
            String ext = switch (subOp) {
                case "TO_WORD" -> ".docx";
                case "OCR", "SUMMARIZE" -> ".txt";
                default -> ".pdf";
            };
            String name = baseName(originalName) + "." + subOp.toLowerCase() + ext;
            String contentType = switch (subOp) {
                case "TO_WORD" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                case "OCR", "SUMMARIZE" -> "text/plain";
                default -> "application/pdf";
            };
            return new ProcessedFile(name, contentType, out);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "PDF processing failed", e);
        }
    }

    private ProcessedFile compress(String originalName, String originalContentType, byte[] input, String mode) {
        CompressionAlgorithm algo = parseCompression(mode);
        CompressionAlgorithm effective = CompressionEngine.resolveAlgorithm(input, algo);
        byte[] out = CompressionEngine.compress(input, algo);

        // Return original if compressed size is larger than original
        if (out.length >= input.length) {
            return new ProcessedFile(originalName, originalContentType, input);
        }

        // If we compressed it, append our custom extension to the ORIGINAL filename
        // This ensures the browser still has a hint about the original type but sees our format
        String ext = CompressionEngine.fileExtensionFor(effective);
        String name = baseName(originalName) + "_compressed" + extensionOf(originalName);

        // Use a more specific content type if it's our format,
        // otherwise fallback to original if no compression happened
        String contentType = (effective == CompressionAlgorithm.NONE) ? originalContentType : "application/x-filemagic-compressed";

        return new ProcessedFile(name, contentType, out);
    }

    private String extensionOf(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : "";
    }

    private ProcessedFile decompress(String originalName, byte[] input) {
        try {
            byte[] out = CompressionEngine.decompress(input);
            // If the original name had our suffix (e.g. test_compressed.doc), strip it
            String name = originalName.replace("_compressed", "");
            if (name.endsWith(".fmh")) name = name.substring(0, name.length() - 4);
            else if (name.endsWith(".fml")) name = name.substring(0, name.length() - 4);
            else if (name.endsWith(".fmr")) name = name.substring(0, name.length() - 4);

            return new ProcessedFile(name, "application/octet-stream", out);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not a valid FMH1/FML1/FMR1 payload");
        }
    }

    private ProcessedFile convert(String originalName, byte[] input, String mode) {
        if (mode == null || mode.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "conversionMode is required for CONVERT");
        }
        byte[] out = switch (mode.toUpperCase()) {
            case "UTF8_TO_UTF16BE" -> TextTranscoder.utf8ToUtf16Be(input);
            case "UTF16BE_TO_UTF8" -> TextTranscoder.utf16BeToUtf8(input);
            case "LINE_CRLF" -> TextTranscoder.convertLineEndings(input, "CRLF");
            case "LINE_LF" -> TextTranscoder.convertLineEndings(input, "LF");
            case "CSV_TO_TSV" -> TextTranscoder.csvToTsv(input);
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown conversionMode");
        };
        String name = baseName(originalName) + ".converted.txt";
        return new ProcessedFile(name, "text/plain; charset=utf-8", out);
    }

    private static CompressionAlgorithm parseCompression(String compressionAlgorithm) {
        if (compressionAlgorithm == null || compressionAlgorithm.isBlank()) {
            return CompressionAlgorithm.AUTO;
        }
        try {
            return CompressionAlgorithm.valueOf(compressionAlgorithm.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid compressionAlgorithm (HUFFMAN, LZ77, RLE, AUTO)");
        }
    }

    private static String sanitizeFileName(String name) {
        if (name == null || name.isBlank()) {
            return "upload.bin";
        }
        String base = name.replace('\\', '/');
        int slash = base.lastIndexOf('/');
        if (slash >= 0) {
            base = base.substring(slash + 1);
        }
        if (base.length() > 240) {
            base = base.substring(0, 240);
        }
        return base.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private static String baseName(String name) {
        int dot = name.lastIndexOf('.');
        return dot > 0 ? name.substring(0, dot) : name;
    }

    public record ProcessedFile(String downloadName, String contentType, byte[] bytes) {
    }
}
