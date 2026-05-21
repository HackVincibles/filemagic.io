/*
 * Purpose: JDBC access to subscription_plans — in-memory cache; falls back if DB is empty or unreachable.
 */
package io.filemagic.repository;

import io.filemagic.config.DefaultSubscriptionPlans;
import io.filemagic.model.SubscriptionPlan;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class SubscriptionPlanRepository {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionPlanRepository.class);

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<SubscriptionPlan> mapper = (rs, rowNum) -> new SubscriptionPlan(
            rs.getInt("id"),
            rs.getString("code"),
            rs.getString("display_name"),
            rs.getLong("max_file_bytes"),
            rs.getInt("max_batch_files"),
            rs.getInt("ops_per_day"),
            rs.getInt("history_days"),
            rs.getBoolean("ads_enabled"),
            rs.getDouble("price_usd")
    );

    private final Map<String, SubscriptionPlan> byCode = new ConcurrentHashMap<>();
    private final Map<Integer, SubscriptionPlan> byId = new ConcurrentHashMap<>();

    public SubscriptionPlanRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void loadPlansOnStartup() {
        refreshCache();
    }

    public void refreshCache() {
        try {
            List<SubscriptionPlan> all = jdbcTemplate.query(
                    "SELECT id, code, display_name, max_file_bytes, max_batch_files, ops_per_day, history_days, ads_enabled, price_usd FROM subscription_plans",
                    mapper
            );
            if (all == null || all.isEmpty()) {
                log.warn("subscription_plans returned empty — using embedded defaults");
                applyDefaults();
                return;
            }
            replaceMaps(all);
        } catch (Exception e) {
            log.warn("Could not load subscription_plans from DB ({}). Using embedded defaults.", e.getMessage());
            applyDefaults();
        }
    }

    private void applyDefaults() {
        replaceMaps(DefaultSubscriptionPlans.all());
    }

    private void replaceMaps(List<SubscriptionPlan> all) {
        byCode.clear();
        byId.clear();
        byCode.putAll(all.stream().collect(Collectors.toMap(SubscriptionPlan::code, p -> p)));
        byId.putAll(all.stream().collect(Collectors.toMap(SubscriptionPlan::id, p -> p)));
    }

    public Optional<SubscriptionPlan> findByCode(String code) {
        return Optional.ofNullable(byCode.get(code));
    }

    public Optional<SubscriptionPlan> findById(int id) {
        return Optional.ofNullable(byId.get(id));
    }

    public List<SubscriptionPlan> findAll() {
        if (byId.isEmpty()) {
            applyDefaults();
        }
        return byId.values().stream()
                .sorted(Comparator.comparingInt(SubscriptionPlan::id))
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
