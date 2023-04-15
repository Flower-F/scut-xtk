import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { api } from '~/utils/api';
import '~/styles/globals.css';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

import { PaperSheet } from '~/components/PaperSheet';
import { TooltipProvider } from '~/components/ui/Tooltip';

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P> = AppProps<P> & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout<{ session: Session | null }>) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <TooltipProvider>
        <Toaster />
        <PaperSheet />
        <SessionProvider session={session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default api.withTRPC(MyApp);
