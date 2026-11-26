(function () {

    const hamburger = document.querySelector('.nav__hamburger');
    const menu      = document.querySelector('.nav__menu');
    const closeBtn  = document.querySelector('.nav__close');

    if (!hamburger || !menu) {
        console.warn('nav_barre.js : .nav__hamburger ou .nav__menu introuvable dans le DOM.');
        return;
    }

    function openMenu() {
        menu.classList.add('is-open');
        hamburger.classList.add('is-open');
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMenu() {
        menu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        const isOpen = menu.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    });

    // Bouton de fermeture (croix, visible sur mobile)
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // Fermeture au clic sur un lien
    menu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fermeture au clic en dehors (desktop uniquement)
    // + v12 : sur la page d'accueil (ordinateur), un clic au centre de l'écran ouvre le menu
    //   (zone centrale = 50 % de la largeur × 60 % de la hauteur, hors bandeau du bas).
    const isHome = !!document.querySelector('.slider');
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) return;
        if (e.target.closest('.nav') || e.target.closest('.nav__menu')) return;
        if (menu.classList.contains('is-open')) { closeMenu(); return; }
        if (!isHome || !window.matchMedia('(pointer: fine)').matches) return; // pas au toucher (smartphone en paysage)
        const x = e.clientX / window.innerWidth, y = e.clientY / window.innerHeight;
        if (x > 0.25 && x < 0.75 && y > 0.2 && y < 0.8) openMenu();
    });

})();