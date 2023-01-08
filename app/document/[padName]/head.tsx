export default function Head({ params }: { params: { slug: string } }) {
  const title = `${params.padName} | Publicodes live studio`
  return (
    <>
      <title>{title}</title>
    </>
  )
}
