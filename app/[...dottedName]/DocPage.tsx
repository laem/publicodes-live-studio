export const DocPage = ({ dottedName, evaluation, rule }) => {
  return (
    <div>
      {dottedName}
      {evaluation.nodeValue} {evaluation.title} {rule && rule.description}
    </div>
  )
}
