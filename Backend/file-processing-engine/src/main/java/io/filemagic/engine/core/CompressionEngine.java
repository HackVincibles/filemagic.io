/*
 * Purpose: Facade — single entry for compress/decompress routing to Huffman, LZ77, or RLE.
 */
package io.filemagic.engine.core;

import io.filemagic.engine.compression.huffman.HuffmanCodec;
import io.filemagic.engine.compression.lz77.Lz77Codec;
import io.filemagic.engine.compression.rle.RleCodec;
import java.io.IOException;

public final class CompressionEngine {

    private CompressionEngine() {
    }

    public static CompressionAlgorithm resolveAlgorithm(byte[] input, CompressionAlgorithm algorithm) {
        return algorithm == CompressionAlgorithm.AUTO
                ? AlgorithmSelector.selectForCompression(input)
                : algorithm;
    }

    public static byte[] compress(byte[] input, CompressionAlgorithm algorithm) {
        CompressionAlgorithm a = resolveAlgorithm(input, algorithm);
        return switch (a) {
            case HUFFMAN -> HuffmanCodec.compress(input);
            case LZ77 -> Lz77Codec.compress(input);
            case RLE -> {
                try {
                    yield RleCodec.compress(input);
                } catch (IOException e) {
                    throw new IllegalStateException("RLE compress failed", e);
                }
            }
            case NONE -> input;
            case AUTO -> throw new IllegalStateException("resolveAlgorithm must run before compress");
        };
    }

    public static byte[] decompress(byte[] payload) {
        if (payload == null || payload.length < 4) {
            throw new IllegalArgumentException("payload too short");
        }
        if (AlgorithmSelector.isHuffmanPayload(payload)) {
            return HuffmanCodec.decompress(payload);
        }
        if (AlgorithmSelector.isLz77Payload(payload)) {
            return Lz77Codec.decompress(payload);
        }
        if (AlgorithmSelector.isRlePayload(payload)) {
            try {
                return RleCodec.decompress(payload);
            } catch (IOException e) {
                throw new IllegalStateException("RLE decompress failed", e);
            }
        }
        throw new IllegalArgumentException("Unknown compression format (expected FMH1, FML1, or FMR1)");
    }

    public static String fileExtensionFor(CompressionAlgorithm algorithm) {
        CompressionAlgorithm a = algorithm == CompressionAlgorithm.AUTO ? CompressionAlgorithm.HUFFMAN : algorithm;
        return switch (a) {
            case HUFFMAN -> ".fmh";
            case LZ77 -> ".fml";
            case RLE -> ".fmr";
            case NONE -> "";
            case AUTO -> ".fmh";
        };
    }
}
