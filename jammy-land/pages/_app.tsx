import '../styles/globals.css';
import '../components/Layout';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { CssBaseline } from '@mui/material';

function MyApp({ Component, pageProps }: AppProps) {

  return(
    <>
      <CssBaseline/>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp
