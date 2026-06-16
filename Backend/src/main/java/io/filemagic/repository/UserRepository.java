/*
 * Purpose: Access to users.
 */
package io.filemagic.repository;

import io.filemagic.document.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class UserRepository {

    private static final Logger log = LoggerFactory.getLogger(UserRepository.class);

    private final MongoUserRepository mongoRepository;

    // In-memory fallback
    private final Map<String, User> usersById = new ConcurrentHashMap<>();
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();

    public UserRepository(MongoUserRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }

    public Optional<User> findByEmail(String email) {
        try {
            Optional<User> dbUser = mongoRepository.findByEmail(email);
            if (dbUser.isPresent()) {
                return dbUser;
            }
        } catch (Exception e) {
            log.warn("Failed to find user by email in MongoDB: {}", e.getMessage());
        }
        return Optional.ofNullable(usersByEmail.get(email));
    }

    public Optional<User> findById(String id) {
        try {
            Optional<User> dbUser = mongoRepository.findById(id);
            if (dbUser.isPresent()) {
                return dbUser;
            }
        } catch (Exception e) {
            log.warn("Failed to find user by id in MongoDB: {}", e.getMessage());
        }
        return Optional.ofNullable(usersById.get(id));
    }

    public User insert(String email, String passwordHash, String displayName, String planCode) {
        User user = new User(email, passwordHash, displayName != null ? displayName : email, planCode);
        user.setId(UUID.randomUUID().toString());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        
        // Try to save to MongoDB first
        try {
            return mongoRepository.save(user);
        } catch (Exception e) {
            log.warn("Failed to save user to MongoDB, using in-memory storage: {}", e.getMessage());
            usersById.put(user.getId(), user);
            usersByEmail.put(user.getEmail(), user);
            return user;
        }
    }

    public void updatePlan(String userId, String planCode, Instant expiresAt) {
        try {
            Optional<User> userOpt = mongoRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setSubscriptionPlanCode(planCode);
                user.setPlanExpiresAt(expiresAt);
                user.setUpdatedAt(Instant.now());
                mongoRepository.save(user);
                return;
            }
        } catch (Exception e) {
            log.warn("Failed to update user plan in MongoDB: {}", e.getMessage());
        }
        
        // Update in-memory
        User user = usersById.get(userId);
        if (user != null) {
            user.setSubscriptionPlanCode(planCode);
            user.setPlanExpiresAt(expiresAt);
            user.setUpdatedAt(Instant.now());
        }
    }

    public void updateStripeCustomerId(String userId, String customerId) {
        try {
            Optional<User> userOpt = mongoRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setStripeCustomerId(customerId);
                user.setUpdatedAt(Instant.now());
                mongoRepository.save(user);
                return;
            }
        } catch (Exception e) {
            log.warn("Failed to update stripe customer id in MongoDB: {}", e.getMessage());
        }
        
        // Update in-memory
        User user = usersById.get(userId);
        if (user != null) {
            user.setStripeCustomerId(customerId);
            user.setUpdatedAt(Instant.now());
        }
    }
}
