import type {
  TmdbDiscoverResponse,
  TmdbGenreListResponse,
  TmdbMovie,
  TmdbMovieDetail,
  UserFilters,
} from "@binge-buddies/shared";
import { tmdbApiGet } from "./tmdbClient.js";

const DEFAULT_WATCH_REGION = process.env.TMDB_WATCH_REGION ?? "US";

type TmdbDiscoverRaw = {
  results: TmdbMovieDetail[];
  page: number;
  total_pages: number;
  total_results: number;
};

type TmdbProviderRegion = {
  results?: Array<{
    provider_id: number;
    provider_name: string;
    display_priority?: number;
  }>;
};

export type TmdbWatchProvider = {
  provider_id: number;
  provider_name: string;
};

const detailToListMovie = (detail: TmdbMovieDetail): TmdbMovie => {
  return {
    id: detail.id,
    title: detail.title,
    overview: detail.overview ?? undefined,
    poster_path: detail.poster_path,
    release_date: detail.release_date,
    vote_average: detail.vote_average,
    original_title: detail.original_title,
    popularity: detail.popularity,
    adult: detail.adult,
    backdrop_path: detail.backdrop_path,
    video: detail.video,
  };
};

const buildDiscoverQuery = (filters: UserFilters): Record<string, string> => {
  const params: Record<string, string> = {
    include_adult: "false",
    language: "en-US",
    sort_by: "popularity.desc",
  };

  if (filters.genres?.length) {
    // TMDB: comma = AND (all genres), pipe = OR (any genre). Taste filters mean OR.
    params.with_genres = filters.genres.join("|");
  }

  const release = filters.release_year;
  if (release) {
    params["primary_release_date.gte"] = `${release.from}-01-01`;
    params["primary_release_date.lte"] = `${release.to}-12-31`;
  }

  if (filters.providers?.length) {
    params.with_watch_providers = filters.providers.join("|");
    params.watch_region = DEFAULT_WATCH_REGION;
    params.with_watch_monetization_types = "flatrate|free|ads|rent|buy";
  }

  return params;
};

const filterExcluded = (
  movies: TmdbMovie[],
  excludeIds: number[],
): TmdbMovie[] => {
  if (!excludeIds.length) {
    return movies;
  }
  const exclude = new Set(excludeIds);
  return movies.filter((m) => !exclude.has(m.id));
};

export const fetchMovieGenres = async (): Promise<TmdbGenreListResponse> => {
  return tmdbApiGet<TmdbGenreListResponse>("/genre/movie/list");
};

export const fetchMovieWatchProviders = async (): Promise<TmdbWatchProvider[]> => {
  const data = await tmdbApiGet<TmdbProviderRegion>("/watch/providers/movie", {
    watch_region: DEFAULT_WATCH_REGION,
  });
  return (data.results ?? []).map((p) => ({
    provider_id: p.provider_id,
    provider_name: p.provider_name,
  }));
};

export const discoverMovies = async (
  page: number,
  filters: UserFilters,
  excludeIds: number[],
): Promise<TmdbDiscoverResponse> => {
  const maxEmptySkips = 15;
  let currentPage = page;
  let lastRaw: TmdbDiscoverRaw | null = null;

  for (let attempt = 0; attempt < maxEmptySkips; attempt++) {
    const raw = await tmdbApiGet<TmdbDiscoverRaw>("/discover/movie", {
      ...buildDiscoverQuery(filters),
      page: currentPage,
    });
    lastRaw = raw;

    const results = filterExcluded(
      raw.results.map(detailToListMovie),
      excludeIds,
    );

    if (results.length > 0 || currentPage >= raw.total_pages) {
      return {
        results,
        page: currentPage,
        total_pages: raw.total_pages,
        total_results: raw.total_results,
      };
    }

    currentPage += 1;
  }

  return {
    results: [],
    page: currentPage,
    total_pages: lastRaw?.total_pages ?? page,
    total_results: lastRaw?.total_results ?? 0,
  };
};

export const fetchPopularMovies = async (
  page: number,
): Promise<TmdbDiscoverResponse> => {
  const raw = await tmdbApiGet<TmdbDiscoverRaw>("/movie/popular", {
    language: "en-US",
    page,
  });
  return {
    results: raw.results.map(detailToListMovie),
    page: raw.page,
    total_pages: raw.total_pages,
    total_results: raw.total_results,
  };
};

export const searchMovies = async (
  query: string,
  page: number,
): Promise<TmdbDiscoverResponse> => {
  const raw = await tmdbApiGet<TmdbDiscoverRaw>("/search/movie", {
    query,
    include_adult: "false",
    language: "en-US",
    page,
  });
  return {
    results: raw.results.map(detailToListMovie),
    page: raw.page,
    total_pages: raw.total_pages,
    total_results: raw.total_results,
  };
};

export const fetchMovieById = async (id: number): Promise<TmdbMovie> => {
  const detail = await tmdbApiGet<TmdbMovieDetail>(`/movie/${id}`, {
    language: "en-US",
  });
  return detailToListMovie(detail);
};

export const fetchTmdbMoviesByIds = async (ids: number[]): Promise<TmdbMovie[]> => {
  if (!ids.length) {
    return [];
  }

  const movies = await Promise.all(
    ids.map(async (id) => {
      try {
        return await fetchMovieById(id);
      } catch {
        return null;
      }
    }),
  );

  const byId = new Map(
    movies.filter((m): m is TmdbMovie => m !== null).map((m) => [m.id, m]),
  );
  return ids
    .map((id) => byId.get(id))
    .filter((m): m is TmdbMovie => m !== undefined);
};
