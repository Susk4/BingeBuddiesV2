import { useVirtualizer } from "@tanstack/react-virtual";
import Image from "next/image";
import type { RefObject } from "react";
import type { MovieVote, TmdbMovie, UserVotedMovie } from "@binge-buddies/shared";
import { MOVIE_VOTES } from "@binge-buddies/shared";
import Pill from "./Pill";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import Link from "next/link";

type MovieListProps = {
  movies: TmdbMovie[] | UserVotedMovie<TmdbMovie>[];
  voteActions?: boolean;
  onChangeVote?: (movie: TmdbMovie, vote: MovieVote) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  virtualized?: boolean;
  scrollElementRef?: RefObject<HTMLElement | null>;
};

const isVotedMovie = (
  movie: TmdbMovie | UserVotedMovie<TmdbMovie>,
): movie is UserVotedMovie<TmdbMovie> => {
  return "vote" in movie && typeof movie.vote === "string";
};

const LIST_ROW_ESTIMATE = 260;

type MovieListRowProps = {
  movie: TmdbMovie | UserVotedMovie<TmdbMovie>;
  voteActions: boolean;
  onChangeVote?: (movie: TmdbMovie, vote: MovieVote) => void;
};

const MovieListRow = ({
  movie,
  voteActions,
  onChangeVote,
}: MovieListRowProps) => {
  const currentVote = isVotedMovie(movie) ? movie.vote : undefined;

  return (
    <article
      className="mb-4 flex flex-col gap-5 rounded-2xl border border-line bg-surface-raised/60 p-4 sm:flex-row sm:items-start sm:p-5"
    >
      <div className="relative mx-auto aspect-[2/3] w-32 shrink-0 sm:mx-0 sm:w-36">
        <Image
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path ?? ""}`}
          fill
          unoptimized
          alt=""
          className="rounded-xl object-cover shadow-poster"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {movie.title}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Pill
            text={
              movie.release_date ? movie.release_date.split("-")[0] : "—"
            }
          />
          <Pill text={`${movie.vote_average ?? "—"} / 10`} />
        </div>
        <p className="line-clamp-4 text-sm leading-relaxed text-ink-muted md:line-clamp-3 md:text-base">
          {movie.overview}
        </p>
        {voteActions && onChangeVote ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={
                currentVote === MOVIE_VOTES.LIKE ? "success" : "secondary"
              }
              size="sm"
              onClick={() => onChangeVote(movie, MOVIE_VOTES.LIKE)}
            >
              Like
            </Button>
            <Button
              variant={
                currentVote === MOVIE_VOTES.DISLIKE ? "danger" : "secondary"
              }
              size="sm"
              onClick={() => onChangeVote(movie, MOVIE_VOTES.DISLIKE)}
            >
              Not interested
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
};

const MovieList = ({
  movies,
  voteActions = false,
  onChangeVote,
  emptyTitle = "Your list is empty",
  emptyDescription = "Like films while swiping or from Browse to build your collection.",
  virtualized = false,
  scrollElementRef,
}: MovieListProps) => {
  const virtualizer = useVirtualizer({
    count: virtualized ? movies.length : 0,
    getScrollElement: () => scrollElementRef?.current ?? null,
    estimateSize: () => LIST_ROW_ESTIMATE,
    overscan: 4,
    measureElement: (element) => element.getBoundingClientRect().height,
  });

  if (movies.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Link href="/movies">
            <Button variant="secondary">Browse movies</Button>
          </Link>
        }
      />
    );
  }

  if (virtualized && scrollElementRef) {
    return (
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const movie = movies[virtualRow.index];
          if (!movie) {
            return null;
          }
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <MovieListRow
                movie={movie}
                voteActions={voteActions}
                onChangeVote={onChangeVote}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieListRow
            movie={movie}
            voteActions={voteActions}
            onChangeVote={onChangeVote}
          />
        </li>
      ))}
    </ul>
  );
};

export default MovieList;
