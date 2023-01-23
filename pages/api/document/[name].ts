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

    // HACK : I don't know why onConnect() is run twice
    let connectFunctionFired = false

    return new Promise(async (resolve) => {
      const onConnect = () => {
        if (connectFunctionFired) return
        connectFunctionFired = true
        const text = provider.document.getText('monacoCode')
        // HACK : how to know if empty ? Know when fully loaded ?
        const timeoutFunction = setTimeout(() => {
          if (!text.length) {
            provider.off('connect', onConnect)
            provider.disconnect()
            clearTimeout(timeoutFunction)
            res.status(200).json({ name, content: null })
            return resolve()
          }
        }, 500)

        const observeFunction = (event) => {
          const content = parse(text.toJSON())

          text.unobserve(observeFunction)
          provider.off('connect', onConnect)
          provider.disconnect()
          clearTimeout(timeoutFunction)

          res.status(200).json({ name, content })
          return resolve()
        }
        return text.observe(observeFunction)
      }
      return provider.on('connect', onConnect)
    })
  } catch (error) {
    return res.status(405).json(error)
  }
}
