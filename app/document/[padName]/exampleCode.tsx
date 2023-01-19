export default `
# Bienvenue dans le bac à sable publicodes !
# ⚠️ Le bac à sable est utile pour expérimenter, mais : 
# - fiabilité: assurez-vous rapidement que votre code soit stocké de façon sécurisé ailleurs, par exemple sur un dépôt Github
# - sécurité: ne l'utilisez pas pour du code secret
#
# Pour en savoir plus sur le langage :
# => https://publi.codes/docs/principes-de-base
#

prix:
  avec:
    carottes: 2€/kg
    champignons: 5€/kg
    avocat: 2€/avocat

dépenses primeur:
  somme:
    - prix . carottes * 1.5 kg
    - prix . champignons * 500g
    - prix . avocat * 3 avocat
`
