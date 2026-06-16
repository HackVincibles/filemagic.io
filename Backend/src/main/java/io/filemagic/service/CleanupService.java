package io.filemagic.service;

import io.filemagic.document.StoredFile;
import io.filemagic.repository.StoredFileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

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
        try {
            Instant now = Instant.now();
            List<StoredFile> expiredFiles = storedFileRepository.findExpired(now);

            for (StoredFile file : expiredFiles) {
                try {
                    storageService.delete(file.getStoragePath());
                    storedFileRepository.deleteById(file.getId());
                    log.info("Deleted expired file: {} (ID: {})", file.getStoragePath(), file.getId());
                } catch (IOException e) {
                    log.error("Failed to delete file from storage: {} (ID: {})", file.getStoragePath(), file.getId(), e);
                }
            }
            log.info("Cleanup completed. Processed {} files.", expiredFiles.size());
        } catch (Exception e) {
            log.error("Failed to run cleanup: {}", e.getMessage());
        }
    }
}
