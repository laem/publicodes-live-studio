import { useState } from 'react'
import Documentation from './Documentation'
import ErrorBoundary from './ErrorBoundary'

const layoutModes = {
  questions: '❔ Questionnaire',
  documentation: '📚️ Documentation',
}
export default ({ rules, handleShare, defaultTarget }) => {
  const [mode, setMode] = useState('documentation')
  return (
    <div>
      <ErrorBoundary key={rules}>
        {mode === 'documentation' ? (
          <Documentation
            rules={rules}
            onClickShare={handleShare}
            defaultTarget={defaultTarget}
            baseUrl="/studio"
          />
        ) : (
          <div>Mes questions</div>
        )}
      </ErrorBoundary>
    </div>
  )
}
