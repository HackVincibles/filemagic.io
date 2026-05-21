/*
 * Purpose: HttpOnly guest cookie + stable subject_key for usage_daily.
 */
package io.filemagic.security;

import io.filemagic.config.FilemagicProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class GuestIdentityService {

    private final String cookieName;
    private final byte[] signingMaterial;

    public GuestIdentityService(FilemagicProperties props) {
        this.cookieName = props.security().guestCookieName();
        this.signingMaterial = props.security().guestCookieSigningKey().getBytes(StandardCharsets.UTF_8);
    }

    public String ensureGuestCookie(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (cookieName.equals(c.getName()) && c.getValue() != null && !c.getValue().isBlank()) {
                    return fingerprint(c.getValue());
                }
            }
        }
        String token = UUID.randomUUID().toString();
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setMaxAge(60 * 60 * 24 * 400);
        response.addCookie(cookie);
        return fingerprint(token);
    }

    public String fingerprint(String guestToken) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(signingMaterial);
            md.update(guestToken.getBytes(StandardCharsets.UTF_8));
            return "g:" + HexFormat.of().formatHex(md.digest());
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
