import Engine from 'publicodes'
import rules from './co2-fr.json'
import { DocPage } from './DocPage'
import { utils } from 'publicodes'

const engine = new Engine(rules)

export default function Page({ params: { dottedName: encodedDottedName } }) {
  const dottedName = encodedDottedName
    .map((el) => utils.decodeRuleName(decodeURIComponent(el)))
    .join(' . ')
  const evaluation = engine.evaluate(dottedName)

  return (
    <div>
      <h1>Ma page de doc pour {dottedName} </h1>
      <DocPage
        dottedName={dottedName}
        evaluation={evaluation}
        rule={rules[dottedName]}
      />
    </div>
  )
}

export async function generateStaticParams() {
  const results = Object.keys(rules).map((dottedName) => ({
    dottedName: dottedName.split(' . ').map((el) => utils.encodeRuleName(el)),
  }))
  return results
}
