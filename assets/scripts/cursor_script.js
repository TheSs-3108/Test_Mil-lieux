(function () {
    // Aucun curseur sur tactile
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    // Suivi de la souris
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    });

    // Masque le curseur si la souris quitte la fenêtre
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

})();