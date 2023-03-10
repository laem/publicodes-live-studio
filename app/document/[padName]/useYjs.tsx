'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { generateFruitName, stringToColour } from './studioShareUtils'
import useLocalStorageState from 'use-local-storage-state'
import { IndexeddbPersistence } from 'y-indexeddb'
import { HocuspocusProvider } from '@hocuspocus/provider'

localStorage.log = 'y-webrtc'

export default (room, connectionType: 'p2p' | 'database', share, setShare) => {
  const [data, setData] = useState([])
  const [users, setUsers] = useState([])

  const [username, setUsername] = useLocalStorageState('shareUserId', {
    defaultValue: null,
  })

  useEffect(() => {
    if (!username) {
      console.log('no username, will set new one')
      setUsername(generateFruitName())
    }
    return
  }, [username])

  useEffect(() => {
    if (!username || (!room && !share)) return
    if (!share) {
      let ydoc, provider

      const persistence = null //new IndexeddbPersistence(room, ydoc)
      if (connectionType === 'p2p') {
        ydoc = new Y.Doc()
        provider = new WebrtcProvider(room, ydoc, {})
      } else {
        provider = new HocuspocusProvider({
          //url: 'ws://localhost:1234',
          url: 'wss://publicodes-live-server.osc-fr1.scalingo.io',
          name: room,
        })

        ydoc = provider.document
      }

      provider.on('status', (event) => {
        console.log('YJS provider log status', event.status) // logs "connected" or "disconnected"
      })

      setShare({ room, ydoc, provider, persistence })
    } else {
      const { room } = share

      const ydoc = share.ydoc,
        provider = share.provider

      const awareness = provider.awareness

      setUsers(
        Array.from(awareness.getStates().entries()).map(([k, v]) => ({
          id: k,
          ...v,
        }))
      )

      // You can observe when a any user updated their awareness information
      awareness.on('change', (changes) => {
        // Whenever somebody updates their awareness information,
        // we log all awareness information from all users.

        setUsers(
          Array.from(awareness.getStates().entries()).map(([k, v]) => ({
            id: k,
            ...v,
          }))
        )
      })

      awareness.setLocalState({
        // Define a print name that should be displayed
        name: username,
        // Define a color that should be associated to the user:
        color: stringToColour(username), // should be a hex color
      })
      return
      const dataDoc = share.ydoc.get('data', Y.Text)
      setData(dataDoc.toJSON())
      dataDoc.observe((event) => {
        console.log('did observe from Conf', event)
        setData(dataDoc.toJSON())
      })
    }
    return
  }, [room, share, username])
  if (!room && !share) return {}

  return { users, data, username }
}
