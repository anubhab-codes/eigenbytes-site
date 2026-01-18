import React from 'react';
import Head from '@docusaurus/Head';

export default function Root({ children }) {
  return (
    <>
      <Head>
        <link
          rel="icon"
          href="/img/eigenbytes-favicon.svg"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/img/eigenbytes-favicon-dark.svg"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      {children}
    </>
  );
}
