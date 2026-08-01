import { useCallback, useState } from "react";
import DataService from "../services/DataService";
import type {
  MovieVote,
  SessionUser,
  TmdbMovie,
  UserFilters,
} from "@binge-buddies/shared";

const useDataStore = () => {
  const [loading, setLoading] = useState(false);

  const runWithLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(
    async (user: SessionUser, filterData: UserFilters) => {
      if (!user) {
        return;
      }
      await DataService.addUser(user, filterData);
    },
    [],
  );

  const getPossibleContacts = useCallback(
    (uid: string) => runWithLoading(() => DataService.getPossibleContacts(uid)),
    [runWithLoading],
  );

  const getUser = useCallback(
    (uid: string) => runWithLoading(() => DataService.getUser(uid)),
    [runWithLoading],
  );

  const getUsers = useCallback(
    (uids: string[]) => runWithLoading(() => DataService.getUsers(uids)),
    [runWithLoading],
  );

  const getUserFilter = useCallback(
    (uid: string) => DataService.getUserFilter(uid),
    [],
  );

  const updateUserFilter = useCallback(
    (uid: string, filterData: UserFilters) =>
      DataService.updateUserFilter(uid, filterData),
    [],
  );

  const getUsersMovies = useCallback(
    (uid: string) => runWithLoading(() => DataService.getUsersMovies(uid)),
    [runWithLoading],
  );

  const addMovieToUser = useCallback(
    (uid: string, movie: TmdbMovie) => DataService.addMovieToUser(uid, movie),
    [],
  );

  const recordMovieVote = useCallback(
    (uid: string, movie: TmdbMovie, vote: MovieVote) =>
      DataService.recordMovieVote(uid, movie, vote),
    [],
  );

  const deleteMovieFromUser = useCallback(
    (uid: string, movie: TmdbMovie | number) => {
      const movieId = typeof movie === "number" ? movie : movie.id;
      return DataService.deleteMovieFromUser(uid, movieId);
    },
    [],
  );

  const getUsersMoviesData = useCallback(
    (uid: string, page: number) =>
      runWithLoading(() => DataService.getUsersMoviesData(uid, page)),
    [runWithLoading],
  );

  const getContactRequests = useCallback(
    (uid: string) => runWithLoading(() => DataService.getContactRequests(uid)),
    [runWithLoading],
  );

  const getContacts = useCallback(
    (uid: string) => runWithLoading(() => DataService.getContacts(uid)),
    [runWithLoading],
  );

  const getContactRequestsSent = useCallback(
    (uid: string) =>
      runWithLoading(() => DataService.getContactRequestsSent(uid)),
    [runWithLoading],
  );

  const acceptContactRequest = useCallback(
    (contact: string) => DataService.acceptContactRequest(contact),
    [],
  );

  const declineContactRequest = useCallback(
    (contact: string) => DataService.declineContactRequest(contact),
    [],
  );

  const sendContactRequest = useCallback(
    (uid: string, contact: string) =>
      DataService.sendContactRequest(uid, contact),
    [],
  );

  const createGroup = useCallback(
    (name: string, description: string, users: string[], creator: string) =>
      runWithLoading(() =>
        DataService.createGroup(name, description, users, creator),
      ),
    [runWithLoading],
  );

  const deleteGroup = useCallback(
    (groupId: string, uid: string) =>
      runWithLoading(() => DataService.deleteGroup(groupId, uid)),
    [runWithLoading],
  );

  const leaveGroup = useCallback(
    (groupId: string, uid: string) =>
      runWithLoading(() => DataService.leaveGroup(groupId, uid)),
    [runWithLoading],
  );

  const getAllPendingGroups = useCallback(
    (uid: string) =>
      runWithLoading(() => DataService.getAllPendingGroups(uid)),
    [runWithLoading],
  );

  const getGroups = useCallback(
    (uid: string) => runWithLoading(() => DataService.getGroups(uid)),
    [runWithLoading],
  );

  const acceptGroupRequest = useCallback(
    (groupId: string, userId: string) =>
      DataService.acceptGroupRequest(groupId, userId),
    [],
  );

  const declineGroupRequest = useCallback(
    (groupId: string, userId: string) =>
      DataService.declineGroupRequest(groupId, userId),
    [],
  );

  const getGroupMovies = useCallback(
    (groupId: string, userId: string, page: number) =>
      runWithLoading(() => DataService.getGroupMovies(groupId, userId, page)),
    [runWithLoading],
  );

  return {
    loading,
    addUser,
    getPossibleContacts,
    getContactRequests,
    getContacts,
    getContactRequestsSent,
    acceptContactRequest,
    declineContactRequest,
    sendContactRequest,
    createGroup,
    deleteGroup,
    leaveGroup,
    getAllPendingGroups,
    getGroups,
    acceptGroupRequest,
    declineGroupRequest,
    getGroupMovies,
    getUser,
    getUsers,
    getUserFilter,
    updateUserFilter,
    addMovieToUser,
    recordMovieVote,
    deleteMovieFromUser,
    getUsersMoviesData,
    getUsersMovies,
  };
};

export default useDataStore;
