/*
 * Purpose: JDBC upsert for usage_daily (UTC dates).
 */
package io.filemagic.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public class UsageDailyRepository {

    private final JdbcTemplate jdbcTemplate;

    public UsageDailyRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int getCount(LocalDate day, String subjectKey) {
        Integer c = jdbcTemplate.query(
                "SELECT operation_count FROM usage_daily WHERE usage_date = ? AND subject_key = ?",
                rs -> {
                    if (!rs.next()) {
                        return 0;
                    }
                    return rs.getInt(1);
                },
                day,
                subjectKey
        );
        return c != null ? c : 0;
    }

    public int incrementAndGet(LocalDate day, String subjectKey) {
        jdbcTemplate.update(
                """
                        INSERT INTO usage_daily (usage_date, subject_key, operation_count)
                        VALUES (?, ?, 1)
                        ON DUPLICATE KEY UPDATE operation_count = operation_count + 1
                        """,
                day,
                subjectKey
        );
        return getCount(day, subjectKey);
    }
}
