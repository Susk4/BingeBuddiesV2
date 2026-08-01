/**
 * Data access layer — calls the Hono API backed by Drizzle + SQLite.
 */
import { apiRequest } from "../lib/apiClient";
import type {
  ContactProfile,
  GroupRecord,
  MovieVote,
  PaginatedMovies,
  SessionUser,
  TmdbMovie,
  UserFilters,
  UserProfile,
  UserVotedMovie,
} from "@binge-buddies/shared";

class DataService {
  async addUser(user: SessionUser, filterData: UserFilters): Promise<void> {
    await apiRequest<void>(`/api/users/${user.uid}/register`, {
      method: "POST",
      body: { filters: filterData },
    });
  }

  async getUser(uid: string): Promise<UserProfile | undefined> {
    try {
      return await apiRequest<UserProfile>(`/api/users/${uid}`);
    } catch {
      return undefined;
    }
  }

  async getUsers(uids: string[]): Promise<UserProfile[]> {
    const users = await Promise.all(uids.map((uid) => this.getUser(uid)));
    return users.filter((u): u is UserProfile => u !== undefined);
  }

  async getUserFilter(uid: string): Promise<UserFilters | null> {
    const user = await this.getUser(uid);
    return user?.filters ?? {};
  }

  async updateUserFilter(uid: string, filterData: UserFilters): Promise<void> {
    await apiRequest<void>(`/api/users/${uid}/filters`, {
      method: "PATCH",
      body: filterData,
    });
  }

  async getUsersMovies(uid: string): Promise<number[]> {
    const user = await this.getUser(uid);
    return user?.movies ?? [];
  }

  async addMovieToUser(uid: string, movie: TmdbMovie): Promise<void> {
    await this.recordMovieVote(uid, movie, "like");
  }

  async recordMovieVote(
    uid: string,
    movie: TmdbMovie,
    vote: MovieVote,
  ): Promise<void> {
    await apiRequest<void>(`/api/users/${uid}/movies`, {
      method: "POST",
      body: { id: movie.id, vote },
    });
  }

  async deleteMovieFromUser(uid: string, movieId: number): Promise<void> {
    await apiRequest<void>(`/api/users/${uid}/movies/${movieId}`, {
      method: "DELETE",
    });
  }

  async getUsersMoviesData(
    uid: string,
    page: number,
    options?: {
      vote?: "all" | MovieVote;
      search?: string;
    },
  ): Promise<PaginatedMovies<UserVotedMovie<TmdbMovie>>> {
    const params = new URLSearchParams({ page: String(page) });
    if (options?.vote) {
      params.set("vote", options.vote);
    }
    const search = options?.search?.trim();
    if (search) {
      params.set("q", search);
    }
    return apiRequest<PaginatedMovies<UserVotedMovie<TmdbMovie>>>(
      `/api/users/${uid}/movies?${params.toString()}`,
    );
  }

  async getContactRequests(uid: string): Promise<ContactProfile[]> {
    return apiRequest<ContactProfile[]>("/api/contacts/requests/incoming");
  }

  async getContacts(uid: string): Promise<UserProfile[]> {
    return apiRequest<UserProfile[]>("/api/contacts");
  }

  async getContactRequestsSent(uid: string): Promise<ContactProfile[]> {
    return apiRequest<ContactProfile[]>("/api/contacts/requests/sent");
  }

  async getPossibleContacts(uid: string): Promise<UserProfile[]> {
    return apiRequest<UserProfile[]>("/api/contacts/possible");
  }

  async acceptContactRequest(contactId: string): Promise<void> {
    await apiRequest<void>(`/api/contacts/${contactId}/accept`, {
      method: "PATCH",
    });
  }

  async declineContactRequest(contactId: string): Promise<void> {
    await apiRequest<void>(`/api/contacts/${contactId}`, {
      method: "DELETE",
    });
  }

  async sendContactRequest(uid: string, contactId: string): Promise<void> {
    await apiRequest<void>("/api/contacts", {
      method: "POST",
      body: { contactId },
    });
  }

  async createGroup(
    name: string,
    description: string,
    userIds: string[],
    creator: string,
  ): Promise<string | { error: Error }> {
    try {
      const res = await apiRequest<{ id: string }>("/api/groups", {
        method: "POST",
        body: { name, description, userIds },
      });
      return res.id;
    } catch (e) {
      return {
        error: e instanceof Error ? e : new Error("Failed to create group"),
      };
    }
  }

  async deleteGroup(groupId: string, uid: string): Promise<void> {
    await apiRequest<void>(`/api/groups/${groupId}`, { method: "DELETE" });
  }

  async leaveGroup(groupId: string, uid: string): Promise<void> {
    await apiRequest<void>(`/api/groups/${groupId}/leave`, {
      method: "POST",
    });
  }

  async getAllPendingGroups(uid: string): Promise<GroupRecord[]> {
    return apiRequest<GroupRecord[]>("/api/groups/pending");
  }

  async getGroups(uid: string): Promise<GroupRecord[]> {
    return apiRequest<GroupRecord[]>("/api/groups");
  }

  async acceptGroupRequest(groupId: string, userId: string): Promise<void> {
    await apiRequest<void>(`/api/groups/${groupId}/accept`, {
      method: "PATCH",
    });
  }

  async declineGroupRequest(groupId: string, userId: string): Promise<void> {
    await apiRequest<void>(`/api/groups/${groupId}/decline`, {
      method: "PATCH",
    });
  }

  async getGroupMovies(
    groupId: string,
    userId: string,
    page: number,
  ): Promise<PaginatedMovies<TmdbMovie> | { error: Error }> {
    try {
      return await apiRequest<PaginatedMovies<TmdbMovie>>(
        `/api/groups/${groupId}/movies?page=${page}`,
      );
    } catch (e) {
      return {
        error: e instanceof Error ? e : new Error("Failed to load group movies"),
      };
    }
  }
}

export default new DataService();
