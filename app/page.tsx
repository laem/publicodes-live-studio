'use client'
import Link from 'next/link'
import { useState } from 'react'
import { generateRoomName } from './document/[padName]/studioShareUtils'

export default function Page() {
  const [name, setName] = useState(generateRoomName())
  return (
    <div>
      <p>
        Bienvenu sur le studio publicodes live. Il vous permet de collaborer en
        temps réel sur un document partagé, stocké sur nos serveurs.
      </p>
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
      <Link href={'/document/' + name}>C'est parti !</Link>
    </div>
  )
}
