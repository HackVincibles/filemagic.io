/*
 * Purpose: Daily operation quotas (UTC).
 */
package io.filemagic.service;

import io.filemagic.model.SubscriptionPlan;
import io.filemagic.repository.UsageDailyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneOffset;

@Service
public class UsageLimitService {

    private final UsageDailyRepository usageDailyRepository;

    public UsageLimitService(UsageDailyRepository usageDailyRepository) {
        this.usageDailyRepository = usageDailyRepository;
    }

    public void assertUnderLimit(SubscriptionPlan plan, String subjectKey) {
        LocalDate day = LocalDate.now(ZoneOffset.UTC);
        int used = usageDailyRepository.getCount(day, subjectKey);
        if (used >= plan.opsPerDay()) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Daily operation limit reached");
        }
    }

    public int recordSuccessfulOperation(String subjectKey) {
        LocalDate day = LocalDate.now(ZoneOffset.UTC);
        return usageDailyRepository.incrementAndGet(day, subjectKey);
    }
}
