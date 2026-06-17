/**
 * Purpose: AuthUI — split-screen sign in / sign up with WebGL-themed image panel + typewriter.
 * Wires directly into authService / AuthContext so no logic changes are needed in Login/Register.
 */
import { useState, useEffect, useId } from 'react';
import { Eye, EyeOff, Wand2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* ── Typewriter ─────────────────────────────────────────────────────────── */
function Typewriter({ text, speed = 80, cursor = '|', loop = false, deleteSpeed = 40, delay = 1800 }) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [arrIdx, setArrIdx] = useState(0);
  const arr = Array.isArray(text) ? text : [text];
  const current = arr[arrIdx] || '';

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => {
      if (!deleting) {
        if (idx < current.length) {
          setDisplay((p) => p + current[idx]);
          setIdx((p) => p + 1);
        } else if (loop) {
          setTimeout(() => setDeleting(true), delay);
        }
      } else {
        if (display.length > 0) {
          setDisplay((p) => p.slice(0, -1));
        } else {
          setDeleting(false);
          setIdx(0);
          setArrIdx((p) => (p + 1) % arr.length);
        }
      }
    }, deleting ? deleteSpeed : speed);
    return () => clearTimeout(t);
  }, [idx, deleting, current, loop, speed, deleteSpeed, delay, display]);

  return (
    <span>
      {display}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}

/* ── Input ──────────────────────────────────────────────────────────────── */
function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
        'px-4 py-2 text-sm text-slate-900 dark:text-white shadow-sm',
        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
        'focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400',
        'transition-all duration-200 disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

/* ── PasswordInput ──────────────────────────────────────────────────────── */
function PasswordInput({ label, className, id: propId, ...props }) {
  const genId = useId();
  const id = propId || genId;
  const [show, setShow] = useState(false);
  return (
    <div className="grid gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative">
        <Input id={id} type={show ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

/* ── Sign-In Form ────────────────────────────────────────────────────────── */
function SignInForm({ onSubmit, loading, error, defaultEmail = '', defaultPassword = '' }) {
  return (
    <form onSubmit={onSubmit} autoComplete="on" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="h-6 w-6 text-cyan-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">filemagic.io</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to unlock higher daily limits</p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <Input id="login-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" defaultValue={defaultEmail} />
        </div>
        <PasswordInput name="password" label="Password" id="login-password" required autoComplete="current-password" placeholder="Your password" defaultValue={defaultPassword} />

        {error && (
          <p className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </div>
    </form>
  );
}

/* ── Sign-Up Form ────────────────────────────────────────────────────────── */
function SignUpForm({ onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} autoComplete="on" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="h-6 w-6 text-cyan-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">filemagic.io</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Free tier — no credit card required</p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="reg-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Display Name</label>
          <Input id="reg-name" name="displayName" type="text" placeholder="Your name" autoComplete="name" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="reg-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <Input id="reg-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <PasswordInput name="password" label="Password" id="reg-password" required autoComplete="new-password" placeholder="Min. 8 characters" />

        {error && (
          <p className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}

/* ── Side Panel ─────────────────────────────────────────────────────────── */
const SIGN_IN_IMAGE = 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=900&q=80&auto=format&fit=crop';
const SIGN_UP_IMAGE = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&q=80&auto=format&fit=crop';

function SidePanel({ isSignIn }) {
  const img = isSignIn ? SIGN_IN_IMAGE : SIGN_UP_IMAGE;
  const quotes = isSignIn
    ? ['Transform your files instantly.', 'Compress. Convert. Conquer.', 'Welcome back to the magic.']
    : ['Your journey starts here.', 'Unlock powerful file tools.', 'Join the filemagic community.'];

  return (
    <div className="hidden md:flex relative overflow-hidden flex-col">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${img})` }}
      />
      {/* Gradient overlay matching brand */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-cyan-900/50 to-blue-900/70" />

      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-10">
        {/* Logo top */}
        <div className="flex items-center gap-2">
          <Wand2 className="h-7 w-7 text-cyan-400" />
          <span className="text-lg font-bold text-white">filemagic.io</span>
        </div>

        {/* Feature pills */}
        <div className="flex flex-col gap-3">
          {['PDF to Word, PNG, Excel', 'Lossless Compression', 'Batch File Processing', 'Privacy-first Processing'].map((f) => (
            <div key={f} className="flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 w-fit">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
              <span className="text-sm text-white/90">{f}</span>
            </div>
          ))}
        </div>

        {/* Typewriter quote */}
        <blockquote className="space-y-2">
          <p className="text-lg font-medium text-white leading-relaxed">
            "<Typewriter key={isSignIn ? 'signin' : 'signup'} text={quotes} speed={70} loop deleteSpeed={30} delay={2000} />"
          </p>
          <cite className="block text-sm text-white/50 not-italic">— filemagic.io</cite>
        </blockquote>
      </div>
    </div>
  );
}

/* ── Main AuthUI Export ─────────────────────────────────────────────────── */
export function AuthUI({ defaultTab = 'signin', onSignIn, onSignUp, signInLoading, signUpLoading, signInError, signUpError, prefillEmail = '', prefillPassword = '' }) {
  const [tab, setTab] = useState(defaultTab);
  const isSignIn = tab === 'signin';

  return (
    <div className="w-full min-h-screen grid md:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear { display: none; }
      `}</style>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 md:p-12 min-h-screen md:min-h-0">
        <div className="w-full max-w-sm">
          {isSignIn
            ? <SignInForm onSubmit={onSignIn} loading={signInLoading} error={signInError} defaultEmail={prefillEmail} defaultPassword={prefillPassword} />
            : <SignUpForm onSubmit={onSignUp} loading={signUpLoading} error={signUpError} />
          }

          {/* Toggle link */}
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {isSignIn ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setTab(isSignIn ? 'signup' : 'signin')}
              className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline transition-colors"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Divider */}
          <div className="relative my-6 text-center text-sm">
            <div className="absolute inset-0 top-1/2 border-t border-slate-200 dark:border-slate-800" />
            <span className="relative bg-slate-50 dark:bg-slate-950 px-3 text-slate-400 dark:text-slate-500">
              Or continue with
            </span>
          </div>

          {/* Google button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4" />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Image / info panel */}
      <SidePanel isSignIn={isSignIn} />
    </div>
  );
}
