import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../api/auth.api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch current user session on initial app load
  const fetchCurrentUser = async () => {
    try {
      const data = await getCurrentUser(); // Adjust depending on if backend returns data.user directly
      setUser(data.user || data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically check for an active session (cookie) on startup
    fetchCurrentUser();
  }, []);

  // 2. Login accepts user data directly (the cookie is already set by the backend response)
  const login = (userData) => {
    setUser(userData);
  };

  // 3. Logout calls the backend API to clear the HttpOnly cookie, then clears local state
  const logout = async () => {
    try {
      await logoutUser(); // API call to POST /auth/logout
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        refreshUser: fetchCurrentUser, // Optional helper to refresh user profile on demand
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);