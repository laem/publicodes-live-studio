const dev = process.env.NODE_ENV !== 'production'
const server = dev ? 'http://localhost:3000' : 'https://publicodes.vercel.app'

async function getData(name) {
  const res = await fetch(server + '/api/document/' + name)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Head({ params }: { params: { slug: string } }) {
  const data = await getData(params.padName)
  const image = data.content['meta html']?.image
  const title =
      data.content['meta html']?.titre ||
      `${params.padName} | Publicodes live studio`,
    description = data.content['meta html']?.description

  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
    </>
  )
}
