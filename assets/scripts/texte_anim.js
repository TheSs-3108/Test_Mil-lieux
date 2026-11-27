/**
 * Texte de l'accueil (v14) : le mot affiché REMPLACE directement le précédent (plus d'effet « machine à écrire »).
 * Les mots sont modifiables depuis l'outil admin (bloc #page-data de la page d'accueil).
 */
(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;

    let words = ["éco-responsable,", "performante,", "bio-sourcée,", "engagée,", "durable,", "..."];
    try {
        const pd = document.getElementById('page-data');
        const m = pd && JSON.parse(pd.textContent).mots;
        if (Array.isArray(m) && m.length) words = m;
    } catch (e) { /* mots par défaut */ }

    const HOLD_MS = 6000   // durée d'affichage de chaque mot
    let i = 0;
    el.classList.add('is-static');

    function afficher() {
        el.textContent = words[i];
        i = (i + 1) % words.length;
    }
    function demarrer() {
        afficher();
        if (words.length > 1) setInterval(afficher, HOLD_MS);
    }

    // Démarre à la fin de l'écran d'intro (s'il est affiché)
    if (document.documentElement.classList.contains('has-intro')) {
        window.addEventListener('intro:done', demarrer, { once: true });
    } else {
        demarrer();
    }
})();
