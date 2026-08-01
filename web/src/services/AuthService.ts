import { getApiBase } from "../lib/apiBase";
import { apiRequest } from "../lib/apiClient";
import type { SessionUser } from "@binge-buddies/shared";

type MeResponse = {
  user: SessionUser;
};

class AuthService {
  startGoogleSignIn(): void {
    window.location.href = `${getApiBase()}/auth/google`;
  }

  /** Session cookie is set by the API on OAuth callback; load user profile. */
  async completeOAuthSession(): Promise<{
    user: SessionUser;
    error?: string;
  }> {
    try {
      const data = await apiRequest<MeResponse>("/auth/me");
      return { user: data.user };
    } catch (error) {
      console.error(error);
      return {
        user: null as unknown as SessionUser,
        error: "Could not restore session after sign-in.",
      };
    }
  }

  async restoreSession(): Promise<SessionUser | null> {
    try {
      const data = await apiRequest<MeResponse>("/auth/me");
      return data.user;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiRequest<void>("/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
  }
}

export default new AuthService();
