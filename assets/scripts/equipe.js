/**
 * Cartes de l'équipe (page Agence) et des actualités : un clic ouvre la fiche, un autre la ferme.
 *
 * v17 :
 *  - cartes utilisables au clavier (Tab, Entrée / Espace pour ouvrir, Échap pour fermer) et annoncées
 *    comme des boutons aux lecteurs d'écran ;
 *  - comme avant : un clic n'importe où sur la fiche ouverte (ou sur le fond) la referme (pas de bouton « Fermer ») ;
 *  - la page ne défile plus derrière la fiche ouverte.
 * Le HTML généré par l'outil admin (onclick="expandCard(this)") reste inchangé.
 */
(function () {

    let lastCard = null;

    function grid() { return document.getElementById('teamGrid'); }

    function closeAll(returnFocus) {
        const g = grid();
        document.querySelectorAll('.member-card.active').forEach(m => {
            m.classList.remove('active');
            m.setAttribute('aria-expanded', 'false');
            m.setAttribute('aria-label', (m.getAttribute('aria-label') || '').replace('fermer', 'ouvrir'));
        });
        if (g) g.classList.remove('has-active');
        document.body.style.overflow = '';
        if (returnFocus && lastCard) lastCard.focus({ preventScroll: true });
    }

    function open(card) {
        closeAll(false);
        card.classList.add('active');
        card.setAttribute('aria-expanded', 'true');
        const g = grid();
        if (g) g.classList.add('has-active');
        document.body.style.overflow = 'hidden';
        lastCard = card;
        const info = card.querySelector('.member-info');
        if (info) info.scrollTop = 0;
        card.setAttribute('aria-label', card.getAttribute('aria-label').replace('ouvrir', 'fermer'));
    }

    /* Appelée par l'attribut onclick des cartes (HTML généré) */
    window.expandCard = function (card, event) {
        if (event) event.stopPropagation();
        if (card.classList.contains('active')) closeAll(true);
        else open(card);
    };

    function init() {
        const g = grid();
        if (!g) return;

        g.querySelectorAll('.member-card').forEach(card => {
            const title = card.querySelector('.member-info h2');
            const name = title ? title.textContent.trim() : 'la fiche';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-expanded', 'false');
            card.setAttribute('aria-label', `${name} — ouvrir la fiche`);

            card.addEventListener('keydown', (e) => {
                if (e.target !== card) return;
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.expandCard(card); }
            });
        });

        // Comme avant : un clic n'importe où sur la fiche ouverte la referme.
        // Seuls les liens éventuels du texte gardent leur rôle de lien.
        g.addEventListener('click', (e) => {
            const card = e.target.closest('.member-card');
            if (!card || !card.classList.contains('active')) return;
            if (e.target.closest('a[href]')) { e.stopPropagation(); return; }
            e.stopPropagation();
            closeAll(true);
        }, true);

        // Clic sur le fond blanc (la grille elle-même) = fermer
        g.addEventListener('click', (e) => { if (e.target === g) closeAll(true); });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.querySelector('.member-card.active')) closeAll(true);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
