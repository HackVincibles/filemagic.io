/*
 * Purpose: Text conversion — UTF-8 ↔ UTF-16BE, line endings, CSV→TSV (no external codecs).
 */
package io.filemagic.engine.conversion.text;

import java.nio.ByteBuffer;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public final class TextTranscoder {

    private TextTranscoder() {
    }

    public static byte[] utf8ToUtf16Be(byte[] utf8) {
        String s = decodeUtf8Strict(utf8);
        char[] chars = s.toCharArray();
        byte[] out = new byte[chars.length * 2];
        int p = 0;
        for (char c : chars) {
            out[p++] = (byte) ((c >> 8) & 0xFF);
            out[p++] = (byte) (c & 0xFF);
        }
        return out;
    }

    public static byte[] utf16BeToUtf8(byte[] utf16Be) {
        if (utf16Be.length % 2 != 0) {
            throw new IllegalArgumentException("UTF-16BE length must be even");
        }
        StringBuilder sb = new StringBuilder(utf16Be.length / 2);
        ByteBuffer bb = ByteBuffer.wrap(utf16Be);
        while (bb.hasRemaining()) {
            char ch = (char) (((bb.get() & 0xFF) << 8) | (bb.get() & 0xFF));
            sb.append(ch);
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public static byte[] convertLineEndings(byte[] utf8, String target) {
        String s = decodeUtf8Strict(utf8);
        String normalized = s.replace("\r\n", "\n").replace('\r', '\n');
        String out;
        if ("CRLF".equalsIgnoreCase(target)) {
            out = normalized.replace("\n", "\r\n");
        } else if ("LF".equalsIgnoreCase(target)) {
            out = normalized;
        } else {
            throw new IllegalArgumentException("target must be CRLF or LF");
        }
        return out.getBytes(StandardCharsets.UTF_8);
    }

    public static byte[] csvToTsv(byte[] utf8) {
        String s = decodeUtf8Strict(utf8);
        List<String> lines = splitLines(s);
        StringBuilder sb = new StringBuilder();
        for (String line : lines) {
            sb.append(line.replace('\t', ' ').replace(',', '\t')).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static String decodeUtf8Strict(byte[] utf8) {
        CharsetDecoder dec = StandardCharsets.UTF_8.newDecoder()
                .onMalformedInput(CodingErrorAction.REPORT)
                .onUnmappableCharacter(CodingErrorAction.REPORT);
        try {
            return dec.decode(ByteBuffer.wrap(utf8)).toString();
        } catch (Exception e) {
            throw new IllegalArgumentException("invalid UTF-8 text", e);
        }
    }

    private static List<String> splitLines(String s) {
        List<String> lines = new ArrayList<>();
        int start = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '\n') {
                lines.add(s.substring(start, i));
                start = i + 1;
            }
        }
        lines.add(s.substring(start));
        return lines;
    }
}
