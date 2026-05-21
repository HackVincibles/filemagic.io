package io.filemagic.service;

import io.filemagic.repository.StoredFileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class CleanupService {

    private static final Logger log = LoggerFactory.getLogger(CleanupService.class);

    private final StoredFileRepository storedFileRepository;
    private final FileStorageService storageService;

    public CleanupService(StoredFileRepository storedFileRepository, FileStorageService storageService) {
        this.storedFileRepository = storedFileRepository;
        this.storageService = storageService;
    }

    /**
     * Runs every hour to clean up expired files (Guest instant, Registered 7-day).
     */
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredFiles() {
        log.info("Starting cleanup of expired files...");
        Instant now = Instant.now();
        List<Map<String, Object>> expiredFiles = storedFileRepository.findExpired(now);

        for (Map<String, Object> file : expiredFiles) {
            long id = (long) file.get("id");
            String storagePath = (String) file.get("storage_path");

            try {
                storageService.delete(storagePath);
                storedFileRepository.deleteById(id);
                log.info("Deleted expired file: {} (ID: {})", storagePath, id);
            } catch (IOException e) {
                log.error("Failed to delete file from storage: {} (ID: {})", storagePath, id, e);
            }
        }
        log.info("Cleanup completed. Processed {} files.", expiredFiles.size());
    }
}
