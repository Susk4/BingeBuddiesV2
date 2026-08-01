import type { TmdbMovie } from "@binge-buddies/shared";
import { MOVIE_VOTES } from "@binge-buddies/shared";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Loading from "../components/misc/Loading";
import Card from "../components/MovieCard/Card";
import MovieInfo from "../components/MovieCard/MovieInfo";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import PageShell from "../components/ui/PageShell";
import { withProtected } from "../src/hook/route";
import useDataStore from "../src/hook/useDataStore";
import { useDiscoverMoviesQuery } from "../src/hook/useTmdb";
import { useInvalidateUserMovies } from "../src/hook/useUserMovies";
import { prefetchDiscoverMoviesPage, tmdbQueryKeys } from "../src/services/tmdbQueries";
import type { AuthContextValue } from "../src/types/auth";

type MainProps = {
  auth: AuthContextValue;
};

const Main = ({ auth }: MainProps) => {
  const user = auth.user!;
  const queryClient = useQueryClient();
  const invalidateUserMovies = useInvalidateUserMovies(queryClient);

  const [stack, setStack] = useState<TmdbMovie[] | null>([]);
  const [page, setPage] = useState(1);
  const needsBatch = stack !== null && stack.length === 0;
  const appliedPageRef = useRef(0);

  const { data, isFetching, isError, isPending, error } = useDiscoverMoviesQuery(
    user.uid,
    page,
    needsBatch,
  );

  const waitingForPage =
    needsBatch && data === undefined && (isPending || isFetching);

  useLayoutEffect(() => {
    if (!needsBatch || !data) {
      return;
    }
    if (appliedPageRef.current === page) {
      return;
    }

    if (data.results?.length) {
      appliedPageRef.current = page;
      setStack(data.results);
      setPage(data.page + 1);
      return;
    }

    if (data.page < data.total_pages) {
      setPage(data.page + 1);
      return;
    }

    appliedPageRef.current = page;
    setStack(null);
  }, [data, needsBatch, page]);

  useEffect(() => {
    if (stack === null || stack.length > 5) {
      return;
    }
    prefetchDiscoverMoviesPage(queryClient, user.uid, page);
    if (stack.length > 2) {
      prefetchDiscoverMoviesPage(queryClient, user.uid, page + 1);
    }
  }, [stack, page, queryClient, user.uid]);

  const { recordMovieVote } = useDataStore();

  const pop = (array: TmdbMovie[]) =>
    array.filter((_, index) => index < array.length - 1);

  const handleVote = (item: TmdbMovie, liked: boolean) => {
    const newStack = pop(stack ?? []);
    setStack(newStack);
    if (newStack.length === 0) {
      appliedPageRef.current = 0;
      queryClient.invalidateQueries({
        queryKey: tmdbQueryKeys.discover(user.uid, page),
      });
      prefetchDiscoverMoviesPage(queryClient, user.uid, page);
    }

    const vote = liked ? MOVIE_VOTES.LIKE : MOVIE_VOTES.DISLIKE;
    recordMovieVote(user.uid, item, vote).then(() => {
      invalidateUserMovies(user.uid);
    });
  };

  if (
    needsBatch &&
    !isError &&
    (isPending || waitingForPage || isFetching)
  ) {
    return (
      <PageShell fill>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loading />
        </div>
      </PageShell>
    );
  }

  if (isError || stack === null) {
    const errorMessage =
      error instanceof Error ? error.message : "Could not load movies.";
    return (
      <PageShell width="medium" fill>
        <PageHeader
          eyebrow="Discover"
          title="Nothing in your queue"
          subtitle={
            isError
              ? errorMessage
              : "Your filters might be too tight — open profile and widen genres or years."
          }
        />
        <EmptyState
          title="No matches right now"
          description="Adjust taste settings, then come back for a fresh stack."
          action={
            <Link href="/user">
              <Button>Edit preferences</Button>
            </Link>
          }
        />
      </PageShell>
    );
  }

  const current = stack[stack.length - 1];

  return (
    <PageShell fill className="gap-3 md:gap-4">
      <PageHeader
        className="shrink-0"
        eyebrow="Discover"
        title="Your queue"
        subtitle="Like a title to save it to your list. Pass to see the next one."
      />
      {current ? (
        <div className="flex min-h-0 w-full min-w-0 flex-1 items-stretch justify-center">
          <Card
            key={current.id ?? stack.length}
            onVote={(result) => handleVote(current, result)}
          >
            <MovieInfo item={current} variant="cover" />
          </Card>
        </div>
      ) : null}
    </PageShell>
  );
};

export default withProtected(Main);
