import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { api } from '~/utils/api';
import '~/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <Toaster />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
