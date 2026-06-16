package io.filemagic.repository;

import io.filemagic.document.StoredFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Repository
public class StoredFileRepository {

    private static final Logger log = LoggerFactory.getLogger(StoredFileRepository.class);

    private final MongoStoredFileRepository mongoRepository;

    public StoredFileRepository(MongoStoredFileRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }

    public StoredFile insert(String userId, String originalName, String contentType, long byteSize, String storagePath, String checksum, String operation, Instant expiresAt) {
        try {
            StoredFile file = new StoredFile(userId, originalName, contentType, byteSize, storagePath, checksum, operation, expiresAt);
            return mongoRepository.save(file);
        } catch (Exception e) {
            log.error("Failed to insert stored file: {}", e.getMessage());
            return null;
        }
    }

    public List<StoredFile> findExpired(Instant now) {
        try {
            return mongoRepository.findByExpiresAtBefore(now);
        } catch (Exception e) {
            log.error("Failed to find expired files: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public void deleteById(String id) {
        try {
            mongoRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Failed to delete file by id: {}", e.getMessage());
        }
    }
}
