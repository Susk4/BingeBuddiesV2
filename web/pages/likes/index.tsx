import type { MovieVote, TmdbMovie } from "@binge-buddies/shared";
import { MOVIE_VOTES } from "@binge-buddies/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import Loading from "../../components/misc/Loading";
import MovieList from "../../components/misc/MovieList";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import PageShell from "../../components/ui/PageShell";
import { useInfiniteScrollSentinel } from "../../src/hook/useInfiniteScrollSentinel";
import useDataStore from "../../src/hook/useDataStore";
import { withProtected } from "../../src/hook/route";
import {
  useInvalidateUserMovies,
  useUserMoviesInfinite,
  type UserMoviesVoteFilter,
} from "../../src/hook/useUserMovies";
import type { AuthContextValue } from "../../src/types/auth";

type LikesProps = {
  auth: AuthContextValue;
};

const VOTE_FILTERS: { id: UserMoviesVoteFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: MOVIE_VOTES.LIKE, label: "Liked" },
  { id: MOVIE_VOTES.DISLIKE, label: "Not interested" },
];

const Likes = ({ auth }: LikesProps) => {
  const user = auth.user!;
  const queryClient = useQueryClient();
  const invalidateUserMovies = useInvalidateUserMovies(queryClient);
  const { recordMovieVote } = useDataStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [voteFilter, setVoteFilter] = useState<UserMoviesVoteFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useUserMoviesInfinite(user.uid, voteFilter, debouncedSearch);

  const movies = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.results);
  }, [data?.pages]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useInfiniteScrollSentinel(
    loadMoreRef,
    Boolean(hasNextPage) && !isFetchingNextPage,
    () => {
      fetchNextPage();
    },
  );

  const changeVote = (movie: TmdbMovie, vote: MovieVote) => {
    recordMovieVote(user.uid, movie, vote).then(() => {
      invalidateUserMovies(user.uid);
    });
  };

  const emptyDescription =
    debouncedSearch.length > 0
      ? "No titles match your search. Try another keyword or clear the filter."
      : voteFilter === MOVIE_VOTES.LIKE
        ? "Like films while swiping or from Browse to build your collection."
        : voteFilter === MOVIE_VOTES.DISLIKE
          ? "Titles you pass on Discover will show up here."
          : "Swipe on Discover to like or pass on titles.";

  if (isLoading) {
    return (
      <PageShell width="wide">
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loading />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell ref={scrollRef} width="wide">
      <PageHeader
        eyebrow="Your list"
        title="Your votes"
        subtitle="Liked titles and ones you're not interested in — update your vote anytime."
      />

      <div className="mb-6 flex flex-col gap-4">
        <Input
          type="search"
          placeholder="Search by title…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search movies by title"
        />
        <div className="flex flex-wrap gap-2">
          {VOTE_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant={voteFilter === filter.id ? "primary" : "secondary"}
              size="sm"
              onClick={() => setVoteFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {isFetching && !isFetchingNextPage ? (
        <p className="mb-4 text-sm text-ink-muted">Updating…</p>
      ) : null}

      <MovieList
        movies={movies}
        voteActions={true}
        onChangeVote={changeVote}
        emptyTitle="Nothing here yet"
        emptyDescription={emptyDescription}
        virtualized={true}
        scrollElementRef={scrollRef}
      />

      <div
        ref={loadMoreRef}
        className="flex min-h-12 items-center justify-center py-6"
      >
        {isFetchingNextPage ? <Loading /> : null}
      </div>
    </PageShell>
  );
};

export default withProtected(Likes);
