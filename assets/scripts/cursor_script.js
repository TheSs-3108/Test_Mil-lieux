/**
 * Curseur personnalisé (souris uniquement).
 * v17 : déplacé par transform (aucun recalcul de mise en page à chaque mouvement), caché tant que la souris
 * n'a pas bougé (il n'apparaît plus figé dans le coin en haut à gauche) et quand elle quitte la fenêtre.
 */
(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    let known = false;   // position de la souris connue ?

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        if (!known) { known = true; cursor.classList.add('is-visible'); }
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    document.documentElement.addEventListener('mouseenter', () => { if (known) cursor.classList.add('is-visible'); });
})();
