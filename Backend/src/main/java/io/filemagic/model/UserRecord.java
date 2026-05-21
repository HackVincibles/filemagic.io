/*
 * Purpose: JDBC row mapping for users (named UserRecord to avoid clash with Spring Security User).
 */
package io.filemagic.model;

import java.time.Instant;

public record UserRecord(
        long id,
        String email,
        String passwordHash,
        String displayName,
        int subscriptionPlanId,
        Instant planExpiresAt,
        String stripeCustomerId,
        boolean active
) {
}
