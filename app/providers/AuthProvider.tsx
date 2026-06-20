"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean | null;
  createdAt: string;
  userProfile?: {
    nickname: string;
    dailyBudgetTarget: number;
    generalLocation: string | null;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth saat mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(savedToken);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Check auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(savedToken);
      } else {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Check auth error:", error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Register gagal");
      }

      const data = await res.json();
      const newToken = data.token;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login gagal");
      }

      const data = await res.json();
      const newToken = data.token;

      console.log("✅ Login response:", data);
      localStorage.setItem("token", newToken);
      console.log("✅ Token saved to localStorage:", newToken);
      setToken(newToken);
      setUser(data.user);
      console.log("✅ State updated - token and user set");
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  // Debug: log authentication state changes
  useEffect(() => {
    console.log("🔐 Auth state changed:", {
      isAuthenticated,
      user: user?.email,
      token: token ? "exists" : "null",
      loading,
    });
  }, [isAuthenticated, user, token, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
