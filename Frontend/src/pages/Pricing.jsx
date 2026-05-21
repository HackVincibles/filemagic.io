/**
 * Purpose: Plans table — GET /api/plans with embedded fallback if API unavailable.
 */
import { useEffect, useState } from 'react';
import { fetchPlans } from '../services/fileService';
import { PLANS_FALLBACK } from '../data/plansFallback';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

function formatBytes(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)} MB`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} KB`;
  return `${n} B`;
}

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [err, setErr] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setErr('');
    fetchPlans()
      .then((data) => {
        if (!cancelled) {
          setPlans(data);
          setUsingFallback(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPlans(PLANS_FALLBACK);
          setUsingFallback(true);
          setErr('Showing default plans — start the API (use --spring.profiles.active=embedded if MySQL is not running).');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePurchase = async (planId) => {
    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    setLoadingPlanId(planId);
    setErr('');

    try {
      const { data } = await api.post('/api/payments/create-checkout-session', { planId });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setErr(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-center font-display text-4xl font-bold text-slate-900">Simple pricing</h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
        Limits are enforced server-side (guest, free, individual, business). Stripe integration hooks in on the API
        layer.
      </p>
      {err && (
        <p
          className={`mt-6 text-center text-sm ${usingFallback && !err.includes('Failed') ? 'text-amber-700' : 'text-red-600'}`}
          role="status"
        >
          {err}
        </p>
      )}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p, index) => (
          <div key={p.code} className={`fm-glass fm-card-3d rounded-2xl p-6 ${index >= 2 ? 'border-2 border-sage-200 bg-gradient-to-b from-sage-50 to-white' : 'bg-white'}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-plum-500">{p.code}</p>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-900">{p.displayName}</h2>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {p.priceUsd > 0 ? `$${p.priceUsd}` : 'Free'}
              {p.priceUsd > 0 && <span className="text-sm font-normal text-slate-500"> /mo</span>}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Max file: {formatBytes(p.maxFileBytes)}</li>
              <li>Batch files: {p.maxBatchFiles}</li>
              <li>Ops / day: {p.opsPerDay}</li>
              <li>History: {p.historyDays > 0 ? `${p.historyDays} days` : '—'}</li>
              <li>Ads: {p.adsEnabled ? 'yes (free tiers)' : 'no'}</li>
            </ul>
            {index >= 2 && (
              <button
                disabled={loadingPlanId === p.id}
                onClick={() => handlePurchase(p.id)}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-sage-500 to-plum-500 py-3 text-sm font-semibold text-white shadow-lift hover:opacity-95 disabled:opacity-50"
              >
                {loadingPlanId === p.id ? 'Processing...' : `Purchase ${p.displayName}`}
              </button>
            )}
            {index === 1 && !user && (
              <button
                onClick={() => navigate('/register')}
                className="mt-6 w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Get Started
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
