/*
 * RÉGLAGES DU SITE (menu, réseaux sociaux, pied de page)
 * ------------------------------------------------------
 * Fichier géré par l'outil admin/index.html (rubrique « Réglages du site »).
 * Il est lu par assets/scripts/site-shell.js qui construit, sur TOUTES les pages :
 * le menu, les icônes de réseaux sociaux, le sous-menu « Agence » et le pied de page.
 * Les liens (href) sont relatifs à la racine du site.
 */
const SITE = {
  "nom": "Mil Lieux",
  "socials": {
    "instagram": "",
    "linkedin": "",
    "facebook": ""
  },
  "footer": [
    "© 2026 MilLieux. Tous droits réservés.",
    "SHKs"
  ],
  "menu": [
    {
      "label": "Agence",
      "href": "pages/agence.html"
    },
    {
      "label": "Projets",
      "href": "pages/projet.html"
    },
    {
      "label": "Actualités",
      "href": "pages/actualite.html"
    },
    {
      "label": "Nous Contacter",
      "href": "pages/contact.html"
    }
  ],
  "sousMenuAgence": [
    {
      "label": "Présentation",
      "href": "pages/agence.html"
    },
    {
      "label": "Prix et distinctions",
      "href": "pages/prix_dist.html"
    }
  ],
  "footerLinks": [
    {
      "label": "Mentions légales",
      "href": "pages/mentions_legales.html"
    }
  ],
  "pages": []
};
