/*
 * Purpose: Access to subscription_plans — in-memory cache; falls back if DB is empty or unreachable.
 */
package io.filemagic.repository;

import io.filemagic.config.DefaultSubscriptionPlans;
import io.filemagic.document.SubscriptionPlan;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private final MongoSubscriptionPlanRepository mongoRepository;
    private final Map<String, SubscriptionPlan> byCode = new ConcurrentHashMap<>();
    private final Map<String, SubscriptionPlan> byId = new ConcurrentHashMap<>();

    public SubscriptionPlanRepository(MongoSubscriptionPlanRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }

    @PostConstruct
    public void loadPlansOnStartup() {
        refreshCache();
    }

    public void refreshCache() {
        try {
            List<SubscriptionPlan> all = mongoRepository.findAll();
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
        byCode.putAll(all.stream().collect(Collectors.toMap(SubscriptionPlan::getCode, p -> p)));
        byId.putAll(all.stream().collect(Collectors.toMap(SubscriptionPlan::getId, p -> p)));
    }

    public Optional<SubscriptionPlan> findByCode(String code) {
        return Optional.ofNullable(byCode.get(code));
    }

    public Optional<SubscriptionPlan> findById(String id) {
        return Optional.ofNullable(byId.get(id));
    }

    public List<SubscriptionPlan> findAll() {
        if (byId.isEmpty()) {
            applyDefaults();
        }
        return byId.values().stream()
                .sorted(Comparator.comparing(SubscriptionPlan::getCode))
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
