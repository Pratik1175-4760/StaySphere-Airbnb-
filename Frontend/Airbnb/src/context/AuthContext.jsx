import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3000/me', {
        withCredentials: true
      });
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await axios.post(
      'http://localhost:3000/login',
      { username, password },
      { withCredentials: true }
    );
    setUser(response.data.user);
    return response.data;
  };

  const signup = async (username, email, password) => {
    const response = await axios.post(
      'http://localhost:3000/signup',
      { username, email, password },
      { withCredentials: true }
    );
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/logout', {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};