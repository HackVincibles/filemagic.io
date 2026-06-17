/**
 * Purpose: Plans table — GET /api/plans with animated glassmorphic design + embedded fallback.
 */
import { useEffect, useState } from 'react';
import { fetchPlans } from '../services/fileService';
import { PLANS_FALLBACK } from '../data/plansFallback';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ModernPricingPage } from '../components/ui/animated-glassy-pricing.jsx';

function formatBytes(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)} MB`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} KB`;
  return `${n} B`;
}

/** Map API plan objects → PricingCard props */
function planToCard(p, index, user, navigate, handlePurchase, loadingPlanId) {
  const isPaid = p.priceUsd > 0;
  const isPopular = index === 2; // 3rd plan = most popular

  const features = [
    `Max file: ${formatBytes(p.maxFileBytes)}`,
    `Batch files: ${p.maxBatchFiles}`,
    `${p.opsPerDay} ops / day`,
    p.historyDays > 0 ? `${p.historyDays}-day history` : 'No file history',
    p.adsEnabled ? 'Ad-supported' : 'Ad-free experience',
  ];

  let buttonText = isPaid
    ? loadingPlanId === p.id
      ? 'Processing...'
      : `Get ${p.displayName}`
    : user
    ? 'Current Plan'
    : 'Get Started Free';

  const onSelect = isPaid
    ? () => handlePurchase(p.id)
    : !user
    ? () => navigate('/register')
    : undefined;

  return {
    planName: p.displayName,
    description: p.code === 'GUEST'
      ? 'Try tools without signing up.'
      : p.code === 'FREE'
      ? 'Personal use, no credit card needed.'
      : p.code === 'INDIVIDUAL'
      ? 'For power users and professionals.'
      : 'Scale across your entire team.',
    price: isPaid ? String(p.priceUsd) : '0',
    features,
    buttonText,
    isPopular,
    buttonVariant: isPopular ? 'primary' : 'secondary',
    onSelect,
  };
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
        if (!cancelled) { setPlans(data); setUsingFallback(false); }
      })
      .catch(() => {
        if (!cancelled) {
          setPlans(PLANS_FALLBACK);
          setUsingFallback(true);
          setErr('Showing default plans — backend API unavailable.');
        }
      });
    return () => { cancelled = true; };
  }, []);

  const handlePurchase = async (planId) => {
    if (!user) { navigate('/login?redirect=/pricing'); return; }
    setLoadingPlanId(planId);
    setErr('');
    try {
      const { data } = await api.post('/api/payments/create-checkout-session', { planId });
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setErr(e.response?.data?.error || e.response?.data?.message || e.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const pricingCards = plans.map((p, i) =>
    planToCard(p, i, user, navigate, handlePurchase, loadingPlanId)
  );

  return (
    <>
      {err && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-md ${
          usingFallback && !err.includes('Failed')
            ? 'bg-amber-100/90 text-amber-800 border border-amber-200'
            : 'bg-red-100/90 text-red-700 border border-red-200'
        }`} role="status">
          {err}
        </div>
      )}
      <ModernPricingPage
        title={
          <>
            Find the{' '}
            <span className="text-cyan-500 dark:text-cyan-400">Perfect Plan</span>
            {' '}for You
          </>
        }
        subtitle="Start free, upgrade when you need more power. All core tools always available."
        plans={pricingCards}
        showAnimatedBackground={true}
      />
    </>
  );
}
