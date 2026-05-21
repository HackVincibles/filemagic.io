package io.filemagic.service;

import io.filemagic.config.FilemagicProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation;

    public FileStorageService(FilemagicProperties properties) throws IOException {
        this.rootLocation = Paths.get(properties.storage().localPath());
        Files.createDirectories(rootLocation);
    }

    public String store(byte[] content, String originalFilename) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(originalFilename);
        Files.write(rootLocation.resolve(filename), content);
        return filename;
    }

    public byte[] load(String filename) throws IOException {
        return Files.readAllBytes(rootLocation.resolve(filename));
    }

    public void delete(String filename) throws IOException {
        Files.deleteIfExists(rootLocation.resolve(filename));
    }
    
    public Path getPath(String filename) {
        return rootLocation.resolve(filename);
    }
}
