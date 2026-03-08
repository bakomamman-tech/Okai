import { createContext, useContext, useEffect, useState } from "react";
import { api, readStoredSession, SESSION_STORAGE_KEY } from "../api";

const AuthContext = createContext(null);

const persistSession = (session) => {
  if (session) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return;
  }

  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let ignore = false;

    const hydrateSession = async () => {
      const storedSession = readStoredSession();

      if (!storedSession?.token) {
        if (!ignore) {
          setSession(null);
          setIsReady(true);
        }
        return;
      }

      try {
        const profileData = await api.getProfile();

        if (!ignore) {
          const nextSession = { ...storedSession, user: profileData.user };
          persistSession(nextSession);
          setSession(nextSession);
        }
      } catch (_error) {
        if (!ignore) {
          persistSession(null);
          setSession(null);
        }
      } finally {
        if (!ignore) {
          setIsReady(true);
        }
      }
    };

    hydrateSession();

    return () => {
      ignore = true;
    };
  }, []);

  const authenticate = (payload) => {
    const nextSession = { token: payload.token, user: payload.user };
    persistSession(nextSession);
    setSession(nextSession);
  };

  const logout = () => {
    persistSession(null);
    setSession(null);
  };

  const updateUser = (user) => {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const nextSession = { ...currentSession, user };
      persistSession(nextSession);
      return nextSession;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        token: session?.token || "",
        isAuthenticated: Boolean(session?.token),
        isReady,
        authenticate,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
