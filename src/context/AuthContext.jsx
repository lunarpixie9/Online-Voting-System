import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cv_user'));
      // Validate stored data has minimum required fields
      if (stored && stored.role && (stored.voter_id || stored.admin_id)) {
        return stored;
      }
      return null;
    } catch { return null; }
  });

  const login = (data) => {
    // Only store what's needed — never store success:true noise
    const clean = data.role === 'admin'
      ? { role: 'admin', admin_id: data.admin_id, name: data.name, email: data.email }
      : { role: 'voter', voter_id: data.voter_id, name: data.name, email: data.email };

    setUser(clean);
    localStorage.setItem('cv_user', JSON.stringify(clean));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cv_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);