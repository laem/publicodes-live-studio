'use client'

import Engine from 'publicodes'
import { useMemo } from 'react'

export const DocPage = ({ dottedName, evaluation, rule }) => {
  return (
    <div>
      {dottedName}
      {evaluation.nodeValue} {evaluation.title} {rule && rule.description}
    </div>
  )
}
