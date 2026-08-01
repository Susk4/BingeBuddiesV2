import type { SessionUser } from "@binge-buddies/shared";

export type AuthContextValue = {
  user: SessionUser | null;
  error: string;
  loading: boolean;
  loginWithGoogle: () => void;
  completeOAuthLogin: (isNewUser: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: SessionUser | null) => void;
};
