/**
 * Page projet (v14) : diaporama automatique + zones cliquables, suite de la page (texte, informations,
 * toutes les photos) qui défile, flèche retour vers la liste des projets. Aucune configuration : lit le HTML de la page.
 */
(function () {
    const pp = document.querySelector('.pp');
    const track = document.getElementById('pp-track');
    if (!pp || !track) return;

    const imgs = [...track.querySelectorAll('img')];
    const total = imgs.length;                                   // avec le clone éventuel
    const real = imgs.filter(i => !i.hasAttribute('data-clone')).length;
    const thumbs = [...document.querySelectorAll('.pp-thumbs .thumb')];
    const slideW = 100 / total;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTO_MS = 7000, AUTO_ANIM = 2000, MANUAL_ANIM = 600;

    let cur = 0, timer = null, resetTimer = null;

    track.style.width = `${total * 100}%`;
    imgs.forEach(i => { i.style.flex = `0 0 ${slideW}%`; i.style.width = `${slideW}%`; });
    if (real < 2) pp.classList.add('is-single');

    function setActive(n) {
        cur = ((n % real) + real) % real;
        thumbs.forEach((t, i) => t.classList.toggle('active', i === cur));
    }
    function show(n, ms) {
        track.style.transition = `transform ${ms}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        track.style.transform = `translateX(-${n * slideW}%)`;
    }
    function snapToStart() {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        void track.offsetWidth;
    }
    function cancelReset() {
        if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; snapToStart(); }
    }

    function auto() {                       // avance d'une image, boucle via le clone
        const n = cur + 1;
        show(n, AUTO_ANIM);
        setActive(n);
        if (n === real) {
            resetTimer = setTimeout(() => { resetTimer = null; snapToStart(); }, AUTO_ANIM);
        }
    }
    function manual(n) {
        cancelReset();
        setActive(n);
        show(cur, MANUAL_ANIM);
        restart();
    }
    function restart() {
        clearInterval(timer);
        if (real > 1 && !reduceMotion) timer = setInterval(auto, AUTO_MS);
    }

    document.querySelector('.pp-prev')?.addEventListener('click', () => manual(cur - 1));
    document.querySelector('.pp-next')?.addEventListener('click', () => manual(cur + 1));
    thumbs.forEach((t, i) => t.addEventListener('click', () => manual(i)));

    // Balayage tactile
    let x0 = null;
    const stage = document.querySelector('.pp-stage');
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
        if (x0 === null || real < 2) return;
        const dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) manual(cur + (dx < 0 ? 1 : -1));
    });

    // v14 — flèche retour : la flèche (ex-hamburger) ramène à la liste des projets ; libellé « Tous les projets » à sa gauche
    const back = new URL('../projet.html', location.href).href;
    const nav = document.querySelector('.nav');
    if (nav && !nav.querySelector('.nav__backlabel')) {
        const l = document.createElement('a');
        l.className = 'nav__backlabel';
        l.href = back;
        l.textContent = 'Tous les projets';
        nav.appendChild(l);
    }
    document.addEventListener('click', e => {
        const h = e.target.closest('.nav__hamburger');
        if (!h) return;
        e.preventDefault(); e.stopImmediatePropagation();
        location.href = back;
    }, true);
    const hb = document.querySelector('.nav__hamburger');
    if (hb) {
        hb.setAttribute('aria-label', 'Retour à tous les projets');
        hb.removeAttribute('aria-expanded');          // v17 : ici ce n'est pas un menu, c'est un lien retour
        hb.removeAttribute('aria-controls');
    }

    // v17 — bouton « retour en haut » : apparaît une fois le 1er écran (diaporama) dépassé
    const top = document.createElement('button');
    top.type = 'button';
    top.className = 'pp-top';
    top.setAttribute('aria-label', 'Revenir en haut de la page');
    top.title = 'Haut de page';
    top.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        top.blur();
    });
    document.body.appendChild(top);
    const first = document.querySelector('.pp-first');

    // le chevron « voir la suite » s'efface dès qu'on défile ; le bouton « haut » apparaît après le 1er écran
    const onScroll = () => {
        pp.classList.toggle('is-scrolled', window.scrollY > 40);
        const limit = (first ? first.offsetHeight : window.innerHeight) * 0.8;
        top.classList.toggle('is-visible', window.scrollY > limit);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    document.addEventListener('keydown', e => {
        if (real < 2 || e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], video, .plyr')) return;  // les flèches servent au lecteur vidéo
        if (e.key === 'ArrowLeft') manual(cur - 1);
        if (e.key === 'ArrowRight') manual(cur + 1);
    });

    // v17 : diaporama en pause quand l'onglet n'est pas visible (économie de batterie, pas de saut au retour)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { clearInterval(timer); timer = null; } else restart();
    });

    setActive(0);
    restart();

    // v18 — « Voir sur la carte » : affiché sous la catégorie si le projet a un emplacement dans projets-data.js.
    // Le fichier de données est chargé ici (balise script : marche aussi en double-clic), aucune page à régénérer.
    (function lienCarte() {
        const zone = document.querySelector('.pp-bar__right');
        if (!zone) return;
        const root = document.body.dataset.root || '../../';
        const ajouter = () => {
            if (typeof PROJETS === 'undefined' || !Array.isArray(PROJETS)) return;
            const ici = decodeURIComponent(location.pathname);
            const p = PROJETS.find(x => x.page && ici.endsWith('/pages/' + x.page));
            const ok = p && p.lat !== '' && p.lat != null && p.lng !== '' && p.lng != null && isFinite(+p.lat) && isFinite(+p.lng);
            if (!ok || zone.querySelector('.pp-carte')) return;
            const a = document.createElement('a');
            a.className = 'pp-carte';
            a.href = `${root}pages/carte.html?projet=${encodeURIComponent(p.id)}`;
            a.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.3" fill="currentColor"/></svg>'
                + `<span>Voir sur la carte</span>`;
            if (p.lieu) a.setAttribute('aria-label', `Voir sur la carte — ${p.lieu}`);
            zone.appendChild(a);
        };
        if (typeof PROJETS !== 'undefined') return ajouter();
        const s = document.createElement('script');
        s.src = root + 'assets/data/projets-data.js';
        s.onload = ajouter;
        document.body.appendChild(s);
    })();
})();
