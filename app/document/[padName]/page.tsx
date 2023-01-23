'use client'
import Studio from './Studio'

export default function Page({
  params,
  searchParams,
}: {
  params: { padName: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return <div>{params.padName}</div>
}
