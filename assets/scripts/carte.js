/**
 * Carte des projets (pages/carte.html) — v18.
 * - Moteur : Leaflet 1.9.4 + Leaflet.markercluster 1.5.3, hébergés dans assets/vendor/leaflet/ (open source).
 * - Fond de carte : Plan IGN (Géoplateforme, service public gratuit, sans clé), affiché en gris (carte.css).
 * - Données : PROJETS (assets/data/projets-data.js) — seuls les projets qui ont lat + lng apparaissent.
 * - Filtres : ceux de la page Projets (projet.js envoie l'évènement « projets:filtre »).
 * - Adresse directe vers un projet : carte.html?projet=<id>  (ex. carte.html?projet=Eloyes)
 */
(function () {
    const el = document.getElementById('carte');
    const fiche = document.getElementById('carte-fiche');
    const vide = document.getElementById('carte-vide');
    if (!el) return;
    if (!window.L || !L.markerClusterGroup) {
        el.innerHTML = '<p class="carte__vide">La carte n\'a pas pu se charger. <a href="projet.html">Voir les projets en mosaïque</a>.</p>';
        return;
    }

    const ROOT = document.body.dataset.root || '../';
    const IMG = ROOT + 'assets/images/';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPhone = () => window.matchMedia('(max-width: 768px), (orientation: landscape) and (max-height: 500px)').matches;
    const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const num = (v) => (v === '' || v == null || isNaN(+v)) ? null : +v;

    const all = (typeof PROJETS !== 'undefined' && Array.isArray(PROJETS) ? PROJETS : [])
        .map(p => ({ ...p, lat: num(p.lat), lng: num(p.lng) }))
        .filter(p => p.lat !== null && p.lng !== null && Math.abs(p.lat) <= 90 && Math.abs(p.lng) <= 180);

    /* ---------- carte ---------- */
    const map = L.map(el, {
        zoomControl: false,
        minZoom: 5,
        maxZoom: 18,
        zoomSnap: 0.5,
        scrollWheelZoom: true,
        zoomAnimation: !reduce,
        fadeAnimation: !reduce,
        markerZoomAnimation: !reduce
    }).setView([48.69, 6.18], 8);   // par défaut : Nancy / Lorraine

    L.control.zoom({ position: 'bottomright', zoomInTitle: 'Zoomer', zoomOutTitle: 'Dézoomer' }).addTo(map);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');

    L.tileLayer('https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
        attribution: '© <a href="https://www.ign.fr/" target="_blank" rel="noopener">IGN</a>',
        maxZoom: 18,
        maxNativeZoom: 18,
        crossOrigin: true
    }).addTo(map);

    /* ---------- épingles ---------- */
    const pin = (on) => L.divIcon({
        className: 'carte-pin' + (on ? ' is-on' : ''),
        html: '<span></span>',
        iconSize: [44, 44],          // zone de toucher de 44 px
        iconAnchor: [22, 40]         // pointe de l'épingle
    });
    const cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 48,
        spiderfyOnMaxZoom: true,
        animate: !reduce,
        iconCreateFunction: (c) => L.divIcon({
            className: 'carte-cluster',
            html: `<span>${c.getChildCount()}</span>`,
            iconSize: [44, 44]
        })
    });
    map.addLayer(cluster);

    const markers = new Map();      // id → { p, m }

    // clavier : Entrée ou Espace sur une épingle ouvre sa fiche (le focus va sur « Voir le projet »).
    // À rappeler après chaque setIcon : Leaflet remplace alors l'élément de l'épingle.
    function clavier(m, p) {
        const node = m.getElement();
        if (!node || node.dataset.kb) return;
        node.dataset.kb = '1';
        node.setAttribute('aria-label', `${p.titre}${p.lieu ? ', ' + p.lieu : ''} — ouvrir la fiche`);
        node.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); select(p.id, true); }
        });
    }
    function icone(id, on) {
        const it = markers.get(id); if (!it) return;
        it.m.setIcon(pin(on));
        clavier(it.m, it.p);
    }
    all.forEach(p => {
        const m = L.marker([p.lat, p.lng], { icon: pin(false), title: p.titre, alt: p.titre, keyboard: true, riseOnHover: true });
        if (!isPhone()) m.bindTooltip(esc(p.titre), { direction: 'top', offset: [0, -34], className: 'carte-tip' });
        m.on('click', () => select(p.id, false));
        m.on('add', () => clavier(m, p));
        markers.set(p.id, { p, m });
    });

    /* ---------- fiche du projet ---------- */
    let current = null;

    function select(id, fromKeyboard) {
        const it = markers.get(id);
        if (!it) return;
        if (current) icone(current, false);
        current = id;
        icone(id, true);
        const p = it.p;
        const src = p.cover ? IMG + (String(p.cover).includes('/') ? p.cover : `projets/${p.id}/${p.cover}`) : '';
        const href = p.page || `projets/${String(p.id).toLowerCase()}.html`;
        const meta = [p.annee, p.lieu, p.categorieLabel].filter(Boolean).map(esc).join(' · ');
        fiche.innerHTML = `
            ${src ? `<div class="carte__img"><img src="${esc(src)}" alt=""></div>` : ''}
            <div class="carte__txt">
                <h2>${esc(p.titre)}</h2>
                <p class="carte__meta">${meta}</p>
                ${p.approx ? '<p class="carte__approx">Emplacement approximatif</p>' : ''}
                <a class="carte__lien" href="${esc(href)}">Voir le projet <span aria-hidden="true">→</span></a>
            </div>
            <button type="button" class="carte__fermer" aria-label="Fermer la fiche"><span aria-hidden="true">✕</span></button>`;
        fiche.hidden = false;
        fiche.querySelector('.carte__fermer').addEventListener('click', () => close(true));
        // l'épingle ne doit pas être cachée par la fiche
        requestAnimationFrame(() => {
            const h = fiche.offsetHeight, w = fiche.offsetWidth;
            const pad = isPhone() ? { paddingTopLeft: [30, 50], paddingBottomRight: [30, h + 30] }
                                  : { paddingTopLeft: [w + 60, 60], paddingBottomRight: [80, 60] };
            cluster.zoomToShowLayer(it.m, () => map.panInside(it.m.getLatLng(), { ...pad, animate: !reduce }));
        });
        if (fromKeyboard) fiche.querySelector('.carte__lien').focus({ preventScroll: true });
    }

    function close(returnFocus) {
        if (!current) return;
        const it = markers.get(current);
        if (it) {
            icone(current, false);
            if (returnFocus && it.m.getElement()) it.m.getElement().focus({ preventScroll: true });
        }
        current = null;
        fiche.hidden = true;
        fiche.innerHTML = '';
    }

    map.on('click', () => close(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current) close(true); });

    /* ---------- filtres + cadrage ---------- */
    const filtre = { category: 'all', status: 'all' };

    function visibles() {
        return [...markers.values()].filter(({ p }) =>
            (filtre.category === 'all' || p.categorie === filtre.category) &&
            (filtre.status === 'all' || p.statut === filtre.status));
    }

    function cadrer(list, animate) {
        if (!list.length) return;
        if (list.length === 1) { map.setView(list[0].m.getLatLng(), 11, { animate }); return; }
        const b = L.latLngBounds(list.map(x => x.m.getLatLng()));
        map.fitBounds(b, { padding: isPhone() ? [40, 40] : [90, 90], maxZoom: 12, animate });
    }

    function afficher(animate) {
        const list = visibles();
        cluster.clearLayers();
        cluster.addLayers(list.map(x => x.m));
        if (current && !list.some(x => x.p.id === current)) close(false);
        vide.hidden = list.length > 0 || !all.length;
        cadrer(list, animate);
    }

    document.addEventListener('projets:filtre', (e) => {
        filtre.category = e.detail.category;
        filtre.status = e.detail.status;
        afficher(!reduce);
    });

    afficher(false);

    if (!all.length) {
        vide.hidden = false;
        vide.firstChild.textContent = 'Les projets n\'ont pas encore d\'emplacement sur la carte. ';
        const b = vide.querySelector('.projets-reset'); if (b) b.remove();
    }

    // carte.html?projet=<id> : ouvre directement ce projet
    const demande = new URLSearchParams(location.search).get('projet');
    if (demande) {
        const id = [...markers.keys()].find(k => String(k).toLowerCase() === demande.toLowerCase());
        if (id) select(id, false);
    }
})();
