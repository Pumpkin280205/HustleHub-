import { createContext, useContext, useState } from 'react';
import { STORAGE_KEY } from '../api/client';

const AuthContext = createContext(null);

// Read the stored session, discarding it if the JWT has expired
const loadSession = () => {
  try {
    const auth = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!auth?.token) return null;
    const payload = JSON.parse(atob(auth.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp * 1000 < Date.now()) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return auth;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);

  const login = ({ token, email, role }) => {
    const session = { token, email, role };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
