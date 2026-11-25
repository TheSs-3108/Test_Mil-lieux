/**
 * Gère l'ouverture et la fermeture des cartes (Cadres et Grande Carte)
 */
function expandCard(card, event) {
    // Empêche la propagation pour ne pas déclencher la fermeture via la grille
    if (event) event.stopPropagation();

    const grid = document.getElementById('teamGrid');
    const isActive = card.classList.contains('active');

    // 1. On ferme toutes les cartes actives avant toute chose
    document.querySelectorAll('.member-card').forEach(m => {
        m.classList.remove('active');
    });

    // 2. Si la carte n'était pas déjà active, on l'ouvre
    if (!isActive) {
        card.classList.add('active');
        grid.classList.add('has-active');
    } else {
        // Sinon, on retire l'état flou de la grille
        grid.classList.remove('has-active');
    }
}

/**
 * Fermeture globale au clic sur le fond (la grille)
 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('teamGrid');

    if (grid) {
        grid.addEventListener('click', (e) => {
            // Si on clique sur la grille elle-même (le fond flou) et non sur une carte
            if (e.target === grid) {
                document.querySelectorAll('.member-card').forEach(m => {
                    m.classList.remove('active');
                });
                grid.classList.remove('has-active');
            }
        });
    }
});