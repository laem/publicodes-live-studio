import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Documentation from './Documentation'
import ErrorBoundary from './ErrorBoundary'
import ModeSwitchBanner from './ModeSwitchBanner'
import PubliForm from './PubliForm'
import Engine, { utils } from 'publicodes'
import { parse, YAMLParseError } from 'yaml'
import { Blockquote } from '../../UI'

const layoutModes = {
  questions: '❔ Questionnaire',
  documentation: '📚️ Documentation',
}
export default ({ rules, handleShare, defaultTarget }) => {
  const [mode, setMode] = useState('documentation')
  const [error, setError] = useState(null)
  const engine = useMemo(() => {
    try {
      const parsed = parse(rules)
      setError(null)
      return new Engine(parsed)
    } catch (e) {
      if (e instanceof YAMLParseError)
        setError({ human: 'Votre YAML semble malformé', e })
      else setError({ human: 'erreur non YAML', e })
    }
  }, [rules])

  if (error)
    return (
      <div>
        <p>Une erreur est survenue : {error.human}</p>
        <Blockquote>{error.e.toString()}</Blockquote>
      </div>
    )

  return (
    <div>
      <ModeSwitchBanner>
        {Object.entries(layoutModes).map(([key, value]) => (
          <li key={key} onClick={() => setMode(key)}>
            <button>{value}</button>
          </li>
        ))}
      </ModeSwitchBanner>
      {mode === 'questions' ? (
        <PubliForm engine={engine} />
      ) : (
        <ErrorBoundary key={rules}>
          <Documentation
            rules={rules}
            engine={engine}
            onClickShare={handleShare}
            defaultTarget={defaultTarget}
            baseUrl="/studio"
          />
        </ErrorBoundary>
      )}
    </div>
  )
}
