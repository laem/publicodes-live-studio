import Link from 'next/link'

export const DocPage = ({ dottedName, evaluation, rule }) => {
  return (
    <>
      <div>{dottedName}</div>
      <div>
        <Link href="/bilan">Bilan</Link>
        <Link href="/transport/empreinte">Transport</Link>
        <Link href="/alimentation/plats/viande-1">Alimentation</Link>
      </div>
      <div>
        {evaluation.nodeValue} {evaluation.title}
      </div>
      <div>{rule && rule.description}</div>
    </>
  )
}
