package io.filemagic.repository;

import io.filemagic.document.SubscriptionPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MongoSubscriptionPlanRepository extends MongoRepository<SubscriptionPlan, String> {
    Optional<SubscriptionPlan> findByCode(String code);
}
