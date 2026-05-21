/*
 * Purpose: Filename sanitization helpers for upload metadata (path traversal protection).
 */
package io.filemagic.util;

public final class FileValidator {

    private FileValidator() {
    }

    public static String safeName(String name) {
        if (name == null || name.isBlank()) {
            return "file.bin";
        }
        String base = name.replace('\\', '/');
        int slash = base.lastIndexOf('/');
        if (slash >= 0) {
            base = base.substring(slash + 1);
        }
        if (base.length() > 200) {
            base = base.substring(0, 200);
        }
        return base.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
