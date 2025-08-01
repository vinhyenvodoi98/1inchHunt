import { AppProps } from 'next/app';

import { ToastContainer } from "react-toastify";

import '@/styles/globals.css';
import '@/styles/colors.css';
import "react-toastify/ReactToastify.min.css";

import Header from '@/components/layout/Header';
import RPGBackground from '@/components/RPGBackground';

import { useIsSsr } from '../utils/ssr';
import Providers from '@/components/Providers';

function MyApp({ Component, pageProps }: AppProps) {
  const isSsr = useIsSsr();
  if (isSsr) {
    return <div></div>;
  }

  return (
    <Providers data-theme="cupcake">
      {/* RPG Background - Behind everything */}
      <RPGBackground />

      {/* Main Content - Above background */}
      <div className="relative z-10 min-h-screen">
        <Header />
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" newestOnTop />
      </div>
    </Providers>
  );
}

export default MyApp;
