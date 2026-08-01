import LoginList from "../components/Login/LoginList";
import { withPublic } from "../src/hook/route";
import type { AuthContextValue } from "../src/types/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Panel from "../components/ui/Panel";
import PageHeader from "../components/ui/PageHeader";
import PageShell from "../components/ui/PageShell";

type LoginProps = {
  auth: AuthContextValue;
};

const Login = ({ auth }: LoginProps) => {
  const { loginWithGoogle, loading, error, setUser } = auth;
  const router = useRouter();
  const [oauthError, setOauthError] = useState("");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const err = router.query.error;
    if (typeof err === "string") {
      setOauthError("Sign-in was cancelled or failed. Please try again.");
    }
  }, [router.isReady, router.query.error]);

  useEffect(() => {
    setUser(null);
  }, [setUser]);

  const displayError = oauthError || error;

  return (
    <PageShell width="narrow" centered className="py-12">
      <Panel
        padded
        className="bb-panel-hero relative flex w-full flex-col gap-8 !p-8 md:!p-10"
      >
        <PageHeader
          align="center"
          eyebrow="Now streaming"
          title="BingeBuddies"
          subtitle="Swipe films with friends, build shared lists, and pick what to watch tonight."
        />

        {displayError && !loading ? (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            {displayError}
          </p>
        ) : null}

        <LoginList onGoogleSignIn={loginWithGoogle} loading={loading} />
      </Panel>
    </PageShell>
  );
}

export default withPublic(Login);
