import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import useDataStore from "./useDataStore";
import useAuth from "./useAuth";
import { tmdbQueryKeys } from "../services/tmdbQueries";

export type GenreContextValue = {
  genres: number[] | null;
  setGenres: Dispatch<SetStateAction<number[] | null>>;
};

export type ProviderContextValue = {
  providers: number[] | null;
  setProviders: Dispatch<SetStateAction<number[] | null>>;
};

export type ReleaseYearContextValue = {
  release_year: { from: number; to: number } | null;
  setReleaseYear: Dispatch<
    SetStateAction<{ from: number; to: number } | null>
  >;
  minReleaseYear: number;
  maxReleaseYear: number;
};

const GenreContext = createContext<GenreContextValue | null>(null);
const ProviderContext = createContext<ProviderContextValue | null>(null);
const ReleaseYearContext = createContext<ReleaseYearContextValue | null>(null);

export const useGenreContext = (): GenreContextValue => {
  const ctx = useContext(GenreContext);
  if (!ctx) {
    throw new Error("useGenreContext must be used within FilterContextProvider");
  }
  return ctx;
};

export const useProviderContext = (): ProviderContextValue => {
  const ctx = useContext(ProviderContext);
  if (!ctx) {
    throw new Error(
      "useProviderContext must be used within FilterContextProvider",
    );
  }
  return ctx;
};

export const useReleaseYearContext = (): ReleaseYearContextValue => {
  const ctx = useContext(ReleaseYearContext);
  if (!ctx) {
    throw new Error(
      "useReleaseYearContext must be used within FilterContextProvider",
    );
  }
  return ctx;
};

export const FilterContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { getUserFilter, updateUserFilter } = useDataStore();
  const queryClient = useQueryClient();

  const [genres, setGenres] = useState<number[] | null>(null);
  const [providers, setProviders] = useState<number[] | null>(null);
  const [release_year, setReleaseYear] = useState<{
    from: number;
    to: number;
  } | null>(null);

  const minReleaseYear = 1850;
  const maxReleaseYear = new Date().getFullYear();
  const hydratingRef = useRef(true);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    let cancelled = false;
    hydratingRef.current = true;

    getUserFilter(user.uid).then((data) => {
      if (cancelled) {
        return;
      }
      setGenres(data?.genres ?? []);
      setProviders(data?.providers ?? []);
      setReleaseYear(
        data?.release_year ?? { from: minReleaseYear, to: maxReleaseYear },
      );
      hydratingRef.current = false;
    });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, getUserFilter, minReleaseYear, maxReleaseYear]);

  useEffect(() => {
    if (!user?.uid || hydratingRef.current) {
      return;
    }
    if (genres === null || providers === null || !release_year) {
      return;
    }

    const timer = window.setTimeout(() => {
      updateUserFilter(user.uid, {
        genres,
        providers,
        release_year,
      }).then(() => {
        queryClient.removeQueries({
          queryKey: [...tmdbQueryKeys.all, "discover", user.uid],
        });
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [
    genres,
    providers,
    release_year,
    user?.uid,
    updateUserFilter,
    queryClient,
  ]);

  return (
    <ReleaseYearContext.Provider
      value={{ release_year, setReleaseYear, minReleaseYear, maxReleaseYear }}
    >
      <ProviderContext.Provider value={{ providers, setProviders }}>
        <GenreContext.Provider value={{ genres, setGenres }}>
          {children}
        </GenreContext.Provider>
      </ProviderContext.Provider>
    </ReleaseYearContext.Provider>
  );
};
