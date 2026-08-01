import { and, desc, eq, inArray, ne, or } from "drizzle-orm";
import type { AppDatabase } from "../db/index.js";
import {
  contacts,
  groupMembers,
  groups,
  userMovies,
  users,
} from "../db/schema.js";
import type {
  ContactProfile,
  GroupRecord,
  MovieVote,
  PaginatedMovies,
  TmdbMovie,
  UserFilters,
  UserProfile,
  UserVotedMovie,
} from "@binge-buddies/shared";
import { MOVIE_VOTES } from "@binge-buddies/shared";
import {
  fetchTmdbMoviesByIds,
} from "./tmdbMovies.js";

const PAGE_SIZE = 10;

const parseFilters = (json: string): UserFilters => {
  try {
    return JSON.parse(json) as UserFilters;
  } catch {
    return {};
  }
}

const toProfile = (
  row: typeof users.$inferSelect,
  movieIds?: number[],
): UserProfile => {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    photo_url: row.photoUrl,
    account_created: row.accountCreated?.getTime(),
    last_login: row.lastLogin?.getTime(),
    filters: parseFilters(row.filtersJson),
    movies: movieIds,
  };
}

export const upsertUserFromGoogle = async (
  db: AppDatabase,
  input: {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
  },
): Promise<{ user: UserProfile; isNewUser: boolean }> => {
  const existing = await db.query.users.findFirst({
    where: eq(users.id, input.id),
  });

  const now = new Date();
  if (existing) {
    await db
      .update(users)
      .set({
        name: input.name,
        email: input.email,
        photoUrl: input.photoUrl,
        lastLogin: now,
      })
      .where(eq(users.id, input.id));
    return {
      user: toProfile({ ...existing, lastLogin: now }),
      isNewUser: false,
    };
  }

  await db.insert(users).values({
    id: input.id,
    name: input.name,
    email: input.email,
    photoUrl: input.photoUrl,
    accountCreated: now,
    lastLogin: now,
    filtersJson: "{}",
  });

  const created = await db.query.users.findFirst({
    where: eq(users.id, input.id),
  });
  if (!created) {
    throw new Error("Failed to create user");
  }
  return { user: toProfile(created), isNewUser: true };
}

export const setUserFilters = async (
  db: AppDatabase,
  uid: string,
  filters: UserFilters,
): Promise<void> => {
  await db
    .update(users)
    .set({ filtersJson: JSON.stringify(filters) })
    .where(eq(users.id, uid));
}

export const registerUserFilters = async (
  db: AppDatabase,
  uid: string,
  filters: UserFilters,
): Promise<void> => {
  await setUserFilters(db, uid, filters);
}

export const getUserProfile = async (
  db: AppDatabase,
  uid: string,
): Promise<UserProfile | null> => {
  const row = await db.query.users.findFirst({ where: eq(users.id, uid) });
  if (!row) {
    return null;
  }
  const liked = await db
    .select({ movieId: userMovies.movieId })
    .from(userMovies)
    .where(
      and(
        eq(userMovies.userId, uid),
        eq(userMovies.vote, MOVIE_VOTES.LIKE),
      ),
    );
  return toProfile(
    row,
    liked.map((r) => r.movieId),
  );
}

export const getUserProfiles = async (
  db: AppDatabase,
  uids: string[],
): Promise<UserProfile[]> => {
  if (!uids.length) {
    return [];
  }
  const rows = await db.select().from(users).where(inArray(users.id, uids));
  return rows.map((row) => toProfile(row));
}

export const recordUserMovieVote = async (
  db: AppDatabase,
  uid: string,
  movieId: number,
  vote: MovieVote,
): Promise<void> => {
  if (!Number.isFinite(movieId)) {
    throw new Error("Invalid movie id");
  }
  await db
    .insert(userMovies)
    .values({ userId: uid, movieId, vote })
    .onConflictDoUpdate({
      target: [userMovies.userId, userMovies.movieId],
      set: { vote },
    });
};

export const addMovieToUser = async (
  db: AppDatabase,
  uid: string,
  movie: { id: number },
): Promise<void> => {
  await recordUserMovieVote(db, uid, Number(movie.id), MOVIE_VOTES.LIKE);
};

export const deleteMovieFromUser = async (
  db: AppDatabase,
  uid: string,
  movieId: number,
): Promise<void> => {
  await db
    .delete(userMovies)
    .where(
      and(eq(userMovies.userId, uid), eq(userMovies.movieId, movieId)),
    );
}

/** All movies the user has voted on (likes + dislikes) — excluded from discover. */
export const getUsersMovieIds = async (
  db: AppDatabase,
  uid: string,
): Promise<number[]> => {
  const rows = await db
    .select({ movieId: userMovies.movieId })
    .from(userMovies)
    .where(eq(userMovies.userId, uid));
  return rows.map((r) => r.movieId);
};

export const getUsersLikedMovieIds = async (
  db: AppDatabase,
  uid: string,
): Promise<number[]> => {
  const rows = await db
    .select({ movieId: userMovies.movieId })
    .from(userMovies)
    .where(
      and(
        eq(userMovies.userId, uid),
        eq(userMovies.vote, MOVIE_VOTES.LIKE),
      ),
    );
  return rows.map((r) => r.movieId);
};

export type UserMoviesVoteFilter = "all" | MovieVote;

export const getUserVotedMovieRows = async (
  db: AppDatabase,
  uid: string,
  voteFilter: UserMoviesVoteFilter,
): Promise<{ movieId: number; vote: MovieVote }[]> => {
  const conditions = [eq(userMovies.userId, uid)];
  if (voteFilter !== "all") {
    conditions.push(eq(userMovies.vote, voteFilter));
  }

  const rows = await db
    .select({
      movieId: userMovies.movieId,
      vote: userMovies.vote,
    })
    .from(userMovies)
    .where(and(...conditions))
    .orderBy(desc(userMovies.createdAt));

  return rows.map((r) => ({
    movieId: r.movieId,
    vote: r.vote as MovieVote,
  }));
};

export const getUserVotedMoviesPage = async (
  db: AppDatabase,
  uid: string,
  page: number,
  voteFilter: UserMoviesVoteFilter,
  search: string,
): Promise<PaginatedMovies<UserVotedMovie<TmdbMovie>>> => {
  const rows = await getUserVotedMovieRows(db, uid, voteFilter);
  const trimmedSearch = search.trim().toLowerCase();

  let filteredRows = rows;
  if (trimmedSearch) {
    const ids = rows.map((r) => r.movieId);
    const movies = await fetchTmdbMoviesByIds(ids);
    const titleById = new Map(
      movies.map((m) => [m.id, m.title?.toLowerCase() ?? ""]),
    );
    filteredRows = rows.filter((r) =>
      titleById.get(r.movieId)?.includes(trimmedSearch),
    );
  }

  const movieIds = filteredRows.map((r) => r.movieId);
  const voteById = new Map(filteredRows.map((r) => [r.movieId, r.vote]));

  const paginated = await getMoviesPage(db, movieIds, page);
  const results: UserVotedMovie<TmdbMovie>[] = paginated.results.map((m) => ({
    ...m,
    vote: voteById.get(m.id) ?? MOVIE_VOTES.LIKE,
  }));

  return {
    ...paginated,
    results,
  };
};

export const getMoviesPage = async (
  db: AppDatabase,
  movieIds: number[],
  page: number,
): Promise<PaginatedMovies<TmdbMovie>> => {
  const total = movieIds.length;
  const total_pages =
    total === 0 ? 0 : total % PAGE_SIZE === 0 ? total / PAGE_SIZE : Math.floor(total / PAGE_SIZE) + 1;
  const safePage = total_pages === 0 ? 1 : Math.min(Math.max(page, 1), total_pages);
  const batchIds = movieIds.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (!batchIds.length) {
    return {
      results: [],
      page: safePage,
      total_pages,
      total_results: total,
    };
  }

  const results = await fetchTmdbMoviesByIds(batchIds);

  return {
    results,
    page: safePage,
    total_pages,
    total_results: total,
  };
}

export const getIntersectingMoviesPage = async (
  db: AppDatabase,
  uids: string[],
  page: number,
): Promise<PaginatedMovies<TmdbMovie>> => {
  if (!uids.length) {
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }

  const lists: number[][] = [];
  for (const uid of uids) {
    lists.push(await getUsersLikedMovieIds(db, uid));
  }

  const intersect = lists.reduce((a, b) => a.filter((id) => b.includes(id)));
  return getMoviesPage(db, intersect, page);
}

const contactToProfile = (
  user: typeof users.$inferSelect,
  contactDocId: number,
): ContactProfile => {
  return {
    ...toProfile(user),
    contact_doc_id: String(contactDocId),
  };
}

export const getContacts = async (
  db: AppDatabase,
  uid: string,
): Promise<UserProfile[]> => {
  const rows = await db
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.accepted, true),
        or(eq(contacts.userId, uid), eq(contacts.contactId, uid)),
      ),
    );

  const friendIds = new Set<string>();
  for (const row of rows) {
    friendIds.add(row.userId === uid ? row.contactId : row.userId);
  }
  return getUserProfiles(db, [...friendIds]);
}

export const getPossibleContacts = async (
  db: AppDatabase,
  uid: string,
): Promise<UserProfile[]> => {
  const allUsers = await db.select().from(users).where(ne(users.id, uid));
  const related = await db
    .select()
    .from(contacts)
    .where(or(eq(contacts.userId, uid), eq(contacts.contactId, uid)));

  const excluded = new Set<string>([uid]);
  for (const row of related) {
    excluded.add(row.userId);
    excluded.add(row.contactId);
  }

  return allUsers
    .filter((u) => !excluded.has(u.id))
    .map((u) => toProfile(u));
}

export const getIncomingContactRequests = async (
  db: AppDatabase,
  uid: string,
): Promise<ContactProfile[]> => {
  const rows = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.contactId, uid), eq(contacts.accepted, false)));

  const result: ContactProfile[] = [];
  for (const row of rows) {
    const sender = await db.query.users.findFirst({
      where: eq(users.id, row.userId),
    });
    if (sender) {
      result.push(contactToProfile(sender, row.id));
    }
  }
  return result;
}

export const getSentContactRequests = async (
  db: AppDatabase,
  uid: string,
): Promise<ContactProfile[]> => {
  const rows = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.userId, uid), eq(contacts.accepted, false)));

  const result: ContactProfile[] = [];
  for (const row of rows) {
    const target = await db.query.users.findFirst({
      where: eq(users.id, row.contactId),
    });
    if (target) {
      result.push(contactToProfile(target, row.id));
    }
  }
  return result;
}

export const sendContactRequest = async (
  db: AppDatabase,
  uid: string,
  contactId: string,
): Promise<void> => {
  await db.insert(contacts).values({
    userId: uid,
    contactId,
    accepted: false,
  });
}

export const acceptContactRequest = async (
  db: AppDatabase,
  contactRowId: number,
): Promise<void> => {
  await db
    .update(contacts)
    .set({ accepted: true })
    .where(eq(contacts.id, contactRowId));
}

export const declineContactRequest = async (
  db: AppDatabase,
  contactRowId: number,
): Promise<void> => {
  await db.delete(contacts).where(eq(contacts.id, contactRowId));
}

export const groupToRecord = async (
  db: AppDatabase,
  group: typeof groups.$inferSelect,
): Promise<GroupRecord> => {
  const members = await db
    .select()
    .from(groupMembers)
    .where(eq(groupMembers.groupId, group.id));

  return {
    id: group.id,
    name: group.name,
    description: group.description,
    creator: group.creatorId,
    users: members.map((m) => ({ id: m.userId, accepted: m.accepted })),
  };
}

export const createGroup = async (
  db: AppDatabase,
  name: string,
  description: string,
  memberIds: string[],
  creatorId: string,
): Promise<string> => {
  const existing = await db.select().from(groups);
  for (const g of existing) {
    const record = await groupToRecord(db, g);
    const allGroupUsers = [
      ...record.users.map((u) => u.id),
      record.creator,
    ].sort();
    const allNew = [...memberIds, creatorId].sort();
    if (allGroupUsers.join(",") === allNew.join(",")) {
      throw new Error("The same group already exists.");
    }
  }

  const id = crypto.randomUUID();
  await db.insert(groups).values({
    id,
    name,
    description,
    creatorId,
  });

  for (const memberId of memberIds) {
    await db.insert(groupMembers).values({
      groupId: id,
      userId: memberId,
      accepted: false,
    });
  }

  return id;
}

export const deleteGroup = async (
  db: AppDatabase,
  groupId: string,
  uid: string,
): Promise<void> => {
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!group) {
    throw new Error("Group does not exist");
  }
  if (group.creatorId !== uid) {
    throw new Error("You are not the creator of this group.");
  }
  await db.delete(groups).where(eq(groups.id, groupId));
}

export const leaveGroup = async (
  db: AppDatabase,
  groupId: string,
  uid: string,
): Promise<void> => {
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!group) {
    throw new Error("Group does not exist");
  }
  if (group.creatorId === uid) {
    throw new Error("You are the creator of this group.");
  }

  const membership = await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.userId, uid),
    ),
  });
  if (!membership) {
    throw new Error("You are not a member of this group.");
  }

  await db
    .delete(groupMembers)
    .where(
      and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, uid)),
    );

  const remaining = await db
    .select()
    .from(groupMembers)
    .where(eq(groupMembers.groupId, groupId));
  if (remaining.length === 0) {
    await db.delete(groups).where(eq(groups.id, groupId));
  }
}

export const getGroupsForUser = async (
  db: AppDatabase,
  uid: string,
): Promise<GroupRecord[]> => {
  const all = await db.select().from(groups);
  const result: GroupRecord[] = [];

  for (const g of all) {
    const record = await groupToRecord(db, g);
    const isMember =
      record.creator === uid ||
      record.users.some((u) => u.id === uid && u.accepted);
    const allAccepted = record.users.every((u) => u.accepted);
    if (isMember && allAccepted) {
      result.push(record);
    }
  }
  return result;
}

export const getPendingGroupsForUser = async (
  db: AppDatabase,
  uid: string,
): Promise<GroupRecord[]> => {
  const all = await db.select().from(groups);
  const result: GroupRecord[] = [];

  for (const g of all) {
    const record = await groupToRecord(db, g);
    const involved =
      record.creator === uid || record.users.some((u) => u.id === uid);
    const hasPending = record.users.some((u) => !u.accepted);
    if (involved && hasPending) {
      result.push(record);
    }
  }
  return result;
}

export const acceptGroupInvite = async (
  db: AppDatabase,
  groupId: string,
  userId: string,
): Promise<void> => {
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!group) {
    throw new Error("Group does not exist");
  }
  if (group.creatorId === userId) {
    throw new Error("User is creator");
  }

  const membership = await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.userId, userId),
    ),
  });
  if (!membership) {
    throw new Error("User is not in group");
  }
  if (membership.accepted) {
    throw new Error("User already accepted");
  }

  await db
    .update(groupMembers)
    .set({ accepted: true })
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId),
      ),
    );
}

export const declineGroupInvite = async (
  db: AppDatabase,
  groupId: string,
  userId: string,
): Promise<void> => {
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!group) {
    throw new Error("Group does not exist");
  }
  if (group.creatorId === userId) {
    throw new Error("User is creator");
  }

  await db
    .delete(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId),
      ),
    );

  const remaining = await db
    .select()
    .from(groupMembers)
    .where(eq(groupMembers.groupId, groupId));
  if (remaining.length === 0) {
    await db.delete(groups).where(eq(groups.id, groupId));
  }
}

export const getGroupMovies = async (
  db: AppDatabase,
  groupId: string,
  userId: string,
  page: number,
): Promise<PaginatedMovies | { error: string; cause?: string }> => {
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!group) {
    return { error: "Group not found", cause: "not a member" };
  }

  const record = await groupToRecord(db, group);
  const isMember =
    record.creator === userId ||
    record.users.some((u) => u.id === userId);

  if (!isMember) {
    return {
      error: "It looks like you are not a member of this group.",
      cause: "not a member",
    };
  }

  if (record.users.some((u) => !u.accepted)) {
    return {
      error:
        "Your group is still pending. Please check back after all the members have accepted the invitation",
      cause: "group is pending",
    };
  }

  const allUsers = [...record.users.map((u) => u.id), record.creator];
  return getIntersectingMoviesPage(db, allUsers, page);
}
