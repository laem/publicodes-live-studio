// Import your Client Component
import Link from 'next/link'

export default async function Page() {
  // Forward fetched data to your Client Component
  return (
    <div>
      <h1>Bienvenue sur le studio publicodes</h1>
      <Link href="/document">C'est parti</Link>
      <p>
        Connaissez-vous les pages
        <Link href="/a">A</Link>
        et
        <Link href="/b">B</Link>
      </p>
    </div>
  )
}
