'use client'

import Link from 'next/link'
import Engine from 'publicodes'
import { RulePage } from 'publicodes-react'
import { useMemo } from 'react'

export const DocPage = ({ dottedName, rules }) => {
  const engine = useMemo(() => new Engine(rules), [rules])

  return (
    <div>
      <RulePage
        language={'fr'}
        rulePath={dottedName}
        engine={engine}
        documentationPath={''}
        renderers={{
          Head: () => <title>Le titre de {dottedName}</title>,
          Link: ({ to }) => <Link href={to} />,
        }}
      />
    </div>
  )
}
