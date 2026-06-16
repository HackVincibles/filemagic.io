package io.filemagic.repository;

import io.filemagic.document.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MongoPaymentRepository extends MongoRepository<Payment, String> {
}
