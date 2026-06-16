package io.filemagic.config;

import io.filemagic.document.SubscriptionPlan;
import io.filemagic.repository.MongoSubscriptionPlanRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final MongoSubscriptionPlanRepository subscriptionPlanRepository;

    public DataInitializer(MongoSubscriptionPlanRepository subscriptionPlanRepository) {
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    @PostConstruct
    public void init() {
        try {
            if (subscriptionPlanRepository.count() == 0) {
                log.info("No subscription plans found in database. Seeding default plans...");
                List<SubscriptionPlan> defaultPlans = DefaultSubscriptionPlans.all();
                subscriptionPlanRepository.saveAll(defaultPlans);
                log.info("Successfully seeded {} subscription plans", defaultPlans.size());
            } else {
                log.info("Subscription plans already exist in database. Skipping seeding.");
            }
        } catch (Exception e) {
            log.error("Failed to initialize subscription plans from MongoDB: {}", e.getMessage());
            log.warn("Using in-memory default plans instead.");
        }
    }
}
