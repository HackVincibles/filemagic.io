/*
 * Purpose: Type-safe binding for filemagic.* settings (JWT, CORS, storage, rate limits).
 */
package io.filemagic.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "filemagic")
public record FilemagicProperties(
        Security security,
        Cors cors,
        Storage storage,
        RateLimit rateLimit,
        Stripe stripe
) {
    public record Security(
            String jwtSecret,
            String jwtIssuer,
            int accessTokenMinutes,
            int refreshTokenDays,
            String guestCookieName,
            String guestCookieSigningKey
    ) {
    }

    public record Cors(
            String[] allowedOrigins
    ) {
    }

    public record Storage(
            String localPath,
            String tempPath
    ) {
    }

    public record RateLimit(
            int apiPerMinuteIp,
            int apiPerMinuteUser
    ) {
    }

    public record Stripe(
            String secretKey,
            String publishableKey,
            String webhookSecret,
            String successUrl,
            String cancelUrl
    ) {
    }
}
