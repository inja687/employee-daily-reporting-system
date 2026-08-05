import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setAccessToken } from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const refreshRes = await authService.refreshTokenApi();
      const token = refreshRes.data?.accessToken;
      if (token) {
        setAccessToken(token);
        const meRes = await authService.getMeApi();
        setUser(meRes.data?.user || meRes.data);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      // 401 on initial load simply means visitor is unauthenticated
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();

    const handleLogoutEvent = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, [checkAuthStatus]);

  const loginUser = async (credentials) => {
    const res = await authService.loginApi(credentials);
    const { user, accessToken } = res.data;
    setAccessToken(accessToken);
    setUser(user);
    return res;
  };

  const registerSaaSWorkspace = async (workspaceData) => {
    const res = await authService.registerSaaSWorkspaceApi(workspaceData);
    const { user, accessToken } = res.data;
    setAccessToken(accessToken);
    setUser(user);
    return res;
  };

  const loginWithGoogle = async (googleData) => {
    const res = await authService.googleAuthApi(googleData);
    const { user, accessToken } = res.data;
    setAccessToken(accessToken);
    setUser(user);
    return res;
  };

  const logoutUser = async () => {
    try {
      await authService.logoutApi();
    } catch (error) {
      console.error('Logout API call error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    loginUser,
    registerSaaSWorkspace,
    loginWithGoogle,
    logoutUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

