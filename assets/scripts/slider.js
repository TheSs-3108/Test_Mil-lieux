/**
 * Diaporama de l'accueil — v18 : FONDU ENCHAÎNÉ (pas de glissement). La photo suivante apparaît en fondu
 * au-dessus de la précédente, qui reste visible dessous (.is-prev) jusqu'à la fin du fondu.
 * Durée du fondu : --fondu dans slider.css ; temps d'affichage de chaque photo : AFFICHAGE_MS ci-dessous.
 * Les images marquées aria-hidden (copie de la 1re, héritée de l'ancien défilement) sont ignorées.
 */
(function () {
    const track = document.getElementById('slider-track');
    if (!track) return;
    const images = [...track.querySelectorAll('img')].filter(i => i.getAttribute('aria-hidden') !== 'true');
    if (!images.length) return;

    let index = 0;
    // 1re photo : affichée tout de suite (pas de fondu au chargement de la page)
    images[0].style.transition = 'none';
    images[0].classList.add('is-active');
    void images[0].offsetWidth;
    images[0].style.transition = '';
    if (images.length < 2) return;

    const AFFICHAGE_MS = 6000;          // durée d'affichage d'une photo (fondu compris)
    let nettoyage = null;

    function suivante() {
        const avant = images[index];
        index = (index + 1) % images.length;
        const apres = images[index];
        // une photo pas encore chargée ne doit pas apparaître en fondu « vide » : on attend le prochain tour
        if (!apres.complete || !apres.naturalWidth) { index = (index - 1 + images.length) % images.length; return; }
        clearTimeout(nettoyage);
        images.forEach(i => { if (i !== avant) i.classList.remove('is-prev'); });
        avant.classList.remove('is-active');
        avant.classList.add('is-prev');          // reste visible dessous pendant le fondu
        apres.classList.add('is-active');        // apparaît en fondu par-dessus
        const duree = parseFloat(getComputedStyle(apres).transitionDuration) * 1000 || 0;
        nettoyage = setTimeout(() => avant.classList.remove('is-prev'), duree + 50);
    }

    // Démarre à la fin de l'écran d'intro (s'il est affiché)
    let timer = null;
    const startSlider = () => { clearInterval(timer); timer = setInterval(suivante, AFFICHAGE_MS); };
    // v17 : pause quand l'onglet n'est pas visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { clearInterval(timer); timer = null; }
        else if (!document.documentElement.classList.contains('has-intro')) startSlider();
    });
    if (document.documentElement.classList.contains('has-intro')) {
        window.addEventListener('intro:done', startSlider, { once: true });
    } else {
        startSlider();
    }
})();
