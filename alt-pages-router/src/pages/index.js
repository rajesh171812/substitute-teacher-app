import Head from "next/head";
import SubTrack from "../components/subtrack/SubTrack";

export default function Home() {
  return (
    <>
      <Head>
        <title>SubTrack</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <SubTrack />
    </>
  );
}
