import Link from 'next/link'
import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { repositoryName } from '../services/prismic'
import { SessionProvider } from 'next-auth/react';

import '../styles/global.scss'
import { Header } from '../components/Header';

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
        <PrismicProvider internalLinkComponent={(props) => <Link {...props} />}>
      <PrismicPreview repositoryName={repositoryName}>
        <Header/>
        <Component {...pageProps} />
      </PrismicPreview>
    </PrismicProvider>
    </SessionProvider>
    
  )
}