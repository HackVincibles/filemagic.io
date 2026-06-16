package io.filemagic.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "stored_files")
public class StoredFile {

    @Id
    private String id;
    private String userId;
    private String originalName;
    private String contentType;
    private Long byteSize;
    private String storagePath;
    private String checksumSha256;
    private String operationType;
    private Instant createdAt;
    private Instant expiresAt;

    public StoredFile() {
    }

    public StoredFile(String userId, String originalName, String contentType, Long byteSize, String storagePath, String checksumSha256, String operationType, Instant expiresAt) {
        this.userId = userId;
        this.originalName = originalName;
        this.contentType = contentType;
        this.byteSize = byteSize;
        this.storagePath = storagePath;
        this.checksumSha256 = checksumSha256;
        this.operationType = operationType;
        this.createdAt = Instant.now();
        this.expiresAt = expiresAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getByteSize() {
        return byteSize;
    }

    public void setByteSize(Long byteSize) {
        this.byteSize = byteSize;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public void setStoragePath(String storagePath) {
        this.storagePath = storagePath;
    }

    public String getChecksumSha256() {
        return checksumSha256;
    }

    public void setChecksumSha256(String checksumSha256) {
        this.checksumSha256 = checksumSha256;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
