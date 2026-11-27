/**
 * Menu principal (hamburger).
 * v17 : état annoncé aux lecteurs d'écran (aria-expanded), touche Échap pour fermer, focus placé sur le
 * premier lien à l'ouverture puis rendu au hamburger à la fermeture. Comportements v10–v12 inchangés
 * (fermeture au clic extérieur sur ordinateur, clic au centre de l'accueil pour ouvrir).
 */
(function () {

    const hamburger = document.querySelector('.nav__hamburger');
    const menu      = document.querySelector('.nav__menu');
    const closeBtn  = document.querySelector('.nav__close');

    if (!hamburger || !menu) {
        console.warn('nav_barre.js : .nav__hamburger ou .nav__menu introuvable dans le DOM.');
        return;
    }

    const isPhone = () => window.matchMedia('(max-width: 768px), (orientation: landscape) and (max-height: 500px)').matches;
    const isOpen = () => menu.classList.contains('is-open');

    function openMenu() {
        menu.classList.add('is-open');
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Fermer le menu');
        if (isPhone()) document.body.style.overflow = 'hidden';
        // focus sur le 1er lien une fois le menu visible (transition d'opacité)
        const first = menu.querySelector('.nav__link');
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    }

    function closeMenu(returnFocus) {
        if (!isOpen()) return;
        menu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Ouvrir le menu');
        document.body.style.overflow = '';
        if (returnFocus) hamburger.focus({ preventScroll: true });
    }

    hamburger.addEventListener('click', () => (isOpen() ? closeMenu(true) : openMenu()));
    if (closeBtn) closeBtn.addEventListener('click', () => closeMenu(true));
    menu.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', () => closeMenu(false)));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) closeMenu(true);
    });

    // Fermeture au clic en dehors (ordinateur)
    // + v12 : sur la page d'accueil (souris), un clic au centre de l'écran ouvre le menu
    //   (zone centrale = 50 % de la largeur × 60 % de la hauteur).
    const isHome = !!document.querySelector('.slider');
    document.addEventListener('click', (e) => {
        if (isPhone()) return;
        if (e.target.closest('.nav') || e.target.closest('.nav__menu')) return;
        if (isOpen()) { closeMenu(false); return; }
        if (!isHome || !window.matchMedia('(pointer: fine)').matches) return; // pas au toucher
        const x = e.clientX / window.innerWidth, y = e.clientY / window.innerHeight;
        if (x > 0.25 && x < 0.75 && y > 0.2 && y < 0.8) openMenu();
    });

    // Le menu « téléphone » bloque le défilement : on le libère si l'écran s'élargit menu ouvert
    window.addEventListener('resize', () => { if (isOpen() && !isPhone()) document.body.style.overflow = ''; });

})();
