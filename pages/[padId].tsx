import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";

const Card = styled.div`
  background: cyan;
`;

export default function Home({}) {
  const router = useRouter();
  const { padId } = router.query;

  return (
    <div>
      <Head>
        <title>Studio publicodes live</title>
        <link rel="icon" href="/logo-publicodes.svg" />
      </Head>
      <Card>YO {padId}</Card>
      <div
        css={`
          background: red;
        `}
      >
        Salut
      </div>

      <main>
        <h1>Studio publicodes live</h1>
      </main>
    </div>
  );
}
