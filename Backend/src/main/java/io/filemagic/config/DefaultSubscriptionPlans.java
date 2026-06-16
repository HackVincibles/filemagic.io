/*
 * Purpose: Embedded plan rows when MongoDB is unavailable — matches database/seed data.
 */
package io.filemagic.config;

import io.filemagic.document.SubscriptionPlan;

import java.util.List;

public final class DefaultSubscriptionPlans {

    private DefaultSubscriptionPlans() {
    }

    public static List<SubscriptionPlan> all() {
        return List.of(
                createPlan("GUEST", "Guest", 52_428_800L, 1, 10, 0, true, 0.0),
                createPlan("FREE", "Free", 104_857_600L, 1, 25, 0, true, 0.0),
                createPlan("INDIVIDUAL", "Individual", 5_368_709_120L, 25, 3000, 7, false, 9.99),
                createPlan("BUSINESS", "Business", 53_687_091_200L, 500, 50000, 15, false, 49.99)
        );
    }

    private static SubscriptionPlan createPlan(String code, String displayName, Long maxFileBytes, Integer maxBatchFiles, Integer opsPerDay, Integer historyDays, Boolean adsEnabled, Double priceUsd) {
        SubscriptionPlan plan = new SubscriptionPlan(code, displayName, maxFileBytes, maxBatchFiles, opsPerDay, historyDays, adsEnabled, priceUsd);
        plan.setId(code);
        return plan;
    }
}
