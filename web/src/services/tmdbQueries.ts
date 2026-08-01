import type {
  TmdbDiscoverResponse,
  TmdbGenreListResponse,
  TmdbMovie,
  UserFilters,
} from "@binge-buddies/shared";
import type { QueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/apiClient";

export type TmdbWatchProvider = {
  provider_id: number;
  provider_name: string;
};

export const tmdbQueryKeys = {
  all: ["tmdb"] as const,
  genres: () => [...tmdbQueryKeys.all, "genres"] as const,
  providers: () => [...tmdbQueryKeys.all, "providers"] as const,
  discover: (uid: string, page: number) =>
    [...tmdbQueryKeys.all, "discover", uid, page] as const,
  popular: (page: number) => [...tmdbQueryKeys.all, "popular", page] as const,
  search: (query: string, page: number) =>
    [...tmdbQueryKeys.all, "search", query, page] as const,
  movie: (id: number) => [...tmdbQueryKeys.all, "movie", id] as const,
};

export const fetchTmdbGenres = async (): Promise<TmdbGenreListResponse> => {
  return apiRequest<TmdbGenreListResponse>("/api/tmdb/genres");
};

export const fetchTmdbProviders = async (): Promise<TmdbWatchProvider[]> => {
  return apiRequest<TmdbWatchProvider[]>("/api/tmdb/providers");
};

export const fetchTmdbDiscoverMovies = async (
  page: number,
): Promise<TmdbDiscoverResponse> => {
  return apiRequest<TmdbDiscoverResponse>(
    `/api/tmdb/movies/discover?page=${page}`,
  );
};

export const fetchTmdbPopularMovies = async (
  page: number,
): Promise<TmdbDiscoverResponse> => {
  return apiRequest<TmdbDiscoverResponse>(
    `/api/tmdb/movies/popular?page=${page}`,
  );
};

export const fetchTmdbSearchMovies = async (
  query: string,
  page: number,
): Promise<TmdbDiscoverResponse> => {
  const params = new URLSearchParams({
    query,
    page: String(page),
  });
  return apiRequest<TmdbDiscoverResponse>(
    `/api/tmdb/movies/search?${params.toString()}`,
  );
};

export const fetchTmdbMovie = async (id: number): Promise<TmdbMovie> => {
  return apiRequest<TmdbMovie>(`/api/tmdb/movies/${id}`);
};

export type DiscoverMoviesParams = {
  uid: string;
  page: number;
  filters: UserFilters;
  userMovieIds: number[];
};

/** Discover uses server-side user filters and excludes saved movie ids. */
export const fetchDiscoverForUser = async ({
  page,
}: DiscoverMoviesParams): Promise<TmdbDiscoverResponse> => {
  return fetchTmdbDiscoverMovies(page);
};

/** Warm React Query cache for the next discover page (server applies filters). */
export const prefetchDiscoverMoviesPage = (
  queryClient: QueryClient,
  uid: string,
  page: number,
) => {
  return queryClient.prefetchQuery({
    queryKey: tmdbQueryKeys.discover(uid, page),
    queryFn: () =>
      fetchDiscoverForUser({ uid, page, filters: {}, userMovieIds: [] }),
    staleTime: 60_000,
  });
};
