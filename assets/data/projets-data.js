/*
 * INDEX DES PROJETS (uniquement pour les tuiles de la page Projets)
 * ------------------------------------------------------------------
 * Fichier géré par l'outil admin/index.html. Le contenu détaillé de chaque projet vit dans SA PROPRE PAGE :
 *     pages/projets/<nom>.html   (créée par l'outil admin/index.html)
 *
 * Champs :
 *   id          : nom EXACT du dossier d'images dans assets/images/projets/
 *   page        : page du projet, relative à pages/  (ex. "projets/eloyes.html")
 *   cover       : image de couverture de la tuile (chemin relatif à assets/images/, ex. projets/Eloyes/photo.jpg)
 *   format      : "portrait" | "paysage"  (forme de la tuile)
 *   miseEnAvant : true → affiché en premier, en portrait (un seul conseillé)
 *   categorie   : enseignement | public | industriel | logements | prive | sante | tertiaire
 *   statut      : "en-cours" | "termine"
 */
const PROJETS = [
  {
    "id": "Eloyes",
    "page": "projets/eloyes.html",
    "titre": "Maison de santé",
    "annee": "2022",
    "categorie": "sante",
    "categorieLabel": "santé",
    "statut": "termine",
    "format": "portrait",
    "miseEnAvant": true,
    "cover": "projets/Eloyes/24-IMG_3335.JPG"
  },
  {
    "id": "Bouxieres",
    "page": "projets/bouxieres.html",
    "titre": "Groupe Scolaire Bouxières-aux-Chênes",
    "annee": "2026",
    "categorie": "enseignement",
    "categorieLabel": "enseignement",
    "statut": "termine",
    "format": "paysage",
    "miseEnAvant": false,
    "cover": "projets/Bouxieres/Bouxieres.jpg"
  },
  {
    "id": "test-add",
    "page": "projets/test-add.html",
    "titre": "Test",
    "annee": "2000",
    "categorie": "logements",
    "categorieLabel": "logements",
    "statut": "termine",
    "format": "paysage",
    "miseEnAvant": false,
    "cover": "projets/test-add/fond-d-ecran-2.jpg"
  }
];
