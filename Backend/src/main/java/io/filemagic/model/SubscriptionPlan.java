/*
 * Purpose: JDBC row mapping + JSON API for subscription_plans (Jackson → camelCase JSON).
 */
package io.filemagic.model;

public record SubscriptionPlan(
        int id,
        String code,
        String displayName,
        long maxFileBytes,
        int maxBatchFiles,
        int opsPerDay,
        int historyDays,
        boolean adsEnabled,
        double priceUsd
) {
}
