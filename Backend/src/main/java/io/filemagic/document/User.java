
package io.filemagic.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String email;
    private String passwordHash;
    private String displayName;
    private String subscriptionPlanCode; // Changed from subscriptionPlanId to subscriptionPlanCode
    private Instant planExpiresAt;
    private String stripeCustomerId;
    private Boolean active;
    private Instant createdAt;
    private Instant updatedAt;

    public User() {
    }

    public User(String email, String passwordHash, String displayName, String subscriptionPlanCode) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
        this.subscriptionPlanCode = subscriptionPlanCode;
        this.active = true;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getSubscriptionPlanCode() {
        return subscriptionPlanCode;
    }

    public void setSubscriptionPlanCode(String subscriptionPlanCode) {
        this.subscriptionPlanCode = subscriptionPlanCode;
    }

    public Instant getPlanExpiresAt() {
        return planExpiresAt;
    }

    public void setPlanExpiresAt(Instant planExpiresAt) {
        this.planExpiresAt = planExpiresAt;
    }

    public String getStripeCustomerId() {
        return stripeCustomerId;
    }

    public void setStripeCustomerId(String stripeCustomerId) {
        this.stripeCustomerId = stripeCustomerId;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
