/*
 * Purpose: Read entire file into memory with size guard (used by workers / CLI tools).
 */
package io.filemagic.engine.io;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

public final class FileReaderUtil {

    private FileReaderUtil() {
    }

    public static byte[] readAllBytes(Path path, long maxBytes) throws IOException {
        long size = Files.size(path);
        if (size > maxBytes) {
            throw new IOException("file exceeds maxBytes");
        }
        return Files.readAllBytes(path);
    }

    public static byte[] readLimited(InputStream in, long maxBytes) throws IOException {
        return in.readAllBytes();
    }
}
