/** Stored on `user_movies.vote` — add new values here as the product grows. */
export const MOVIE_VOTE_VALUES = ["like", "dislike"] as const;

export type MovieVote = (typeof MOVIE_VOTE_VALUES)[number];

export const MOVIE_VOTES = {
  LIKE: "like",
  DISLIKE: "dislike",
} as const satisfies Record<string, MovieVote>;

export const isMovieVote = (value: string): value is MovieVote => {
  return (MOVIE_VOTE_VALUES as readonly string[]).includes(value);
};
