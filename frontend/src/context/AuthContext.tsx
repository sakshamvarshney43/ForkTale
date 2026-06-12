import { createContext, useContext, useEffect, useState } from "react";

import type { ReactNode } from "react";
import type { User } from "../types";
import { authService } from "../services/api";

//Types

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

//Context

const AuthContext = createContext<AuthContextType | null>(null);

//Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //on app load-checking if token exist on local Storage

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("forktale_token");
        const storedUser = localStorage.getItem("forktale_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          //Verify token is still valid
          const res = await authService.getMe();
          setUser(res.data.user);
          localStorage.setItem("forktale_user", JSON.stringify(res.data.user));
        }
      } catch {
        localStorage.removeItem("forktale_token");
        localStorage.removeItem("forktale_user");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  //Login

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("forktale_token", newToken);
    localStorage.setItem("forktale_user", JSON.stringify(newUser));
  };

  //Logout

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("forktale_token");
    localStorage.removeItem("forktale_user");
    window.location.href = "/login";
  };

  //Update User
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("forktale_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
