import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { api } from '../utils/api';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import '../styles/globals.css';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return <SessionProvider session={session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>;
};

export default api.withTRPC(MyApp);
