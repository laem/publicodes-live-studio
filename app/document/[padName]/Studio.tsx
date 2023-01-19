'use client'

import Editor from '@monaco-editor/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { utils } from 'publicodes'
import { useCallback, useEffect, useState } from 'react'
import { MonacoBinding } from 'y-monaco'
import Documentation from './Documentation'
import EditorStyle from './EditorStyle'
import ErrorBoundary from './ErrorBoundary'
import { generateRoomName } from './studioShareUtils'
import { UserBlock } from './UserList'
import useYjs from './useYjs'
import EXAMPLE_CODE from './exampleCode'
import Vue from './Vue'
import ModeSwitchBanner from './ModeSwitchBanner'

const { decodeRuleName } = utils

export default function Studio({ padName }) {
  const [layout, setLayout] = useState('split')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState(padName || generateRoomName())
  const [share, setShare] = useState()
  const [editorValue, setEditorValue] = useState(EXAMPLE_CODE)

  const debouncedEditorValue = useDebounce(editorValue, 100)

  const urlFragment = encodeURIComponent(name)

  const yjs = useYjs(urlFragment, 'database', share, setShare)

  useEffect(() => {
    return
    if (urlFragment.length > 2) router.replace('/document/' + urlFragment)
    //TODO refresh on first replace, to avoid
  }, [urlFragment])

  const handleShare = useCallback(() => {
    window?.navigator.clipboard.writeText(window.location.href)
  }, [window.location.href])

  const target = searchParams.get('target')
  const defaultTarget = target && decodeRuleName(target)
  const monacoCode = share && share.ydoc.getText('monacoCode')

  const handleEditorDidMount = (editor, monaco) => {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    const monacoBinding = new MonacoBinding(
      monacoCode,
      editor.getModel(),
      new Set([editor]),
      share.provider.awareness
    )
  }

  // This is for local persistence. TODO is it really needed ?
  useEffect(() => {
    share &&
      share.persistence &&
      share.persistence.once('synced', () => {
        console.log('initial content from the local browser database loaded')
      })
  }, [yjs])

  useEffect(() => {
    share &&
      share.provider &&
      share.provider.once('synced', () => {
        console.log('initial content from the online database loaded')
        console.log('Provider synced log', monacoCode.toString())
        if (monacoCode.toString() === '') monacoCode.insert(0, EXAMPLE_CODE)
      })
  }, [yjs, monacoCode])

  useEffect(() => {
    console.log('SALU', monacoCode?.toString())
  }, [monacoCode])

  const layoutModes = {
    code: '💻️ Code',
    split: '↔ Partagé',
    view: '🪟 Interface',
  }

  return (
    <div
      css={`
        flex-grow: 1;
        display: flex;
        height: 100%;
        flex-direction: column;
        > * {
          flex: 1;
          border: rgb(0 0 0 / 25%) 1px solid;
          overflow: auto;
        }

        > div {
          display: flex;
        }

        @media (max-width: 960px) {
          flex-direction: column;
          padding: 20px;

          > :first-child {
            width: 100% !important;
          }
        }
        button {
          cursor: pointer;
        }
      `}
    >
      <ModeSwitchBanner>
        {Object.entries(layoutModes).map(([key, value]) => (
          <li key={key} onClick={() => setLayout(key)}>
            <button>{value}</button>
          </li>
        ))}
      </ModeSwitchBanner>
      <div>
        <section
          style={
            {
              split: { width: '50%' },
              view: { display: 'none' },
              code: { width: '100%' },
            }[layout]
          }
        >
          <div>
            {yjs && (
              <UserBlock
                {...{ users: yjs.users, username: yjs.username, room: name }}
              />
            )}
          </div>

          {share && (
            <EditorStyle users={yjs.users}>
              <Editor
                height="75vh"
                defaultLanguage="yaml"
                options={{ minimap: { enabled: false } }}
                defaultValue={editorValue}
                onChange={(newValue) =>
                  console.log('setFromMonaco', newValue) ||
                  setEditorValue(newValue ?? '')
                }
                onMount={handleEditorDidMount}
              />
            </EditorStyle>
          )}
        </section>
        <section
          style={
            {
              split: { width: '50%' },
              code: { display: 'none' },
              view: { width: '100%' },
            }[layout]
          }
        >
          <Vue
            {...{ defaultTarget, handleShare, rules: debouncedEditorValue }}
          />
        </section>
      </div>
    </div>
  )
}

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}
