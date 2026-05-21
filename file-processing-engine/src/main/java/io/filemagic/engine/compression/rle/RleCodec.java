/*
 * Purpose: Byte-oriented run-length encoding — magic "FMR1"; pairs of (value, count).
 */
package io.filemagic.engine.compression.rle;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;

public final class RleCodec {

    public static final byte[] MAGIC = {'F', 'M', 'R', '1'};

    private RleCodec() {
    }

    public static byte[] compress(byte[] input) throws IOException {
        if (input == null) {
            throw new IllegalArgumentException("input is null");
        }
        if (input.length == 0) {
            ByteBuffer h = ByteBuffer.allocate(MAGIC.length + 8).order(ByteOrder.BIG_ENDIAN);
            h.put(MAGIC);
            h.putInt(0);
            h.putInt(0);
            return h.array();
        }
        ByteArrayOutputStream body = new ByteArrayOutputStream();
        int i = 0;
        int runs = 0;
        while (i < input.length) {
            byte b = input[i];
            int c = 1;
            while (i + c < input.length && input[i + c] == b && c < 0x7FFF_FFFF) {
                c++;
            }
            body.write(b & 0xFF);
            ByteBuffer cb = ByteBuffer.allocate(4).order(ByteOrder.BIG_ENDIAN).putInt(c);
            body.write(cb.array());
            i += c;
            runs++;
        }
        byte[] payload = body.toByteArray();
        ByteBuffer header = ByteBuffer.allocate(MAGIC.length + 8).order(ByteOrder.BIG_ENDIAN);
        header.put(MAGIC);
        header.putInt(input.length);
        header.putInt(runs);
        return concat(header.array(), payload);
    }

    public static byte[] decompress(byte[] data) throws IOException {
        if (data == null || data.length < MAGIC.length + 8) {
            throw new IllegalArgumentException("invalid FMR1 payload");
        }
        if (!Arrays.equals(MAGIC, 0, MAGIC.length, data, 0, MAGIC.length)) {
            throw new IllegalArgumentException("bad magic");
        }
        ByteBuffer buf = ByteBuffer.wrap(data, MAGIC.length, data.length - MAGIC.length).order(ByteOrder.BIG_ENDIAN);
        int origLen = buf.getInt();
        int numRuns = buf.getInt();
        ByteArrayOutputStream out = new ByteArrayOutputStream(origLen);
        for (int r = 0; r < numRuns; r++) {
            if (buf.remaining() < 5) {
                throw new IllegalArgumentException("truncated run");
            }
            int value = buf.get() & 0xFF;
            int count = buf.getInt();
            if (count < 0) {
                throw new IllegalArgumentException("bad count");
            }
            for (int k = 0; k < count; k++) {
                out.write(value);
            }
        }
        byte[] result = out.toByteArray();
        if (result.length != origLen) {
            throw new IllegalArgumentException("length mismatch");
        }
        return result;
    }

    private static byte[] concat(byte[] a, byte[] b) {
        byte[] r = Arrays.copyOf(a, a.length + b.length);
        System.arraycopy(b, 0, r, a.length, b.length);
        return r;
    }
}
