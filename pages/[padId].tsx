import Head from 'next/head'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Studio from './Studio'

const Card = styled.div`
  background: cyan;
`

export default function Home({}) {
  const router = useRouter()
  const { padId } = router.query

  return (
    <div>
      <Head>
        <title>Studio publicodes live</title>
        <link rel="icon" href="/logo-publicodes.svg" />
      </Head>

      <main>
        <Card>YO {padId}</Card>
        <h1>Studio publicodes live</h1>
        <Studio padId={padId} />
      </main>
    </div>
  )
}
