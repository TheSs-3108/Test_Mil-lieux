/**
 * Construit la grille de tuiles à partir de PROJETS (assets/data/projets-data.js).
 * Chaque tuile est un simple lien vers la page indépendante du projet.
 */
(function () {
    const IMG_ROOT = '../assets/images/';

    function esc(str) {
        return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    function buildTile(p) {
        const format = p.miseEnAvant ? 'portrait' : (p.format === 'portrait' ? 'portrait' : 'paysage');
        const cls = `project-card tile tile--${format}${p.miseEnAvant ? ' tile--featured' : ''}`;
        const href = p.page || `projets/${String(p.id).toLowerCase()}.html`;
        // cover = chemin relatif à assets/images/ (ex. "projets/eloyes/photo.jpg") ; ancien format : simple nom de fichier du dossier id
        const src = IMG_ROOT + (String(p.cover).indexOf('/') !== -1 ? p.cover : `projets/${p.id}/${p.cover}`);
        return `
        <a class="${cls}" href="${esc(href)}" data-category="${esc(p.categorie)}" data-status="${esc(p.statut)}">
            <img src="${esc(src)}" alt="${esc(p.titre)}" loading="lazy">
            <div class="tile-caption">
                <span class="tile-title">${esc(p.titre)}</span>
                <span class="tile-meta">${esc(p.annee)} · ${esc(p.categorieLabel)}</span>
            </div>
        </a>`;
    }

    function load() {
        const gallery = document.getElementById('gallery');
        if (!gallery) return;
        if (typeof PROJETS === 'undefined' || !Array.isArray(PROJETS) || PROJETS.length === 0) {
            gallery.innerHTML = '<p class="projets-empty">Aucun projet à afficher pour le moment.</p>';
            return;
        }
        // Projet mis en avant d'abord (tri stable : sinon ordre du fichier)
        const ordered = [...PROJETS].sort((a, b) => (b.miseEnAvant ? 1 : 0) - (a.miseEnAvant ? 1 : 0));
        gallery.innerHTML = ordered.map(buildTile).join('');
    }

    document.addEventListener('DOMContentLoaded', load);
})();
