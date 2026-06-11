import { createContext, useContext } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = "AuthContext";

export const normalizeUser = (user: AuthUser): AuthUser => ({
  ...user,
  role: user.role?.trim().toLowerCase() === "admin" ? "admin" : "user",
});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
