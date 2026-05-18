// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On app mount — check if there's already an active session
  useEffect(() => {
    authAPI.getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const data = await authAPI.register(formData);

    // Attendee pending approval — no session created, return pending flag
    if (data.pending) {
      return { pending: true };
    }

    // Exhibitor auto-approved — session created
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);