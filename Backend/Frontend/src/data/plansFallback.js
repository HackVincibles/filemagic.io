export const PLANS_FALLBACK = [
  {
    id: 'GUEST',
    code: 'GUEST',
    displayName: 'Guest',
    priceUsd: 0,
    maxFileBytes: 10 * 1024 * 1024, // 10MB
    maxBatchFiles: 1,
    opsPerDay: 5,
    historyDays: 0,
    adsEnabled: true
  },
  {
    id: 'FREE',
    code: 'FREE',
    displayName: 'Free Account',
    priceUsd: 0,
    maxFileBytes: 50 * 1024 * 1024, // 50MB
    maxBatchFiles: 3,
    opsPerDay: 20,
    historyDays: 0,
    adsEnabled: true
  },
  {
    id: 'INDIVIDUAL',
    code: 'INDIVIDUAL',
    displayName: 'Individual Premium',
    priceUsd: 9.99,
    maxFileBytes: 500 * 1024 * 1024, // 500MB
    maxBatchFiles: 10,
    opsPerDay: 100,
    historyDays: 7,
    adsEnabled: false
  },
  {
    id: 'BUSINESS',
    code: 'BUSINESS',
    displayName: 'Business Pro',
    priceUsd: 29.99,
    maxFileBytes: 2 * 1024 * 1024 * 1024, // 2GB
    maxBatchFiles: 50,
    opsPerDay: 1000,
    historyDays: 30,
    adsEnabled: false
  }
];
