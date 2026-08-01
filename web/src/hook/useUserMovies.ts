import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MovieVote } from "@binge-buddies/shared";
import DataService from "../services/DataService";

export type UserMoviesVoteFilter = "all" | MovieVote;

export const userMoviesQueryKeys = {
  all: ["userMovies"] as const,
  page: (uid: string, page: number) =>
    [...userMoviesQueryKeys.all, uid, page] as const,
  likedIds: (uid: string) =>
    [...userMoviesQueryKeys.all, uid, "ids"] as const,
  infinite: (uid: string, vote: UserMoviesVoteFilter, search: string) =>
    [...userMoviesQueryKeys.all, uid, "infinite", vote, search] as const,
};

export const useUserMoviesPage = (
  uid: string | undefined,
  page: number,
) => {
  return useQuery({
    queryKey: uid
      ? userMoviesQueryKeys.page(uid, page)
      : [...userMoviesQueryKeys.all, "anonymous", page],
    enabled: Boolean(uid),
    queryFn: () => DataService.getUsersMoviesData(uid!, page),
    staleTime: 30_000,
  });
};

export const useUserMoviesInfinite = (
  uid: string | undefined,
  vote: UserMoviesVoteFilter,
  search: string,
) => {
  return useInfiniteQuery({
    queryKey: uid
      ? userMoviesQueryKeys.infinite(uid, vote, search)
      : [...userMoviesQueryKeys.all, "anonymous", "infinite", vote, search],
    enabled: Boolean(uid),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      DataService.getUsersMoviesData(uid!, pageParam, { vote, search }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
  });
};

export const useUserLikedMovieIds = (uid: string | undefined) => {
  return useQuery({
    queryKey: uid
      ? userMoviesQueryKeys.likedIds(uid)
      : [...userMoviesQueryKeys.all, "anonymous", "ids"],
    enabled: Boolean(uid),
    queryFn: () => DataService.getUsersMovies(uid!),
    staleTime: 30_000,
  });
};

export const useInvalidateUserMovies = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  return (uid: string) => {
    queryClient.invalidateQueries({
      queryKey: [...userMoviesQueryKeys.all, uid],
    });
  };
};
