import { NextApiRequest, NextApiResponse } from 'next'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
// necessary polyfill for nodejs
import ws from 'ws'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query

  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider(
    'wss://publicodes-live-server.osc-fr1.scalingo.io',
    name,
    ydoc,
    { WebSocketPolyfill: ws }
  )

  provider.on('status', (event) => {
    if (event.status === 'connected') {
      const text = ydoc.getText('monacoCode')
      const observeFunction = (event) => {
        res.status(200).json({ name, content: text.toJSON() })
        provider.disconnect()

        text.unobserve(observeFunction)
      }
      text.observe(observeFunction)
    }
  })
}
