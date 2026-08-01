import { withProtected } from "../src/hook/route";
import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMoviesBrowseInfinite } from "../src/hook/useTmdb";
import useDataStore from "../src/hook/useDataStore";
import {
  useInvalidateUserMovies,
  useUserLikedMovieIds,
} from "../src/hook/useUserMovies";
import { useInfiniteScrollSentinel } from "../src/hook/useInfiniteScrollSentinel";
import { useResponsiveGridColumns } from "../src/hook/useResponsiveGridColumns";
import Loading from "../components/misc/Loading";
import SearchBar from "../components/movies/SearchBar";
import VirtualMovieGrid from "../components/movies/VirtualMovieGrid";
import type { AuthContextValue } from "../src/types/auth";
import type { TmdbMovie } from "@binge-buddies/shared";
import PageHeader from "../components/ui/PageHeader";
import PageShell from "../components/ui/PageShell";
import EmptyState from "../components/ui/EmptyState";

type MoviesPageProps = {
  auth: AuthContextValue;
};

const Movies = ({ auth }: MoviesPageProps) => {
  const user = auth.user!;
  const queryClient = useQueryClient();
  const invalidateUserMovies = useInvalidateUserMovies(queryClient);
  const { addMovieToUser } = useDataStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const columns = useResponsiveGridColumns();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMoviesBrowseInfinite(searchQuery);
  const { data: likedMovieIds = [] } = useUserLikedMovieIds(user.uid);

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

  const handleSearch = () => {
    setSearchQuery(query);
  };

  const handleLike = (movie: TmdbMovie) => {
    addMovieToUser(user.uid, movie).then(() => {
      invalidateUserMovies(user.uid);
    });
  };

  const isLiked = (movie: TmdbMovie) => likedMovieIds.includes(movie.id);

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loading />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell ref={scrollRef}>
      <PageHeader
        eyebrow="Browse"
        title="Movie night"
        subtitle="Search the catalog and add anything that looks good to your list."
      />

      <div className="mb-8 max-w-xl">
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
        />
      </div>

      {isFetching && !isFetchingNextPage ? (
        <p className="mb-4 text-sm text-ink-muted">Updating…</p>
      ) : null}

      {movies.length === 0 ? (
        <EmptyState
          title="No titles found"
          description="Try another search or browse popular picks with an empty search."
        />
      ) : (
        <VirtualMovieGrid
          movies={movies}
          columns={columns}
          scrollElementRef={scrollRef}
          isLiked={isLiked}
          handleLike={handleLike}
        />
      )}

      <div
        ref={loadMoreRef}
        className="flex min-h-12 items-center justify-center py-6"
      >
        {isFetchingNextPage ? <Loading /> : null}
      </div>
    </PageShell>
  );
};

export default withProtected(Movies);
