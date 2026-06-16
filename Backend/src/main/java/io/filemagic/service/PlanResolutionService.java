
/*
 * Purpose: Map JWT user or guest to SubscriptionPlan.
 */
package io.filemagic.service;

import io.filemagic.document.SubscriptionPlan;
import io.filemagic.document.User;
import io.filemagic.repository.SubscriptionPlanRepository;
import io.filemagic.repository.UserRepository;
import io.filemagic.security.JwtAuthenticationFilter.AuthenticatedUser;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class PlanResolutionService {

    private final UserRepository userRepository;
    private final SubscriptionPlanRepository planRepository;

    public PlanResolutionService(UserRepository userRepository, SubscriptionPlanRepository planRepository) {
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }

    public SubscriptionPlan resolve(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof String userId) {
            User user = userRepository.findById(userId).orElseThrow();
            return planRepository.findByCode(user.getSubscriptionPlanCode()).orElseThrow();
        }
        return planRepository.findByCode("GUEST").orElseThrow();
    }

    public String subjectKey(Authentication authentication, String guestFingerprint) {
        if (authentication != null && authentication.getPrincipal() instanceof String userId) {
            return "u:" + userId;
        }
        return guestFingerprint;
    }
}
