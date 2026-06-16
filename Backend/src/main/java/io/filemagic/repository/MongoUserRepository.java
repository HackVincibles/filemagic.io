package io.filemagic.repository;

import io.filemagic.document.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MongoUserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
