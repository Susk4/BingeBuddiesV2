import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import useDataStore from "./useDataStore";
import { fetchTmdbGenres, fetchTmdbProviders } from "../services/tmdbQueries";
import type { AuthContextValue } from "../types/auth";
import type { SessionUser } from "@binge-buddies/shared";

const DEFAULT_PROVIDER_NAMES = [
  "netflix",
  "amazon prime video",
  "disney plus",
  "hbo max",
  "hulu",
  "apple tv",
];

const defaultProviderIds = (
  providers: { provider_id: number; provider_name: string }[],
): number[] => {
  const wanted = new Set(DEFAULT_PROVIDER_NAMES);
  const matched = providers.filter((p) =>
    wanted.has(p.provider_name.toLowerCase()),
  );
  if (matched.length > 0) {
    return matched.map((p) => p.provider_id);
  }
  return providers.slice(0, 6).map((p) => p.provider_id);
};

const authContext = createContext<AuthContextValue | null>(null);

const useAuth = (): AuthContextValue => {
  const ctx = useContext(authContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { addUser } = useDataStore();
  const router = useRouter();

  const loginWithGoogle = () => {
    setError("");
    AuthService.startGoogleSignIn();
  };

  const completeOAuthLogin = async (isNewUser: boolean) => {
    setLoading(true);
    setError("");
    const result = await AuthService.completeOAuthSession();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setUser(result.user);

    if (isNewUser) {
      const [genresData, providersData] = await Promise.all([
        fetchTmdbGenres(),
        fetchTmdbProviders(),
      ]);
      const filterData = {
        genres: genresData.genres.map((genre) => genre.id),
        release_year: { from: 1850, to: new Date().getFullYear() },
        providers: defaultProviderIds(providersData),
      };
      await addUser(result.user, filterData);
      await router.push("/user");
    } else {
      await router.push("/");
    }
    setLoading(false);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    await router.push("/login");
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      error,
      loading,
      loginWithGoogle,
      completeOAuthLogin,
      logout,
      setUser,
    }),
    [user, error, loading],
  );

  return (
    <authContext.Provider value={value}>{children}</authContext.Provider>
  );
};

export default useAuth;
