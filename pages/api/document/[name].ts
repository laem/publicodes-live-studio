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

    const onStatus = (event) => {
      if (event.status === 'connected') {
        const text = provider.document.getText('monacoCode')
        // HACK : how to know if empty ? Know when fully loaded ?
        setTimeout(() => {
          if (!text.length) return res.status(200).json({ name, content: null })
        }, 500)
        const observeFunction = (event) => {
          const content = parse(text.toJSON())

          text.unobserve(observeFunction)
          provider.off('status', onStatus)
          provider.disconnect()

          return res.status(200).json({ name, content })
        }
        return text.observe(observeFunction)
      } else {
        return null
      }
    }

    provider.on('status', onStatus)
  } catch (error) {
    return res.status(405).json(error)
  }
}
