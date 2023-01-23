export default [
  {
    name: 'Dépenses primeur',
    code: `

meta html: 
  titre: Un petit calcul de primeurs
  image: https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bWFyY2glQzMlQTl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60
  description: |
    Une petite démonstration du langage publicodes sur un tout petit calcul de liste de courses


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

meta html: 
  titre: Mon mini DPE
  image: https://images.unsplash.com/photo-1523495909838-79c67b15be34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aGVhdGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60
  description: |
    Une petite démonstration du langage publicodes sur un tout petit modèle de diagnostic énergétique

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

meta html: 
  titre: Ma feuille de paie sur-simplifiée 
  image: https://images.unsplash.com/photo-1579170053380-58064b2dee67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80
  description: |
    Une petite démonstration du langage publicodes sur un tout petit modèle de cotisations sociales

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
