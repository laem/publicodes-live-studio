import { NextApiRequest, NextApiResponse } from 'next'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
// necessary polyfill for nodejs
import ws from 'ws'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { parse } from 'yaml'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name } = req.query

    const provider = new HocuspocusProvider({
      url: 'wss://publicodes-live-server.osc-fr1.scalingo.io',
      name,
      WebSocketPolyfill: ws,
    })

    return new Promise(async (resolve) => {
      const onSynced = () => {
        const text = provider.document.getText('monacoCode')
        // HACK : how to know if empty ? Know when fully loaded ?
        provider.off('synced', onSynced)
        provider.disconnect()
        if (!text.length) {
          res.status(200).json({ name, content: null })
        } else {
          try {
            const parsed = parse(text.toJSON())
            res.status(200).json({ name, content: parsed })
          } catch (e) {
            res.status(500).json({ name, error: e })
          }
        }

        return resolve()
      }
      return provider.on('synced', onSynced)
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}
