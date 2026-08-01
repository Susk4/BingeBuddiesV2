import { useEffect } from "react";
import { useInfiniteQuery, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchDiscoverForUser,
  fetchTmdbGenres,
  fetchTmdbPopularMovies,
  fetchTmdbProviders,
  fetchTmdbSearchMovies,
  prefetchDiscoverMoviesPage,
  tmdbQueryKeys,
} from "../services/tmdbQueries";

const prefetchDiscoverPage = (
  queryClient: ReturnType<typeof useQueryClient>,
  uid: string,
  page: number,
) => {
  return prefetchDiscoverMoviesPage(queryClient, uid, page);
};

const prefetchBrowsePage = (
  queryClient: ReturnType<typeof useQueryClient>,
  query: string,
  page: number,
) => {
  const trimmed = query.trim();
  const isSearch = trimmed.length > 0;
  return queryClient.prefetchQuery({
    queryKey: isSearch
      ? tmdbQueryKeys.search(trimmed, page)
      : tmdbQueryKeys.popular(page),
    queryFn: () =>
      isSearch
        ? fetchTmdbSearchMovies(trimmed, page)
        : fetchTmdbPopularMovies(page),
    staleTime: 60_000,
  });
};

export const useTmdbGenresQuery = () => {
  return useQuery({
    queryKey: tmdbQueryKeys.genres(),
    queryFn: fetchTmdbGenres,
    staleTime: Infinity,
  });
};

export const useTmdbProvidersQuery = () => {
  return useQuery({
    queryKey: tmdbQueryKeys.providers(),
    queryFn: fetchTmdbProviders,
    staleTime: Infinity,
  });
};

/** Genres + providers catalog (user filter screen). */
export const useTmdbFilterCatalogQueries = () => {
  return useQueries({
    queries: [
      {
        queryKey: tmdbQueryKeys.genres(),
        queryFn: fetchTmdbGenres,
        staleTime: Infinity,
      },
      {
        queryKey: tmdbQueryKeys.providers(),
        queryFn: fetchTmdbProviders,
        staleTime: Infinity,
      },
    ],
  });
};

export const useDiscoverMoviesQuery = (
  uid: string | undefined,
  page: number,
  enabled = true,
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: uid
      ? tmdbQueryKeys.discover(uid, page)
      : [...tmdbQueryKeys.all, "discover", "anonymous", page],
    enabled: Boolean(uid) && enabled,
    staleTime: enabled ? 0 : 60_000,
    gcTime: 10 * 60_000,
    queryFn: () =>
      fetchDiscoverForUser({
        uid: uid!,
        page,
        filters: {},
        userMovieIds: [],
      }),
  });

  useEffect(() => {
    if (!uid || !query.data) {
      return;
    }
    const { page: currentPage, total_pages } = query.data;
    if (currentPage < total_pages) {
      prefetchDiscoverPage(queryClient, uid, currentPage + 1);
    }
    if (currentPage + 1 < total_pages) {
      prefetchDiscoverPage(queryClient, uid, currentPage + 2);
    }
  }, [query.data, queryClient, uid]);

  return query;
};

export const useMoviesBrowseQuery = (query: string, page: number) => {
  const queryClient = useQueryClient();
  const trimmed = query.trim();
  const isSearch = trimmed.length > 0;

  const result = useQuery({
    queryKey: isSearch
      ? tmdbQueryKeys.search(trimmed, page)
      : tmdbQueryKeys.popular(page),
    queryFn: () =>
      isSearch
        ? fetchTmdbSearchMovies(trimmed, page)
        : fetchTmdbPopularMovies(page),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  useEffect(() => {
    if (!result.data) {
      return;
    }
    const { page: currentPage, total_pages } = result.data;
    if (currentPage < total_pages) {
      prefetchBrowsePage(queryClient, query, currentPage + 1);
    }
  }, [result.data, queryClient, query]);

  return result;
};

export const useMoviesBrowseInfinite = (query: string) => {
  const trimmed = query.trim();
  const isSearch = trimmed.length > 0;

  return useInfiniteQuery({
    queryKey: isSearch
      ? [...tmdbQueryKeys.all, "browse-infinite", "search", trimmed]
      : [...tmdbQueryKeys.all, "browse-infinite", "popular"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      isSearch
        ? fetchTmdbSearchMovies(trimmed, pageParam)
        : fetchTmdbPopularMovies(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
};

/** @deprecated Prefer specific query hooks above. */
const useTmdb = () => {
  const genresQuery = useTmdbGenresQuery();
  const providersQuery = useTmdbProvidersQuery();

  return {
    getGenres: fetchTmdbGenres,
    getProviders: fetchTmdbProviders,
    loading: genresQuery.isFetching || providersQuery.isFetching,
  };
};

export default useTmdb;
