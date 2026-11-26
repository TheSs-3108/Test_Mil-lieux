/**
 * Écran d'introduction : joué une fois par session de navigation (page d'accueil).
 * - Pour le revoir : fermer l'onglet puis rouvrir le site, ou ajouter ?intro à l'adresse.
 * - Déclenche l'évènement "intro:done" (le diaporama et le texte animé attendent la fin).
 * Le masquage visuel est assuré par CSS (intro.css) ; ce script nettoie et prévient.
 */
(function () {
    const root = document.documentElement;
    const el = document.getElementById('intro');
    if (!el || !root.classList.contains('has-intro')) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = reduce ? 1800 : 4200;

    try { sessionStorage.setItem('ml-intro', '1'); } catch (e) { /* navigation privée : on rejouera */ }

    setTimeout(() => {
        root.classList.remove('has-intro');
        el.remove();
        window.dispatchEvent(new Event('intro:done'));
    }, DURATION);
})();
