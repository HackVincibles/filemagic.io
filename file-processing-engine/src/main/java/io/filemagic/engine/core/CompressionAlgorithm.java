/*
 * Purpose: Enum of built-in custom compression strategies exposed by the engine.
 */
package io.filemagic.engine.core;

public enum CompressionAlgorithm {
    AUTO,
    HUFFMAN,
    LZ77,
    RLE,
    NONE
}
