package io.filemagic.repository;

import io.filemagic.document.UsageDaily;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MongoUsageDailyRepository extends MongoRepository<UsageDaily, String> {
    Optional<UsageDaily> findByUsageDateAndSubjectKey(LocalDate usageDate, String subjectKey);
}
