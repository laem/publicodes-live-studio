'use client'

import Editor from '@monaco-editor/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { utils } from 'publicodes'
import { useEffect, useState } from 'react'
import { MonacoBinding } from 'y-monaco'
import EditorStyle from './EditorStyle'
import EXAMPLE_CODE from './exampleCode'
import ModeSwitchBanner from './ModeSwitchBanner'
import { generateRoomName } from './studioShareUtils'
import { UserBlock } from './UserList'
import useYjs from './useYjs'
import Vue from './Vue'

const { decodeRuleName } = utils

export default function Studio({ padName }) {
  const [layout, setLayout] = useState('split')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState(padName || generateRoomName())
  const [share, setShare] = useState()
  const [editorValue, setEditorValue] = useState(EXAMPLE_CODE)
  const [connected, setConnected] = useState(false)

  const debouncedEditorValue = useDebounce(editorValue, 100)

  const urlFragment = encodeURIComponent(name)

  const target = searchParams.get('target')
  const defaultTarget = target && decodeRuleName(target)

  const yjs = useYjs(urlFragment, 'database', share, setShare)

  const monacoCodeShared = share?.ydoc.getText('monacoCode')

  const handleEditorDidMount = (editor, monaco) => {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    const monacoBinding = new MonacoBinding(
      monacoCodeShared,
      editor.getModel(),
      new Set([editor]),
      share.provider.awareness
    )
  }
  useEffect(() => {
    share?.provider.on('status', (event) => {
      console.log('YJS provider log status', event.status) // logs "connected" or "disconnected"
      setConnected(event.status === 'connected' ? true : false)
    })
  }, [share?.provider])

  useEffect(() => {
    console.log('SALU', monacoCodeShared?.toString())
  }, [monacoCodeShared])

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
                {...{
                  users: yjs.users,
                  username: yjs.username,
                  room: name,
                  connected,
                }}
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
          <Vue {...{ defaultTarget, rules: debouncedEditorValue }} />
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
