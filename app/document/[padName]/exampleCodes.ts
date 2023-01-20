export default [
  {
    name: 'Dépenses primeur',
    code: `

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
`,
  },

  {
    name: 'Diagnostic énergie',
    code: `

diagnostic:

diagnostic . énergie: 
  formule: surface * conso surfacique

surface: 
  question: Quelle est la surface de votre logement ? 
  par défaut: 70 m2

conso surfacique: 
  variations: 
    - si: âge > 100
      alors: 800 kWh/m2
    - si: âge > 70
      alors: 400 kWh/m2
    - si: âge > 30
      alors: 100 kWh/m2
    - sinon: 10 kWh/m2

âge: 
  question: Quel est l'âge de votre logement ?
  par défaut: 50 ans
`,
  },
  {
    name: 'Salaire net',
    code: `

salaire net: salaire brut - cotisations salariales

cotisations salariales:
  somme:
    - maladie
    - retraite
cotisations salariales . maladie:
  produit:
    assiette: salaire brut
    taux: 15.7%
cotisations salariales . retraite:
  produit:
    assiette: salaire brut
    taux: 13.3%

salaire brut: 2300 €/mois
`,
  },
]
