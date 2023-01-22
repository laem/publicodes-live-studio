import { NextApiRequest, NextApiResponse } from 'next'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
// necessary polyfill for nodejs
import ws from 'ws'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { parse } from 'yaml'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query

  const provider = new HocuspocusProvider({
    url: 'wss://publicodes-live-server.osc-fr1.scalingo.io',
    name,
    WebSocketPolyfill: ws,
  })

  provider.on('status', (event) => {
    if (event.status === 'connected') {
      const text = provider.document.getText('monacoCode')
      const observeFunction = (event) => {
        res.status(200).json({ name, content: parse(text.toJSON()) })
        provider.disconnect()

        text.unobserve(observeFunction)
      }
      text.observe(observeFunction)
    }
  })
}
