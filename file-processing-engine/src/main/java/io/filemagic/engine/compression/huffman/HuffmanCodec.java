/*
 * Purpose: Custom lossless compression using Huffman coding — format magic "FMH1".
 */
package io.filemagic.engine.compression.huffman;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;
import java.util.Comparator;
import java.util.PriorityQueue;

public final class HuffmanCodec {

    public static final byte[] MAGIC = {'F', 'M', 'H', '1'};

    private HuffmanCodec() {
    }

    public static byte[] compress(byte[] input) {
        if (input == null) {
            throw new IllegalArgumentException("input is null");
        }
        int[] freq = new int[256];
        for (byte b : input) {
            freq[b & 0xFF]++;
        }
        Node root = buildTree(freq);
        int[][] codes = new int[256][2];
        if (root != null) {
            if (root.isLeaf()) {
                int sym = root.symbol & 0xFF;
                codes[sym][0] = 0;
                codes[sym][1] = 1;
            } else {
                fillCodes(root, 0, 0, codes);
            }
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream(input.length + 1024);
        try {
            out.write(MAGIC);
            ByteBuffer lenBuf = ByteBuffer.allocate(4).order(ByteOrder.BIG_ENDIAN).putInt(input.length);
            out.write(lenBuf.array());
            ByteBuffer freqBuf = ByteBuffer.allocate(256 * 4).order(ByteOrder.BIG_ENDIAN);
            for (int f : freq) {
                freqBuf.putInt(f);
            }
            out.write(freqBuf.array());
            BitWriter bw = new BitWriter(out);
            for (byte b : input) {
                int sym = b & 0xFF;
                int bits = codes[sym][0];
                int len = codes[sym][1];
                bw.write(bits, len);
            }
            bw.flush();
        } catch (IOException e) {
            throw new IllegalStateException("compress failed", e);
        }
        return out.toByteArray();
    }

    public static byte[] decompress(byte[] data) {
        if (data == null || data.length < MAGIC.length + 4 + 256 * 4) {
            throw new IllegalArgumentException("invalid compressed payload");
        }
        for (int i = 0; i < MAGIC.length; i++) {
            if (data[i] != MAGIC[i]) {
                throw new IllegalArgumentException("bad magic");
            }
        }
        ByteBuffer buf = ByteBuffer.wrap(data, MAGIC.length, data.length - MAGIC.length).order(ByteOrder.BIG_ENDIAN);
        int originalLen = buf.getInt();
        int[] freq = new int[256];
        for (int i = 0; i < 256; i++) {
            freq[i] = buf.getInt();
        }
        int sum = 0;
        for (int f : freq) {
            sum += f;
        }
        if (sum != originalLen) {
            throw new IllegalArgumentException("frequency mismatch");
        }
        if (originalLen == 0) {
            return new byte[0];
        }
        int bitOffset = (MAGIC.length + buf.position()) * 8;
        Node root = buildTree(freq);
        if (root == null) {
            throw new IllegalArgumentException("empty tree");
        }
        byte[] output = new byte[originalLen];
        BitReader br = new BitReader(data, bitOffset);
        if (root.isLeaf()) {
            Arrays.fill(output, (byte) root.symbol);
            return output;
        }
        int written = 0;
        while (written < originalLen) {
            Node n = root;
            while (!n.isLeaf()) {
                int bit = br.readBit();
                n = bit == 0 ? n.left : n.right;
            }
            output[written++] = (byte) n.symbol;
        }
        return output;
    }

    private static void fillCodes(Node node, int bits, int depth, int[][] codes) {
        if (node.isLeaf()) {
            int sym = node.symbol & 0xFF;
            codes[sym][0] = bits;
            codes[sym][1] = depth;
            return;
        }
        fillCodes(node.left, (bits << 1), depth + 1, codes);
        fillCodes(node.right, (bits << 1) | 1, depth + 1, codes);
    }

    private static Node buildTree(int[] freq) {
        PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.weight));
        for (int i = 0; i < 256; i++) {
            if (freq[i] > 0) {
                pq.add(new Node((byte) i, freq[i], null, null));
            }
        }
        if (pq.isEmpty()) {
            return null;
        }
        while (pq.size() > 1) {
            Node a = pq.poll();
            Node b = pq.poll();
            pq.add(new Node((byte) 0, a.weight + b.weight, a, b));
        }
        return pq.poll();
    }

    private static final class Node {
        private final byte symbol;
        private final int weight;
        private final Node left;
        private final Node right;

        private Node(byte symbol, int weight, Node left, Node right) {
            this.symbol = symbol;
            this.weight = weight;
            this.left = left;
            this.right = right;
        }

        private boolean isLeaf() {
            return left == null && right == null;
        }
    }

    private static final class BitWriter {
        private final ByteArrayOutputStream out;
        private int current;
        private int bitsInCurrent;

        private BitWriter(ByteArrayOutputStream out) {
            this.out = out;
        }

        private void write(int value, int len) throws IOException {
            for (int i = len - 1; i >= 0; i--) {
                int bit = (value >> i) & 1;
                current = (current << 1) | bit;
                bitsInCurrent++;
                if (bitsInCurrent == 8) {
                    out.write(current);
                    current = 0;
                    bitsInCurrent = 0;
                }
            }
        }

        private void flush() throws IOException {
            if (bitsInCurrent > 0) {
                current <<= (8 - bitsInCurrent);
                out.write(current);
                current = 0;
                bitsInCurrent = 0;
            }
        }
    }

    private static final class BitReader {
        private final byte[] data;
        private int bitIndex;

        private BitReader(byte[] data, int startBitIndex) {
            this.data = data;
            this.bitIndex = startBitIndex;
        }

        private int readBit() {
            int byteIndex = bitIndex / 8;
            int offset = 7 - (bitIndex % 8);
            bitIndex++;
            return (data[byteIndex] >> offset) & 1;
        }
    }
}
