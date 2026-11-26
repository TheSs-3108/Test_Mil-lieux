/**
 * Page projet : diaporama automatique, flèches, miniatures et panneau « + Lire »
 * (comportement de la v04). Aucune configuration : lit le HTML de la page.
 */
(function () {
    const pp = document.querySelector('.pp');
    const track = document.getElementById('pp-track');
    const panel = document.getElementById('pp-panel');
    const readBtn = document.getElementById('pp-read');
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
        if (real > 1 && !reduceMotion && !pp.classList.contains('has-panel')) timer = setInterval(auto, AUTO_MS); // v13 : pas de défilement automatique pendant la lecture
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

    // v12 — téléphone : photos en pleine largeur sous le texte du panneau (clones des images du diaporama)
    if (panel) {
        const photos = document.createElement('div');
        photos.className = 'pp-photos';
        imgs.filter(i => !i.hasAttribute('data-clone')).forEach(i => {
            const c = document.createElement('img');
            c.src = i.getAttribute('src');
            c.alt = i.getAttribute('alt') || '';
            c.loading = 'lazy';
            photos.appendChild(c);
        });
        const thumbsBox = panel.querySelector('.pp-thumbs');
        if (real > 1 || photos.children.length) panel.insertBefore(photos, thumbsBox || null);
    }

    // Panneau « + Lire »
    function setPanel(open) {
        pp.classList.toggle('has-panel', open);
        restart();   // v13 : ouvert → diaporama arrêté (l'usager choisit la photo) ; fermé → il reprend
        panel.setAttribute('aria-hidden', String(!open));
        if (readBtn) { readBtn.textContent = open ? '- Fermer' : '+ Lire'; readBtn.setAttribute('aria-expanded', String(open)); }
    }
    readBtn?.addEventListener('click', () => setPanel(!pp.classList.contains('has-panel')));
    document.getElementById('pp-close')?.addEventListener('click', () => setPanel(false));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') setPanel(false);
        if (e.key === 'ArrowLeft') manual(cur - 1);
        if (e.key === 'ArrowRight') manual(cur + 1);
    });
    // Panneau ouvert : un clic sur le hamburger le referme (au lieu d'ouvrir le menu), comme en v04
    document.addEventListener('click', e => {
        if (!e.target.closest('.nav__hamburger') || !pp.classList.contains('has-panel')) return;
        e.preventDefault(); e.stopImmediatePropagation(); setPanel(false);
    }, true);

    setActive(0);
    restart();
})();
