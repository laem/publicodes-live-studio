'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const DynamicStudio = dynamic(() => import('./Studio'), {
  ssr: false,
})

export default ({ padName }) => {
  return <DynamicStudio padName={padName} />
}
