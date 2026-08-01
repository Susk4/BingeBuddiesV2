import { useRouter } from "next/router";
import React, { type ComponentType } from "react";
import useAuth from "./useAuth";
import Loading from "../../components/misc/Loading";
import type { AuthContextValue } from "../types/auth";

export type WithAuthProps = {
  auth: AuthContextValue;
};

export const withPublic = <P extends WithAuthProps>(
  Component: ComponentType<P>,
) => {
  const WithPublic = (props: Omit<P, "auth">) => {
    const auth = useAuth();
    const router = useRouter();

    if (auth.user) {
      router.replace("/");
      return (
        <h1>
          <Loading />
        </h1>
      );
    }
    return <Component {...(props as P)} auth={auth} />;
  };
  return WithPublic;
};

export const withProtected = <P extends WithAuthProps>(
  Component: ComponentType<P>,
) => {
  const WithProtected = (props: Omit<P, "auth">) => {
    const auth = useAuth();
    const router = useRouter();

    if (!auth.user) {
      router.replace("/login");
      return (
        <h1>
          <Loading />
        </h1>
      );
    }
    return <Component {...(props as P)} auth={auth} />;
  };
  return WithProtected;
};
