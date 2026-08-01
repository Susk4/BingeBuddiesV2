import React from "react";
import Head from "next/head";

const MetaData = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Welcome to BingeBuddies! The best place to find your next binge-worthy show!"
        />
        <meta name="author" content="BingeBuddies" />
        <title>
          BingeBuddies | The best place to find your next binge-worthy show!
        </title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default MetaData;
