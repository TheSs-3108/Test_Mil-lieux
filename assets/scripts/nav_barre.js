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
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768 &&
            !e.target.closest('.nav') &&
            !e.target.closest('.nav__menu')) {
            closeMenu();
        }
    });

})();