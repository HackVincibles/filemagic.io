
/*
 * Purpose: Registration and login with bcrypt + JWT.
 */
package io.filemagic.service;

import io.filemagic.document.SubscriptionPlan;
import io.filemagic.document.User;
import io.filemagic.repository.SubscriptionPlanRepository;
import io.filemagic.repository.UserRepository;
import io.filemagic.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SubscriptionPlanRepository planRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            SubscriptionPlanRepository planRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.planRepository = planRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public TokenPair register(String email, String password, String displayName) {
        validateEmail(email);
        validatePassword(password);
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        SubscriptionPlan freePlan = planRepository.findByCode("FREE").orElseThrow();
        String hash = passwordEncoder.encode(password);
        User user = userRepository.insert(email, hash, displayName != null ? displayName : email, freePlan.getCode());
        String access = jwtService.createAccessToken(user.getId(), email);
        return new TokenPair(access);
    }

    public TokenPair login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!user.getActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account disabled");
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        String access = jwtService.createAccessToken(user.getId(), user.getEmail());
        return new TokenPair(access);
    }

    public User getProfile(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private static void validateEmail(String email) {
        if (email == null || email.length() < 5 || !email.contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email");
        }
    }

    private static void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters");
        }
    }

    public record TokenPair(String accessToken) {
    }
}
