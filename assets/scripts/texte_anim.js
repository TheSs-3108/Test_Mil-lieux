/**
 * Effet "machine à écrire" : écrit un mot, le garde, l'efface, puis passe au suivant.
 * Respecte prefers-reduced-motion (changement de mot sans animation de frappe).
 */
(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;

    // Mots modifiables depuis l'outil admin (bloc #page-data de la page d'accueil)
    let words = ["éco-responsable,", "performante,", "bio-sourcée,", "engagée,", "durable,", "..."];
    try {
        const pd = document.getElementById('page-data');
        const m = pd && JSON.parse(pd.textContent).mots;
        if (Array.isArray(m) && m.length) words = m;
    } catch (e) { /* mots par défaut */ }

    const TYPE_DELAY   = 80;   // ms par caractère écrit
    const DELETE_DELAY = 40;   // ms par caractère effacé
    const HOLD_DELAY   = 2200; // pause mot complet
    const NEXT_DELAY   = 400;  // pause avant le mot suivant

    let wordIndex = 0;
    let charIndex = 0;
    let deleting  = false;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        el.classList.add('is-static');
        const show = () => {
            el.textContent = words[wordIndex];
            wordIndex = (wordIndex + 1) % words.length;
        };
        show();
        setInterval(show, 4000);
        return;
    }

    function tick() {
        const word = words[wordIndex];
        let delay;

        if (!deleting) {
            charIndex++;
            el.textContent = word.slice(0, charIndex);
            if (charIndex === word.length) {
                deleting = true;
                delay = HOLD_DELAY;
            } else {
                delay = TYPE_DELAY;
            }
        } else {
            charIndex--;
            el.textContent = word.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = NEXT_DELAY;
            } else {
                delay = DELETE_DELAY;
            }
        }
        setTimeout(tick, delay);
    }

    // Démarre à la fin de l'écran d'intro (s'il est affiché)
    if (document.documentElement.classList.contains('has-intro')) {
        window.addEventListener('intro:done', tick, { once: true });
    } else {
        tick();
    }
})();
