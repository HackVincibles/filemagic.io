/**
 * Purpose: Login page — delegates UI to AuthUI, keeps authService wiring.
 *          Reads ?email, ?password, ?displayName query params to pre-fill the form.
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, minLength } from '../utils/validators';
import { AuthUI } from '../components/ui/auth-ui.jsx';

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const { refreshProfile } = useAuth();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const redirect      = params.get('redirect')     || '/dashboard';
  const prefillEmail  = params.get('email')         || '';
  const prefillPass   = params.get('password')      || '';

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr('');
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (!isValidEmail(email)) { setErr('Enter a valid email.'); return; }
    if (!minLength(password, 1)) { setErr('Password required.'); return; }

    setLoading(true);
    try {
      await apiLogin(email, password);
      await refreshProfile();
      nav(redirect);
    } catch (ex) {
      setErr(ex.response?.data?.error || ex.response?.data?.message || ex.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthUI
      defaultTab="signin"
      onSignIn={handleSignIn}
      signInLoading={loading}
      signInError={err}
      prefillEmail={prefillEmail}
      prefillPassword={prefillPass}
    />
  );
}
