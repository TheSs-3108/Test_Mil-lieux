/**
 * Éléments communs à toutes les pages : curseur, barre de navigation + logo, menu,
 * icônes de réseaux sociaux, sous-menu « Agence » et pied de page.
 * Les données viennent de assets/data/site-data.js (modifiable depuis l'outil admin).
 *
 * Attributs lus sur <body> :
 *   data-root="../"        chemin relatif vers la racine du site (obligatoire)
 *   data-submenu="agence"  affiche le sous-menu Agence
 *   data-footer="off"      pas de pied de page (pages plein écran)
 */
(function () {
    const body = document.body;
    const root = body.dataset.root || '';
    const DEFAULT = {
        footer: ['© 2026 MilLieux. Tous droits réservés.'],
        socials: { instagram: '', linkedin: '', facebook: '' },
        menu: [
            { label: 'Agence', href: 'pages/agence.html' },
            { label: 'Projets', href: 'pages/projet.html' },
            { label: 'Actualités', href: 'pages/actualite.html' },
            { label: 'Nous Contacter', href: 'pages/contact.html' }
        ],
        sousMenuAgence: []
    };
    const S = (typeof SITE !== 'undefined' && SITE) ? SITE : DEFAULT;
    const here = decodeURIComponent(location.pathname.replace(/\\/g, '/'));

    const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const matches = (href) => !!href && here.endsWith('/' + href.split('#')[0]);
    const sous = S.sousMenuAgence || [];
    const inSous = sous.some(i => matches(i.href));

    function isActive(item, index) {
        if (matches(item.href)) return true;
        if (item.href === 'pages/projet.html' && (here.indexOf('/pages/projets/') !== -1 || here.endsWith('/pages/carte.html'))) return true;   // v18 : la carte fait partie des Projets
        // « Agence » reste actif sur Équipe, Prix et distinctions, etc.
        if (inSous && sous.length && item.href === sous[0].href) return true;
        return false;
    }

    // --- Curseur personnalisé
    if (!document.querySelector('.custom-cursor')) {
        const c = document.createElement('div');
        c.className = 'custom-cursor';
        body.insertBefore(c, body.firstChild);
    }

    // --- Navigation, menu, sous-menu
    // v17 : une icône n'est affichée que si son adresse est renseignée (plus de liens morts « # »)
    const social = [
        ['instagram', 'Instagram', 'fa-instagram'],
        ['linkedin', 'LinkedIn', 'fa-linkedin-in'],
        ['facebook', 'Facebook', 'fa-facebook-f']
    ].filter(([k]) => S.socials && S.socials[k])
     .map(([k, label, icon]) =>
        `<a href="${esc(S.socials[k])}" target="_blank" rel="noopener" aria-label="${label} (nouvel onglet)" title="${label}"><i class="fab ${icon}" aria-hidden="true"></i></a>`
    ).join(' ');

    const links = (S.menu || DEFAULT.menu).map((it, i) =>
        `<a href="${esc(root + it.href)}" class="nav__link${isActive(it, i) ? ' is-active' : ''}"${isActive(it, i) ? ' aria-current="page"' : ''}>${esc(it.label)}</a>`).join('\n        ');

    let html = `
    <header class="nav nav--transparent">
        <a href="${esc(root)}home.html" class="nav__logo" aria-label="${esc(S.nom || 'Accueil')} — accueil"><img src="${esc(root)}assets/images/Logo/millieux-transp.png" alt="${esc(S.nom || '')}"></a>
        <button class="nav__hamburger" type="button" aria-label="Ouvrir le menu" aria-controls="site-menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </button>
    </header>
    <nav class="nav__menu" id="site-menu" aria-label="Menu principal">
        <button class="nav__close" type="button" aria-label="Fermer le menu">✕</button>
        ${links}
        ${social ? `<div class="nav__social">
            ${social}
        </div>` : ''}
    </nav>`;

    if (body.dataset.submenu === 'agence' && sous.length) {
        html += `
    <ul class="sous-menu" aria-label="Rubriques de l'agence">
        ${sous.map(it => `<li><a href="${esc(root + it.href)}" class="nav-link${matches(it.href) ? ' active' : ''}"${matches(it.href) ? ' aria-current="page"' : ''}>${esc(it.label)}</a></li>`).join('\n        ')}
    </ul>`;
    }
    // v17 — lien « Aller au contenu » (clavier) : cible = contenu principal de la page
    const main = document.querySelector('main, .pp, #gallery, .slider');
    if (main) {
        if (!main.id) main.id = 'contenu';
        if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
        html = `<a class="skip-link" href="#${main.id}">Aller au contenu</a>` + html;
    }

    // v17 — icône d'onglet (favicon) : le logo, si la page n'en déclare pas
    if (!document.querySelector('link[rel~="icon"]')) {
        const ic = document.createElement('link');
        ic.rel = 'icon';
        ic.type = 'image/png';
        ic.href = root + 'assets/images/Logo/millieux-transp.png';
        document.head.appendChild(ic);
    }

    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const cursor = body.querySelector('.custom-cursor');
    body.insertBefore(tpl.content, cursor ? cursor.nextSibling : body.firstChild);

    // --- Pied de page
    if (body.dataset.footer !== 'off') {
        const f = document.createElement('footer');
        const fl = (S.footerLinks || []).map(it => `<a href="${esc(root + it.href)}">${esc(it.label)}</a>`).join(' · ');
        f.innerHTML = '<div class="copyright">' + (S.footer || DEFAULT.footer).map(l => `<p>${esc(l)}</p>`).join('')
            + (fl ? `<p class="copyright__links">${fl}</p>` : '') + '</div>';
        body.appendChild(f);
    }
})();
