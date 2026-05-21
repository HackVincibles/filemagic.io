/*
 * Purpose: Chooses a compression algorithm for AUTO mode using simple heuristics.
 */
package io.filemagic.engine.core;

import io.filemagic.engine.compression.huffman.HuffmanCodec;

public final class AlgorithmSelector {

    private AlgorithmSelector() {
    }

    /**
     * Huffman works well on typical text; LZ77 on repetitive binary; RLE on long uniform runs.
     */
    public static CompressionAlgorithm selectForCompression(byte[] input) {
        if (input == null || input.length == 0) {
            return CompressionAlgorithm.HUFFMAN;
        }
        // Prevent re-compression if already compressed by our system
        if (isHuffmanPayload(input) || isLz77Payload(input) || isRlePayload(input)) {
            return CompressionAlgorithm.NONE;
        }
        if (FileTypeDetector.detect(input) == FileTypeDetector.Kind.TEXT_UTF8) {
            return CompressionAlgorithm.HUFFMAN;
        }
        double rleScore = estimateRleReduction(input);
        if (rleScore > 0.35) {
            return CompressionAlgorithm.RLE;
        }
        return CompressionAlgorithm.LZ77;
    }

    private static double estimateRleReduction(byte[] input) {
        if (input.length < 16) {
            return 0;
        }
        int runs = 1;
        for (int i = 1; i < Math.min(input.length, 4096); i++) {
            if (input[i] != input[i - 1]) {
                runs++;
            }
        }
        double avgRun = (double) Math.min(input.length, 4096) / runs;
        return avgRun > 8 ? 0.5 : 0.1;
    }

    public static boolean isHuffmanPayload(byte[] data) {
        return data != null && data.length >= HuffmanCodec.MAGIC.length
                && match(data, HuffmanCodec.MAGIC);
    }

    public static boolean isLz77Payload(byte[] data) {
        return data != null && data.length >= 4 && match(data, io.filemagic.engine.compression.lz77.Lz77Codec.MAGIC);
    }

    public static boolean isRlePayload(byte[] data) {
        return data != null && data.length >= 4 && match(data, io.filemagic.engine.compression.rle.RleCodec.MAGIC);
    }

    private static boolean match(byte[] data, byte[] magic) {
        for (int i = 0; i < magic.length; i++) {
            if (data[i] != magic[i]) {
                return false;
            }
        }
        return true;
    }
}
