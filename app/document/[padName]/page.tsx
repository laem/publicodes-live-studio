import SafeStudio from './SafeStudio'

export default function Page({
  params,
  searchParams,
}: {
  params: { padName: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div>
      <SafeStudio padName={params.padName} />
    </div>
  )
}
