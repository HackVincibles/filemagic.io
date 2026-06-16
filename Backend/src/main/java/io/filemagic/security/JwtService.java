/*
 * Purpose: Create and verify JWT access tokens (HS256).
 */
package io.filemagic.security;

import io.filemagic.config.FilemagicProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final String issuer;
    private final int accessMinutes;

    public JwtService(FilemagicProperties props) {
        String secret = props.security().jwtSecret();
        if (secret.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.issuer = props.security().jwtIssuer();
        this.accessMinutes = props.security().accessTokenMinutes();
    }

    public String createAccessToken(String userId, String email) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessMinutes * 60L);
        return Jwts.builder()
                .issuer(issuer)
                .subject(userId)
                .claim("email", email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key)
                .compact();
    }

    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
