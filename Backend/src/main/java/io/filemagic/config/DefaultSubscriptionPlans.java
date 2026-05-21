/*
 * Purpose: Embedded plan rows when MySQL is unavailable — matches database/seed data.
 */
package io.filemagic.config;

import io.filemagic.model.SubscriptionPlan;

import java.util.List;

public final class DefaultSubscriptionPlans {

    private DefaultSubscriptionPlans() {
    }

    public static List<SubscriptionPlan> all() {
        return List.of(
                new SubscriptionPlan(1, "GUEST", "Guest", 52_428_800L, 1, 10, 0, true, 0.0),
                new SubscriptionPlan(2, "FREE", "Free", 104_857_600L, 1, 25, 0, true, 0.0),
                new SubscriptionPlan(3, "INDIVIDUAL", "Individual", 5_368_709_120L, 25, 3000, 7, false, 9.99),
                new SubscriptionPlan(4, "BUSINESS", "Business", 53_687_091_200L, 500, 50000, 15, false, 49.99)
        );
    }
}
