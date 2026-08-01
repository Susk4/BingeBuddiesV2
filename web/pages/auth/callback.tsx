import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "../../src/hook/useAuth";
import Loading from "../../components/misc/Loading";

/** Landing page after backend OAuth callback (session cookie already set on API host). */
const AuthCallbackPage = () => {
  const router = useRouter();
  const { completeOAuthLogin } = useAuth();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const isNewUser = router.query.isNewUser === "1";
    completeOAuthLogin(isNewUser);
  }, [router.isReady, router.query.isNewUser, completeOAuthLogin]);

  return (
    <div className="flex justify-center items-center h-full">
      <Loading />
    </div>
  );
};

export default AuthCallbackPage;
