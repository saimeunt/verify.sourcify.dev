"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
};

type TenantNetwork = {
  tenantId: string;
  tenantName: string;
  rpcUrl: string;
  chainId: number;
  displayName: string;
};

type Session = {
  id: string;
  userId: string;
  token: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: string;
  tenantNetworks: TenantNetwork[];
  createdAt: string;
  updatedAt: string;
};

interface UserSessionContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
}

const UserSessionContext = createContext<UserSessionContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null,
});

export const UserSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_ENV === "production"
            ? "https://evm.walnut.dev/api/auth/session"
            : "http://evm.walnut.local/api/auth/session",
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tenant RPCs");
        }
        const data = await response.json();
        const { user, session } = data as { user: User; session: Session };
        setUser(user);
        setSession(session);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserSession();
  }, []);

  return (
    <UserSessionContext.Provider value={{ user, session, isLoading, error }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (context === undefined) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
};
