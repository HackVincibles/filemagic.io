package io.filemagic.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "usage_daily")
@CompoundIndex(name = "uk_usage_subject_day", def = "{'usageDate': 1, 'subjectKey': 1}", unique = true)
public class UsageDaily {

    @Id
    private String id;
    private LocalDate usageDate;
    private String subjectKey;
    private Integer operationCount;

    public UsageDaily() {
    }

    public UsageDaily(LocalDate usageDate, String subjectKey) {
        this.usageDate = usageDate;
        this.subjectKey = subjectKey;
        this.operationCount = 0;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getUsageDate() {
        return usageDate;
    }

    public void setUsageDate(LocalDate usageDate) {
        this.usageDate = usageDate;
    }

    public String getSubjectKey() {
        return subjectKey;
    }

    public void setSubjectKey(String subjectKey) {
        this.subjectKey = subjectKey;
    }

    public Integer getOperationCount() {
        return operationCount;
    }

    public void setOperationCount(Integer operationCount) {
        this.operationCount = operationCount;
    }

    public void incrementOperationCount() {
        this.operationCount++;
    }
}
