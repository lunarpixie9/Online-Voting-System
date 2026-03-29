import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_user')); } catch { return null; }
  });

  const login = (data) => { setUser(data); localStorage.setItem('cv_user', JSON.stringify(data)); };
  const logout = () => { setUser(null); localStorage.removeItem('cv_user'); };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
