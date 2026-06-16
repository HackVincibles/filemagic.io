/*
 * Purpose: Upsert for usage_daily (UTC dates).
 */
package io.filemagic.repository;

import io.filemagic.document.UsageDaily;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class UsageDailyRepository {

    private static final Logger log = LoggerFactory.getLogger(UsageDailyRepository.class);

    private final MongoUsageDailyRepository mongoRepository;

    // In-memory fallback
    private final Map<String, UsageDaily> usageByKey = new ConcurrentHashMap<>();

    public UsageDailyRepository(MongoUsageDailyRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }

    private String getKey(LocalDate day, String subjectKey) {
        return day.toString() + "|" + subjectKey;
    }

    public int getCount(LocalDate day, String subjectKey) {
        try {
            Optional<UsageDaily> usageOpt = mongoRepository.findByUsageDateAndSubjectKey(day, subjectKey);
            if (usageOpt.isPresent()) {
                return usageOpt.get().getOperationCount();
            }
        } catch (Exception e) {
            log.warn("Failed to get usage count from MongoDB: {}", e.getMessage());
        }
        UsageDaily usage = usageByKey.get(getKey(day, subjectKey));
        return usage != null ? usage.getOperationCount() : 0;
    }

    public int incrementAndGet(LocalDate day, String subjectKey) {
        String key = getKey(day, subjectKey);
        
        try {
            Optional<UsageDaily> usageOpt = mongoRepository.findByUsageDateAndSubjectKey(day, subjectKey);
            UsageDaily usage;
            if (usageOpt.isPresent()) {
                usage = usageOpt.get();
                usage.incrementOperationCount();
            } else {
                usage = new UsageDaily(day, subjectKey);
                usage.incrementOperationCount();
            }
            UsageDaily saved = mongoRepository.save(usage);
            return saved.getOperationCount();
        } catch (Exception e) {
            log.warn("Failed to increment usage in MongoDB, using in-memory: {}", e.getMessage());
            UsageDaily usage = usageByKey.get(key);
            if (usage == null) {
                usage = new UsageDaily(day, subjectKey);
            }
            usage.incrementOperationCount();
            usageByKey.put(key, usage);
            return usage.getOperationCount();
        }
    }
}
