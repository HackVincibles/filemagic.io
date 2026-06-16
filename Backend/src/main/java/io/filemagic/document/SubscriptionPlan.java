package io.filemagic.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subscription_plans")
public class SubscriptionPlan {

    @Id
    private String id;
    private String code;
    private String displayName;
    private Long maxFileBytes;
    private Integer maxBatchFiles;
    private Integer opsPerDay;
    private Integer historyDays;
    private Boolean adsEnabled;
    private Double priceUsd;

    public SubscriptionPlan() {
    }

    public SubscriptionPlan(String code, String displayName, Long maxFileBytes, Integer maxBatchFiles, Integer opsPerDay, Integer historyDays, Boolean adsEnabled, Double priceUsd) {
        this.code = code;
        this.displayName = displayName;
        this.maxFileBytes = maxFileBytes;
        this.maxBatchFiles = maxBatchFiles;
        this.opsPerDay = opsPerDay;
        this.historyDays = historyDays;
        this.adsEnabled = adsEnabled;
        this.priceUsd = priceUsd;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Long getMaxFileBytes() {
        return maxFileBytes;
    }

    public void setMaxFileBytes(Long maxFileBytes) {
        this.maxFileBytes = maxFileBytes;
    }

    public Integer getMaxBatchFiles() {
        return maxBatchFiles;
    }

    public void setMaxBatchFiles(Integer maxBatchFiles) {
        this.maxBatchFiles = maxBatchFiles;
    }

    public Integer getOpsPerDay() {
        return opsPerDay;
    }

    public void setOpsPerDay(Integer opsPerDay) {
        this.opsPerDay = opsPerDay;
    }

    public Integer getHistoryDays() {
        return historyDays;
    }

    public void setHistoryDays(Integer historyDays) {
        this.historyDays = historyDays;
    }

    public Boolean getAdsEnabled() {
        return adsEnabled;
    }

    public void setAdsEnabled(Boolean adsEnabled) {
        this.adsEnabled = adsEnabled;
    }

    public Double getPriceUsd() {
        return priceUsd;
    }

    public void setPriceUsd(Double priceUsd) {
        this.priceUsd = priceUsd;
    }
}
