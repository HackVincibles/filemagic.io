/**
 * Purpose: Multipart upload (XHR) + public pricing API helper with normalized JSON.
 */
import { getStoredToken } from './authService';

function getAuthHeader() {
  const t = getStoredToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/**
 * Normalize plan object from API (camelCase or snake_case).
 */
export function normalizePlan(p) {
  if (!p || typeof p !== 'object') return null;
  return {
    code: p.code,
    displayName: p.displayName ?? p.display_name ?? '',
    maxFileBytes: Number(p.maxFileBytes ?? p.max_file_bytes ?? 0),
    maxBatchFiles: Number(p.maxBatchFiles ?? p.max_batch_files ?? 0),
    opsPerDay: Number(p.opsPerDay ?? p.ops_per_day ?? 0),
    historyDays: Number(p.historyDays ?? p.history_days ?? 0),
    adsEnabled: Boolean(p.adsEnabled ?? p.ads_enabled),
    priceUsd: Number(p.priceUsd ?? p.price_usd ?? 0),
  };
}

/**
 * Fetch subscription plans — uses same-origin /api so Vite dev proxy works.
 */
export async function fetchPlans() {
  const base = import.meta.env.VITE_API_URL || '';
  const url = base ? `${base.replace(/\/$/, '')}/api/plans` : '/api/plans';
  const r = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!r.ok) {
    const text = await r.text();
    let msg = `HTTP ${r.status}`;
    try {
      const j = JSON.parse(text);
      msg = j.error || j.message || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  let data;
  try {
    data = await r.json();
  } catch {
    throw new Error('Plans response was not JSON');
  }
  if (!Array.isArray(data)) {
    throw new Error('Invalid plans response');
  }
  return data.map(normalizePlan).filter(Boolean);
}

/**
 * @param {File} file
 * @param {object} opts
 * @param {string} opts.operation
 * @param {string} [opts.conversionMode]
 * @param {string} [opts.compressionAlgorithm]
 * @param {(pct: number) => void} [onUploadProgress]
 * @param {(pct: number) => void} [onDownloadProgress]
 */
export function processFile(file, opts, onUploadProgress, onDownloadProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('operation', opts.operation);
    if (opts.conversionMode) form.append('conversionMode', opts.conversionMode);
    if (opts.compressionAlgorithm) form.append('compressionAlgorithm', opts.compressionAlgorithm);

    const xhr = new XMLHttpRequest();
    const base = import.meta.env.VITE_API_URL || '';
    const url = base ? `${base.replace(/\/$/, '')}/api/files/process` : '/api/files/process';
    xhr.open('POST', url);
    xhr.withCredentials = true;
    xhr.responseType = 'blob';

    const auth = getAuthHeader();
    if (auth.Authorization) xhr.setRequestHeader('Authorization', auth.Authorization);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onUploadProgress) {
        onUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onprogress = (e) => {
      if (e.lengthComputable && onDownloadProgress) {
        onDownloadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const cd = xhr.getResponseHeader('Content-Disposition');
        let name = 'download.bin';
        if (cd) {
          const m = /filename="?([^";]+)"?/i.exec(cd);
          if (m) name = m[1];
        }
        resolve({ blob: xhr.response, filename: name });
        return;
      }
      let msg = `HTTP ${xhr.status}`;
      try {
        if (xhr.response instanceof Blob) {
          const t = await xhr.response.text();
          const j = JSON.parse(t);
          msg = j.error || msg;
        }
      } catch {
        /* ignore */
      }
      reject(new Error(msg));
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(form);
  });
}
