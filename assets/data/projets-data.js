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
 *   lieu        : commune affichée sur la carte, ex. "Éloyes (88)"                       — v18, facultatif
 *   lat, lng    : coordonnées GPS de l'épingle (degrés décimaux), ex. 48.0950 / 6.6040      — v18, facultatif
 *                 (sans coordonnées, le projet n'apparaît pas sur la carte, seulement dans la mosaïque)
 *   approx      : true = emplacement approximatif (coordonnées arrondies à ~1 km, ex. maison de particulier)
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
    "cover": "projets/Eloyes/24-IMG_3335.JPG",
    "lieu": "Éloyes (88)",
    "lat": 48.095,
    "lng": 6.604,
    "approx": true
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
    "cover": "projets/Bouxieres/Bouxieres.jpg",
    "lieu": "Bouxières-aux-Chênes (54)",
    "lat": 48.7706,
    "lng": 6.2672,
    "approx": true
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
    "cover": "projets/test-add/fond-d-ecran-2.jpg",
    "lieu": "Paris",
    "lat": 48.8549,
    "lng": 2.33528
  }
];
