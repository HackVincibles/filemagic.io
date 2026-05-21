/*
 * Purpose: JDBC access to users.
 */
package io.filemagic.repository;

import io.filemagic.model.UserRecord;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<UserRecord> mapper = (rs, rowNum) -> new UserRecord(
            rs.getLong("id"),
            rs.getString("email"),
            rs.getString("password_hash"),
            rs.getString("display_name"),
            rs.getInt("subscription_plan_id"),
            Optional.ofNullable(rs.getTimestamp("plan_expires_at")).map(Timestamp::toInstant).orElse(null),
            rs.getString("stripe_customer_id"),
            rs.getBoolean("is_active")
    );

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<UserRecord> findByEmail(String email) {
        try {
            UserRecord u = jdbcTemplate.queryForObject(
                    "SELECT id, email, password_hash, display_name, subscription_plan_id, plan_expires_at, stripe_customer_id, is_active FROM users WHERE email = ?",
                    mapper,
                    email
            );
            return Optional.ofNullable(u);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<UserRecord> findById(long id) {
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(
                    "SELECT id, email, password_hash, display_name, subscription_plan_id, plan_expires_at, stripe_customer_id, is_active FROM users WHERE id = ?",
                    mapper,
                    id
            ));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public long insert(String email, String passwordHash, String displayName, int planId) {
        KeyHolder kh = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO users (email, password_hash, display_name, subscription_plan_id) VALUES (?,?,?,?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, email);
            ps.setString(2, passwordHash);
            ps.setString(3, displayName);
            ps.setInt(4, planId);
            return ps;
        }, kh);
        Number key = kh.getKey();
        return key != null ? key.longValue() : -1L;
    }

    public void updatePlan(long userId, int planId, Instant expiresAt) {
        jdbcTemplate.update(
                "UPDATE users SET subscription_plan_id = ?, plan_expires_at = ? WHERE id = ?",
                planId,
                expiresAt != null ? Timestamp.from(expiresAt) : null,
                userId
        );
    }

    public void updateStripeCustomerId(long userId, String customerId) {
        jdbcTemplate.update(
                "UPDATE users SET stripe_customer_id = ? WHERE id = ?",
                customerId,
                userId
        );
    }
}
