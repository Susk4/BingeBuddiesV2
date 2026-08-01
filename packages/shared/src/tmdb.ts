export type TmdbMovie = {
  id: number;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  [key: string]: unknown;
};

export type TmdbDiscoverResponse = {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
  total_results: number;
};

export type TmdbGenreListResponse = {
  genres: { id: number; name: string }[];
};
