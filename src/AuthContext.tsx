import { useEffect, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { bookmartApi, useAuthenticateQuery, useLogoutMutation } from "./services/bookmartApi";
import type { AppDispatch } from "./store";
import { AuthContext, normalizeUser, type AuthUser } from "./auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError } = useAuthenticateQuery();
  const [logoutRequest] = useLogoutMutation();

  useEffect(() => {
    if (data) {
      setUser(normalizeUser(data));
    } else if (isError) {
      setUser(null);
    }

    if (!isLoading) {
      setHasCheckedAuth(true);
    }
  }, [data, isError, isLoading]);

  const logout = async () => {
    setUser(null);
    try {
      await logoutRequest().unwrap();
    } catch (error) {
      console.warn("Backend logout failed; clearing local session anyway.", error);
    } finally {
      setUser(null);
      dispatch(bookmartApi.util.resetApiState());
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: (nextUser) => setUser(nextUser ? normalizeUser(nextUser) : null),
        loading: !hasCheckedAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
