import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredToken, logout as authLogout, initAuthFromStorage } from '../services/authService';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Assuming we have an endpoint to get the current user profile
      const { data } = await api.get('/api/auth/profile');
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
      authLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuthFromStorage();
    fetchProfile();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
