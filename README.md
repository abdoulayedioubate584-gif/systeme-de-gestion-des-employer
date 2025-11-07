# Gestion des Employés (Front-end)

Application front-end standalone pour gérer des employés (ajout, suppression, recherche, import/export CSV & JSON).

But: fournir une version prête à vendre aux entreprises, exécutable localement dans un navigateur, sans serveur.

Fonctionnalités principales
- Ajouter des employés (Developpeur, Manager, Directeur)
- Afficher la liste dans un tableau avec suppression
- Recherche par nom
- Importer/Exporter au format JSON et CSV
- Téléchargement d'un fichier sample
- Confirmation via modal, messages d'erreur/succès
- Persistance avec `localStorage` (stockage local du navigateur)

Comment lancer
1. Ouvrir `index.html` dans un navigateur moderne (Chrome, Edge, Firefox).
2. Utiliser le formulaire pour ajouter des employés.
3. Utiliser la barre d'outils pour importer/exporter ou supprimer tout.

Packaging / Livraison
- Vous pouvez livrer le dossier complet (HTML/CSS/JS) compressé en ZIP.
- Pour une livraison plus professionnelle, héberger sur un serveur web ou packager avec Electron pour une app desktop.

Personnalisation
- Modifier les styles dans `style.css`.
- Ajouter champs supplémentaires ou synchronisation serveur (optionnel, nécessite backend).

Licence
- Projet fourni avec licence MIT (voir `LICENSE`).

Support
- Pour demandes d'amélioration professionnelle (auth, multi-utilisateur, base de données, déploiement Docker), contactez le développeur.