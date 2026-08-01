/** TMDB API detail shapes (movie / TV / person) — no raw JSON storage. */

export type TmdbGenreRef = { id: number; name: string };

export type TmdbProductionCompanyRef = {
  id: number;
  name?: string;
  logo_path?: string | null;
  origin_country?: string;
};

export type TmdbProductionCountryRef = {
  iso_3166_1: string;
  name: string;
};

export type TmdbSpokenLanguageRef = {
  iso_639_1: string;
  english_name?: string;
  name?: string;
};

export type TmdbBelongsToCollection = {
  id: number;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
};

export type TmdbMovieDetail = {
  adult?: boolean;
  backdrop_path?: string | null;
  belongs_to_collection?: TmdbBelongsToCollection | null;
  budget?: number;
  genres?: TmdbGenreRef[];
  homepage?: string | null;
  id: number;
  imdb_id?: string | null;
  origin_country?: string[];
  original_language?: string;
  original_title?: string;
  overview?: string | null;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: TmdbProductionCompanyRef[];
  production_countries?: TmdbProductionCountryRef[];
  release_date?: string;
  revenue?: number;
  runtime?: number | null;
  spoken_languages?: TmdbSpokenLanguageRef[];
  status?: string;
  tagline?: string | null;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
};

export type TmdbTvNetworkRef = {
  id: number;
  name?: string;
  logo_path?: string | null;
  origin_country?: string;
};

export type TmdbTvCreatedByRef = {
  id: number;
  credit_id?: string;
  name?: string;
  gender?: number;
  profile_path?: string | null;
};

export type TmdbTvEpisodeRef = {
  id: number;
  name?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  air_date?: string;
  episode_number?: number;
  production_code?: string;
  runtime?: number | null;
  season_number?: number;
  show_id?: number;
  still_path?: string | null;
};

export type TmdbTvSeasonRef = {
  air_date?: string;
  episode_count?: number;
  id: number;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  season_number: number;
  vote_average?: number;
};

export type TmdbTvSeriesDetail = {
  adult?: boolean;
  backdrop_path?: string | null;
  created_by?: TmdbTvCreatedByRef[];
  episode_run_time?: number[];
  first_air_date?: string;
  genres?: TmdbGenreRef[];
  homepage?: string | null;
  id: number;
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: TmdbTvEpisodeRef | null;
  name?: string;
  next_episode_to_air?: TmdbTvEpisodeRef | null;
  networks?: TmdbTvNetworkRef[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  origin_country?: string[];
  original_language?: string;
  original_name?: string;
  overview?: string | null;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: TmdbProductionCompanyRef[];
  production_countries?: TmdbProductionCountryRef[];
  seasons?: TmdbTvSeasonRef[];
  spoken_languages?: TmdbSpokenLanguageRef[];
  status?: string;
  tagline?: string | null;
  type?: string;
  vote_average?: number;
  vote_count?: number;
};

export type TmdbPersonDetail = {
  adult?: boolean;
  also_known_as?: string[];
  biography?: string | null;
  birthday?: string | null;
  deathday?: string | null;
  gender?: number;
  homepage?: string | null;
  id: number;
  imdb_id?: string | null;
  known_for_department?: string;
  name?: string;
  place_of_birth?: string | null;
  popularity?: number;
  profile_path?: string | null;
};
