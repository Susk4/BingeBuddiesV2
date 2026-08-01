import type { MovieVote } from "./movie-vote.js";

export type PublicUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
};

/** Same shape as `PublicUser`; used in the web session context. */
export type SessionUser = PublicUser;

export type AuthTokenPayload = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
};

export type SessionClaims = {
  uid: string;
  email: string;
};

export type UserFilters = {
  genres?: number[];
  providers?: number[];
  release_year?: { from: number; to: number };
};

/** API shape expected by the Next.js app (legacy Firestore field names). */
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  account_created?: number;
  last_login?: number;
  filters?: UserFilters;
  movies?: number[];
};

export type ContactProfile = UserProfile & {
  contact_doc_id?: string;
};

export type GroupMember = {
  id: string;
  accepted: boolean;
};

export type GroupRecord = {
  id: string;
  name: string;
  description: string;
  creator: string;
  users: GroupMember[];
};

export type PaginatedMovies<T = Record<string, unknown>> = {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
};

/** TMDB movie row plus the user's vote from `user_movies`. */
export type UserVotedMovie<T = Record<string, unknown>> = T & {
  vote: MovieVote;
};
