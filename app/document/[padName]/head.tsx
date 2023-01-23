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
  const defaultTitle = `${params.padName} | Publicodes live studio`
  const data = await getData(params.padName)

  if (!data || !data.content)
    return (
      <>
        <title>{defaultTitle}</title>
      </>
    )
  const content = data.content,
    meta = content && content['meta html']

  const image = meta && meta.image,
    description = meta && meta.description

  const title = (meta && meta.titre) || defaultTitle

  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      {meta && (
        <>
          <meta property="og:image" content={image} />
          <meta property="twitter:card" content="summary_large_image" />
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
        </>
      )}
    </>
  )
}
