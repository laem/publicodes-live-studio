import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Documentation from './Documentation'
import ErrorBoundary from './ErrorBoundary'
import ModeSwitchBanner from './ModeSwitchBanner'
import PubliForm from './PubliForm'
import Engine, { utils } from 'publicodes'
import { parse } from 'yaml'

const layoutModes = {
  questions: '❔ Questionnaire',
  documentation: '📚️ Documentation',
}
export default ({ rules, handleShare, defaultTarget }) => {
  const [mode, setMode] = useState('documentation')
  const engine = useMemo(() => new Engine(parse(rules)), [rules])
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
