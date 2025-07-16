import { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle authentication check and user info loading.
 * Redirects to /login if token is missing or expired.
 * Returns user info, loading state, and authChecked flag.
 */
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        navigate('/login');
      } else {
        setAuthChecked(true);
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!authChecked) return;

    apiClient.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [authChecked]);

  return { user, loading, authChecked };
}