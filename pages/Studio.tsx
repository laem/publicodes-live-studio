import Editor from '@monaco-editor/react'
import { useRouter } from 'next/router'
import { utils } from 'publicodes'
import { useCallback, useEffect, useState } from 'react'
import { MonacoBinding } from 'y-monaco'
import Documentation from './Documentation'
import ErrorBoundary from './ErrorBoundary'
import { generateRoomName } from '../components/share/studioShareUtils'
import { UserBlock } from '../components/share/UserList'
import useYjs from '../components/share/useYjs'

const { decodeRuleName } = utils

const EXAMPLE_CODE = `
# Bienvenue dans le bac à sable publicodes !
# ⚠️ Le bac à sable est utile pour expérimenter, mais : 
# - fiabilité: assurez-vous rapidement que votre code soit stocké de façon sécurisé ailleurs, par exemple sur un dépôt Github
# - sécurité: ne l'utilisez pas pour du code secret
#
# Pour en savoir plus sur le langage :
# => https://publi.codes/docs/principes-de-base
#

prix:
  avec:
    carottes: 2€/kg
    champignons: 5€/kg
    avocat: 2€/avocat

dépenses primeur:
  somme:
    - prix . carottes * 1.5 kg
    - prix . champignons * 500g
    - prix . avocat * 3 avocat
`

export default function Studio({ padName }) {
  const [layout, setLayout] = useState('split')
  const router = useRouter()
  const [name, setName] = useState(padName || generateRoomName())
  const [share, setShare] = useState()
  const [editorValue, setEditorValue] = useState(EXAMPLE_CODE)

  const debouncedEditorValue = useDebounce(editorValue, 100)

  const urlFragment = encodeURIComponent(name)

  const yjs = useYjs(urlFragment, 'database', share, setShare)

  useEffect(() => {
    if (urlFragment.length > 2) router.replace('/studio/' + urlFragment)
    //TODO refresh on first replace, to avoid
  }, [urlFragment])

  const handleShare = useCallback(() => {
    window?.navigator.clipboard.writeText(window.location.href)
  }, [window.location.href])

  const { target } = router.query
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

  const layoutModes = { code: 'Code', split: 'Partagé', view: 'Documentation' }

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

        > ul {
          background: var(--ifm-color-primary);
          padding: 0.2rem;
          display: flex;
          justify-content: center;
          list-style-type: none;
        }

        > ul > li {
          margin: 0 0.6rem;
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
      `}
    >
      <ul id="layoutButtons">
        {Object.entries(layoutModes).map(([key, value]) => (
          <li key={key} onClick={() => setLayout(key)}>
            <button className="button button--sm button--secondary">
              {value}
            </button>
          </li>
        ))}
      </ul>
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
            <input
              type="string"
              style={{ width: '16rem' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Le nom de votre document"
            />

            <button onClick={() => setName(generateRoomName())}>
              ♻️ Générer un autre nom
            </button>
          </div>
          <div>
            {yjs && (
              <UserBlock
                {...{ users: yjs.users, username: yjs.username, room: name }}
              />
            )}
          </div>

          {share && (
            <Editor
              height="75vh"
              defaultLanguage="yaml"
              defaultValue={editorValue}
              onChange={(newValue) =>
                console.log('setFromMonaco', newValue) ||
                setEditorValue(newValue ?? '')
              }
              onMount={handleEditorDidMount}
            />
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
          Documentation à placer ici
          {/*
          <ErrorBoundary key={debouncedEditorValue}>
             TODO: prévoir de changer la signature de EngineProvider

            <Documentation
              rules={debouncedEditorValue}
              onClickShare={handleShare}
              defaultTarget={defaultTarget}
              baseUrl="/studio"
            />
          </ErrorBoundary>
		  */}
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
