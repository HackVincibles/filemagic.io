package io.filemagic.repository;

import io.filemagic.document.StoredFile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MongoStoredFileRepository extends MongoRepository<StoredFile, String> {
    List<StoredFile> findByExpiresAtBefore(Instant now);
}
