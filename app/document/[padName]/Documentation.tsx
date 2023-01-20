'use client'

import Head from 'next/head'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Engine, { utils } from 'publicodes'
import { getDocumentationSiteMap, RulePage } from 'publicodes-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ErrorBoundary, { nl2br } from './ErrorBoundary'

function invertObject(obj) {
  return Object.entries(obj).reduce((ret, entry) => {
    const [key, value] = entry
    if (value != undefined) ret[value] = key
    return ret
  }, {})
}

type ResultsProps = {
  rules: string
  onClickShare?: React.MouseEventHandler
  defaultTarget?: string
  onTargetChange?: (target: string) => void
  baseUrl?: string
  showDevSection?: boolean
}

class Logger {
  messages: string[] = []
  warn(message: string) {
    this.messages.push(message)
  }
  error(message: string) {
    this.messages.push(message)
  }
  log(message: string) {
    this.messages.push(message)
  }
  toJSX() {
    return this.messages.map((m) => (
      <div
        style={{
          background: 'lightyellow',
          padding: 20,
          borderRadius: 5,
        }}
        key={m}
      >
        {nl2br(m)}
      </div>
    ))
  }
}

export default function Documentation({
  onClickShare,
  rules,
  defaultTarget = '',
  onTargetChange,
  baseUrl,
  showDevSection,
  engine,
}: ResultsProps) {
  const logger = useMemo(() => new Logger(), [rules])
  const targets = useMemo(() => Object.keys(engine.getParsedRules()), [engine])
  const pathToRules = useMemo(
    () => getDocumentationSiteMap({ engine, documentationPath: '' }),
    [engine]
  )
  const ruleToPaths = useMemo(() => invertObject(pathToRules), [pathToRules])
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentTarget, setTarget] = useState(
    searchParams.get('rule') || defaultTarget
  )
  const setCurrentTarget = useCallback(
    (target) => {
      onTargetChange?.(target)
      setTarget(target)
    },
    [onTargetChange]
  )

  useEffect(() => {
    if (!targets.includes(currentTarget)) {
      setCurrentTarget(targets.slice(-1)[0] ?? '')
    }
  }, [currentTarget])

  useEffect(() => {
    if (searchParams.get('rule') !== currentTarget) {
      router.replace(pathname + `?target=${currentTarget}`)
    }
  }, [searchParams, currentTarget, router])

  useEffect(() => {
    if (baseUrl == null) {
      return
    }
    const newPathname = baseUrl + '/' + utils.encodeRuleName(currentTarget)

    if (pathname !== newPathname) {
      //router.replace(newPathname)
    }
  }, [baseUrl, currentTarget, pathname, router])

  return (
    <div style={{ padding: '1rem' }}>
      {logger.toJSX()}

      <ErrorBoundary>
        <RulePage
          language={'fr'}
          rulePath={ruleToPaths[currentTarget]?.replace(/^\//, '') || ''}
          engine={engine}
          documentationPath={''}
          showDevSection={showDevSection}
          renderers={{
            Link: ({ to, children }) => {
              return (
                <Link
                  href={to}
                  onClick={(evt) => {
                    evt.preventDefault()
                    evt.stopPropagation()
                    setCurrentTarget(pathToRules[to])
                  }}
                >
                  {children}
                </Link>
              )
            },
            Head,
          }}
        />
      </ErrorBoundary>

      {onClickShare && (
        <button
          style={{ margin: '1rem auto', display: 'block' }}
          onClick={onClickShare}
        >
          🔗 Copier le lien de la page
        </button>
      )}
    </div>
  )
}
