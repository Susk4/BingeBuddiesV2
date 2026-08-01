import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { withProtected } from "../../../src/hook/route";
import useFireStore from "../../../src/hook/useFireStore";
import MovieList from "../../../components/misc/MovieList";
import Loading from "../../../components/misc/Loading";
import Pagination from "../../../components/movies/Pagination";
import type { AuthContextValue } from "../../../src/types/auth";
import type { TmdbMovie } from "@binge-buddies/shared";
import { hasError } from "@binge-buddies/shared";
import PageHeader from "../../../components/ui/PageHeader";
import PageShell from "../../../components/ui/PageShell";
import EmptyState from "../../../components/ui/EmptyState";

type GroupMoviesProps = {
  auth: AuthContextValue;
};

const GroupMovies = ({ auth }: GroupMoviesProps) => {
  const router = useRouter();
  const { user } = auth;
  const { getGroupMovies, loading } = useFireStore();
  const [error, setError] = useState<string | null>(null);
  const [moviesData, setMoviesData] = useState<TmdbMovie[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const groupId =
    typeof router.query.id === "string" ? router.query.id : undefined;

  useEffect(() => {
    if (!groupId || !user) {
      return;
    }
    getGroupMovies(groupId, user.uid, page).then((res) => {
      if (hasError(res)) {
        setError(res.error.message);
      } else {
        setMoviesData(res.results);
        setPages(res.total_pages);
      }
    });
  }, [groupId, page, getGroupMovies, user]);

  if (!user) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <PageShell width="medium">
        <EmptyState title="Couldn’t load group" description={error} />
      </PageShell>
    );
  }

  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Group"
        title="Shared matches"
        subtitle="Films your crew agrees on."
      />
      <MovieList movies={moviesData} />
      {moviesData.length !== 0 ? (
        <div className="mt-10">
          <Pagination page={page} setPage={setPage} pages={pages} />
        </div>
      ) : null}
    </PageShell>
  );
};

export default withProtected(GroupMovies);
