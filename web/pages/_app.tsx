import "../styles/globals.css";

import AppLayout from "../src/layout/AppLayout";
import AuthStateChanged from "../src/layout/AuthStateChanged";
import { AuthProvider } from "../src/hook/useAuth";
import { FilterContextProvider } from "../src/hook/useFilter";
import MetaData from "../components/misc/MetaData";
import { TmdbQueryProvider } from "../src/providers/TmdbQueryProvider";
import { fontClassNames, fontSans } from "../src/lib/fonts";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div
      className={`${fontSans.className} ${fontClassNames} flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden font-sans`}
    >
      <MetaData>
        <TmdbQueryProvider>
          <AuthProvider>
            <AppLayout>
              <AuthStateChanged>
                <FilterContextProvider>
                  <Component {...pageProps} />
                </FilterContextProvider>
              </AuthStateChanged>
            </AppLayout>
          </AuthProvider>
        </TmdbQueryProvider>
      </MetaData>
    </div>
  );
};

export default MyApp;
