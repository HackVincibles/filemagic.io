/*
 * Purpose: Lightweight content sniffing — UTF-8 text vs binary heuristics for algorithm selection.
 */
package io.filemagic.engine.core;

import java.nio.charset.CharsetDecoder;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;

public final class FileTypeDetector {

    public enum Kind {
        TEXT_UTF8,
        BINARY
    }

    private FileTypeDetector() {
    }

    public static Kind detect(byte[] data) {
        if (data == null || data.length == 0) {
            return Kind.TEXT_UTF8;
        }
        if (isLikelyUtf8Text(data)) {
            return Kind.TEXT_UTF8;
        }
        return Kind.BINARY;
    }

    public static boolean isLikelyUtf8Text(byte[] data) {
        CharsetDecoder dec = StandardCharsets.UTF_8.newDecoder()
                .onMalformedInput(CodingErrorAction.REPORT)
                .onUnmappableCharacter(CodingErrorAction.REPORT);
        try {
            dec.decode(java.nio.ByteBuffer.wrap(data));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
