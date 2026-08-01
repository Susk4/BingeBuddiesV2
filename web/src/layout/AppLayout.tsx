import React, { type ReactNode } from "react";
import Navbar from "./components/Navbar";
import useAuth from "../hook/useAuth";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="bb-canvas fixed inset-0 flex flex-col text-ink">
      {user ? <Navbar /> : null}
      <main
        className={[
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          "px-4 pb-4 pt-3 md:px-8 md:pb-5 md:pt-4 lg:px-12",
          user ? "" : "items-center justify-center",
        ].join(" ")}
      >
        <div
          className={[
            user ? "mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col" : "w-full",
          ].join(" ")}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
