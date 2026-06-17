/**
 * Purpose: Register page — delegates UI to AuthUI, keeps authService wiring.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, minLength } from '../utils/validators';
import { AuthUI } from '../components/ui/auth-ui.jsx';

export default function Register() {
  const nav = useNavigate();
  const { refreshProfile } = useAuth();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr('');
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const displayName = data.get('displayName') || email.split('@')[0];

    if (!isValidEmail(email)) { setErr('Enter a valid email.'); return; }
    if (!minLength(password, 8)) { setErr('Password must be at least 8 characters.'); return; }

    setLoading(true);
    try {
      await apiRegister(email, password, displayName);
      await refreshProfile();
      nav('/dashboard');
    } catch (ex) {
      setErr(ex.response?.data?.error || ex.response?.data?.message || ex.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthUI
      defaultTab="signup"
      onSignUp={handleSignUp}
      signUpLoading={loading}
      signUpError={err}
    />
  );
}
