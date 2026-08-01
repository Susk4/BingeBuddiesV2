import React from "react";
import useAuth from "../hook/useAuth";
import AuthService from "../services/AuthService";
import Loading from "../../components/misc/Loading";

const AuthStateChanged = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setUser } = useAuth();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    AuthService.restoreSession().then((user) => {
      if (cancelled) {
        return;
      }
      setUser(user);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthStateChanged;
