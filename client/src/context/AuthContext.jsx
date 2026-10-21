import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('vendora_token');
      const storedUser = localStorage.getItem('vendora_user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with server in background
          const { user: freshUser } = await authService.getMe();
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem('vendora_user', JSON.stringify(freshUser));
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { user: freshUser } = await authService.getMe();
      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem('vendora_user', JSON.stringify(freshUser));
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAdmin: user?.role === 'admin',
        isVendor: user?.role === 'vendor',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
