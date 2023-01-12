import Engine from 'publicodes'
import rules from './co2-fr.json'
import { DocPage } from './DocPage'

const engine = new Engine(rules)

export default function Page({ params: { dottedName } }) {
  return (
    <div>
      <h1>Ma page de doc pour {dottedName} </h1>
      <DocPage dottedName={dottedName} rules={rules} />
    </div>
  )
}
