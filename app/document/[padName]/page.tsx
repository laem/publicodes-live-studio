import Studio from './Studio'

export default function Page({
  params,
  searchParams,
}: {
  params: { padName: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return <Studio padName={params.padName} />
}
