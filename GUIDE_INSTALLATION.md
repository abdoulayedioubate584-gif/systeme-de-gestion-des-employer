# Guide d'Installation et de Personnalisation

## Installation

### Version Navigateur (Simple)
1. Décompressez l'archive ZIP
2. Ouvrez `index.html` dans un navigateur moderne

### Version Desktop (Windows)
1. Téléchargez l'installateur Windows (.exe)
2. Exécutez l'installation
3. Lancez "Gestion des Employés" depuis le menu Démarrer

## Configuration Requise
- Navigateur : Chrome 80+, Firefox 75+, Edge 80+
- Version Desktop : Windows 10/11

## Personnalisation

### Modifier les Styles
Éditez `style.css` pour personnaliser l'apparence :
- Couleurs : modifiez les valeurs dans `:root`
- Police : changez `font-family` dans `body`
- Tableau : modifiez les styles dans `#listeEmployes table`

### Configurer les Salaires
Dans `fichier.js`, modifiez les constantes :
```javascript
// Bonus par rôle
const BONUS_DEVELOPPEUR = 500000;  // 500k GNF
const BONUS_DIRECTEUR = 1000000;   // 1M GNF
const BONUS_PAR_MEMBRE = 300000;   // 300k GNF par membre d'équipe
```

### Ajouter un Nouveau Rôle
1. Créez une nouvelle classe dans `fichier.js`
2. Ajoutez l'option dans le select HTML
3. Mettez à jour la logique d'import/export

Exemple :
```javascript
class ConsultantIT extends Employe {
  constructor(nom, age, baseSalaire, specialite) {
    super(nom, age, baseSalaire);
    this.specialite = specialite;
  }

  calculerSalaire() {
    return this.baseSalaire + 400000;
  }
}
```

## Support
Pour assistance technique :
- Email : [votre@email.com]
- Téléphone : [numéro]

## Licence
Voir `LICENCE_COMMERCIALE.txt` pour les conditions d'utilisation.