import React, { type ReactNode } from "react";
import Navbar from "./components/Navbar";
import useAuth from "../hook/useAuth";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="bb-canvas flex min-h-0 flex-1 flex-col text-ink">
      {user ? <Navbar /> : null}
      <main
        className={[
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          "px-4 pb-4 pt-3 md:px-8 md:pb-5 md:pt-4 lg:px-12",
          user ? "" : "items-center justify-center",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full min-h-0 min-w-0 max-w-7xl flex-1 flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
