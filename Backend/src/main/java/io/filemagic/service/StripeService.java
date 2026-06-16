
package io.filemagic.service;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import io.filemagic.config.FilemagicProperties;
import io.filemagic.document.SubscriptionPlan;
import io.filemagic.document.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {

    private final FilemagicProperties properties;

    public StripeService(FilemagicProperties properties) {
        this.properties = properties;
        Stripe.apiKey = properties.stripe().secretKey();
    }

    public Session createCheckoutSession(User user, SubscriptionPlan plan) throws Exception {
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(properties.stripe().successUrl() + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(properties.stripe().cancelUrl())
                .setCustomerEmail(user.getEmail())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(calculateAmount(plan))
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(plan.getDisplayName() + " Plan")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("userId", user.getId())
                .putMetadata("planId", plan.getCode())
                .build();

        return Session.create(params);
    }

    private long calculateAmount(SubscriptionPlan plan) {
        // Example logic: Individual = $9.99, Business = $49.99
        return switch (plan.getCode()) {
            case "INDIVIDUAL" -> 999L;
            case "BUSINESS" -> 4999L;
            default -> 0L;
        };
    }
}
