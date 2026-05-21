package io.filemagic.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Repository
public class StoredFileRepository {

    private final JdbcTemplate jdbcTemplate;

    public StoredFileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long insert(Long userId, String originalName, String contentType, long byteSize, String storagePath, String checksum, String operation, Instant expiresAt) {
        KeyHolder kh = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO stored_files (user_id, original_name, content_type, byte_size, storage_path, checksum_sha256, operation_type, expires_at) VALUES (?,?,?,?,?,?,?,?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            if (userId != null) ps.setLong(1, userId); else ps.setNull(1, java.sql.Types.BIGINT);
            ps.setString(2, originalName);
            ps.setString(3, contentType);
            ps.setLong(4, byteSize);
            ps.setString(5, storagePath);
            ps.setString(6, checksum);
            ps.setString(7, operation);
            ps.setTimestamp(8, expiresAt != null ? Timestamp.from(expiresAt) : null);
            return ps;
        }, kh);
        Number key = kh.getKey();
        return key != null ? key.longValue() : -1L;
    }

    public List<Map<String, Object>> findExpired(Instant now) {
        return jdbcTemplate.queryForList(
                "SELECT id, storage_path FROM stored_files WHERE expires_at <= ?",
                Timestamp.from(now)
        );
    }

    public void deleteById(long id) {
        jdbcTemplate.update("DELETE FROM stored_files WHERE id = ?", id);
    }
}
