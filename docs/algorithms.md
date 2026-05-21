# Algorithms (file-processing-engine)

All compression formats are **custom** — no ZIP/Deflate libraries.

## Huffman (`FMH1`)

- Frequency table over 256 byte values → Huffman tree → bit-packed payload.
- Good general-purpose lossless compression for text-like data.

## LZ77 (`FML1`)

- Sliding window (4096 bytes), min match 3, max 255.
- Token stream: literal byte or `(distance, length)` back-reference.
- Decompression copies from the output buffer to support overlapping matches.

## RLE (`FMR1`)

- Run-length encoding: sequences of `(value, count)` with big-endian counts.
- Effective when long uniform runs dominate.

## Text conversion

- UTF-8 ↔ UTF-16BE via Java `Charset` decode/encode (no third-party codecs for the conversion path).
- Line ending and CSV→TSV helpers operate on validated UTF-8 text.

## Auto selection

`AlgorithmSelector` picks Huffman for UTF-8 text, RLE when run-length heuristic is high, else LZ77.
