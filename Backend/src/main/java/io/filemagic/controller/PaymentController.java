
package io.filemagic.controller;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import io.filemagic.config.FilemagicProperties;
import io.filemagic.document.SubscriptionPlan;
import io.filemagic.document.User;
import io.filemagic.repository.SubscriptionPlanRepository;
import io.filemagic.repository.UserRepository;
import io.filemagic.service.StripeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final StripeService stripeService;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository planRepository;
    private final FilemagicProperties properties;

    public PaymentController(StripeService stripeService, UserRepository userRepository,
                             SubscriptionPlanRepository planRepository, FilemagicProperties properties) {
        this.stripeService = stripeService;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
        this.properties = properties;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @AuthenticationPrincipal String userId,
            @RequestBody Map<String, String> body) {

        String planCode = body.getOrDefault("planId", null);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        SubscriptionPlan plan = planRepository.findByCode(planCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));

        try {
            Session session = stripeService.createCheckoutSession(user, plan);
            return ResponseEntity.ok(Map.of("url", session.getUrl()));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Stripe session creation failed", e);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload,
                                                @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, properties.stripe().webhookSecret());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook Error");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session != null) {
                handleSuccessfulPayment(session);
            }
        }

        return ResponseEntity.ok("Success");
    }

    private void handleSuccessfulPayment(Session session) {
        String userId = session.getMetadata().get("userId");
        String planCode = session.getMetadata().get("planId");

        // Update user plan to the new plan for 30 days
        Instant expiresAt = Instant.now().plus(30, ChronoUnit.DAYS);
        userRepository.updatePlan(userId, planCode, expiresAt);
        userRepository.updateStripeCustomerId(userId, session.getCustomer());
    }
}
