/*
 * Purpose: Custom LZ77-style sliding-window compression — magic "FML1", tokens: literal or (distance,length).
 */
package io.filemagic.engine.compression.lz77;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;

public final class Lz77Codec {

    public static final byte[] MAGIC = {'F', 'M', 'L', '1'};
    private static final int WINDOW = 4096;
    private static final int MIN_MATCH = 3;
    private static final int MAX_MATCH = 255;

    private Lz77Codec() {
    }

    public static byte[] compress(byte[] input) {
        if (input == null) {
            throw new IllegalArgumentException("input is null");
        }
        ByteArrayOutputStream tokens = new ByteArrayOutputStream();
        int i = 0;
        int n = input.length;
        while (i < n) {
            int bestLen = 0;
            int bestDist = 0;
            int start = Math.max(0, i - WINDOW);
            for (int j = start; j < i; j++) {
                int len = 0;
                while (i + len < n && len < MAX_MATCH && j + len < i && input[i + len] == input[j + len]) {
                    len++;
                }
                if (len > bestLen) {
                    bestLen = len;
                    bestDist = i - j;
                }
            }
            if (bestLen >= MIN_MATCH) {
                tokens.write(0x01);
                tokens.write(bestDist & 0xFF);
                tokens.write((bestDist >> 8) & 0xFF);
                tokens.write(bestLen);
                i += bestLen;
            } else {
                tokens.write(0x00);
                tokens.write(input[i] & 0xFF);
                i++;
            }
        }
        byte[] payload = tokens.toByteArray();
        ByteBuffer header = ByteBuffer.allocate(MAGIC.length + 8).order(ByteOrder.BIG_ENDIAN);
        header.put(MAGIC);
        header.putInt(n);
        header.putInt(payload.length);
        return concat(header.array(), payload);
    }

    public static byte[] decompress(byte[] data) {
        if (data == null || data.length < MAGIC.length + 8) {
            throw new IllegalArgumentException("invalid FML1 payload");
        }
        if (!Arrays.equals(MAGIC, 0, MAGIC.length, data, 0, MAGIC.length)) {
            throw new IllegalArgumentException("bad magic");
        }
        ByteBuffer buf = ByteBuffer.wrap(data, MAGIC.length, data.length - MAGIC.length).order(ByteOrder.BIG_ENDIAN);
        int origLen = buf.getInt();
        int payloadLen = buf.getInt();
        if (payloadLen < 0 || buf.remaining() < payloadLen) {
            throw new IllegalArgumentException("corrupt payload length");
        }
        byte[] payload = new byte[payloadLen];
        buf.get(payload);
        byte[] buffer = new byte[origLen];
        int pos = 0;
        int p = 0;
        while (pos < origLen && p < payload.length) {
            int tag = payload[p++] & 0xFF;
            if (tag == 0x00) {
                if (p >= payload.length) {
                    throw new IllegalArgumentException("truncated literal");
                }
                buffer[pos++] = payload[p++];
            } else if (tag == 0x01) {
                if (p + 2 >= payload.length) {
                    throw new IllegalArgumentException("truncated match");
                }
                int dist = (payload[p] & 0xFF) | ((payload[p + 1] & 0xFF) << 8);
                p += 2;
                int len = payload[p++] & 0xFF;
                if (len < MIN_MATCH || len > MAX_MATCH) {
                    throw new IllegalArgumentException("bad match length");
                }
                int startPos = pos - dist;
                if (startPos < 0) {
                    throw new IllegalArgumentException("bad distance");
                }
                for (int k = 0; k < len; k++) {
                    buffer[pos] = buffer[pos - dist];
                    pos++;
                }
            } else {
                throw new IllegalArgumentException("unknown token");
            }
        }
        if (pos != origLen) {
            throw new IllegalArgumentException("length mismatch");
        }
        return buffer;
    }

    private static byte[] concat(byte[] a, byte[] b) {
        byte[] r = Arrays.copyOf(a, a.length + b.length);
        System.arraycopy(b, 0, r, a.length, b.length);
        return r;
    }
}
