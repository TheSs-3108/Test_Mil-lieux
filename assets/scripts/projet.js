/**
 * Filtres de la page Projets (catégorie + statut).
 * v17 : vrais boutons (clavier, lecteurs d'écran), menu ouvert au clic / au toucher (et au survol avec une
 * souris), fermeture par Échap ou clic ailleurs, message + bouton quand aucun projet ne correspond.
 */
(function () {
    const state = { category: 'all', status: 'all' };
    const dropdowns = [...document.querySelectorAll('.filters-bar .dropdown')];
    if (!dropdowns.length) return;

    function setOpen(dd, open) {
        dd.classList.toggle('is-open', open);
        const btn = dd.querySelector('.dropbtn');
        if (btn) btn.setAttribute('aria-expanded', String(open));
    }
    const closeAll = (except) => dropdowns.forEach(d => { if (d !== except) setOpen(d, false); });

    function apply() {
        // v18 : les filtres servent aussi à la page Carte (carte.js écoute cet évènement)
        document.dispatchEvent(new CustomEvent('projets:filtre', { detail: { category: state.category, status: state.status } }));
        const gallery = document.getElementById('gallery');
        if (!gallery) return;
        let visible = 0;
        gallery.querySelectorAll('.project-card').forEach(card => {
            const ok = (state.category === 'all' || card.dataset.category === state.category)
                    && (state.status === 'all' || card.dataset.status === state.status);
            card.classList.toggle('hidden', !ok);
            if (ok) visible++;
        });
        let empty = gallery.querySelector('.projets-empty--filter');
        if (!visible && gallery.querySelector('.project-card')) {
            if (!empty) {
                empty = document.createElement('p');
                empty.className = 'projets-empty projets-empty--filter';
                empty.setAttribute('role', 'status');
                empty.textContent = 'Aucun projet ne correspond à ces filtres.';
                const reset = document.createElement('button');
                reset.type = 'button';
                reset.className = 'projets-reset';
                reset.textContent = 'Voir tous les projets';
                empty.appendChild(reset);
                gallery.appendChild(empty);
            }
        } else if (empty) {
            empty.remove();
        }
    }

    function choose(dd, item, keepFocus) {
        const group = dd.dataset.group;
        state[group] = item.dataset.value;
        dd.querySelectorAll('.filter-item').forEach(i => {
            const on = i === item;
            i.classList.toggle('active', on);
            i.setAttribute('aria-pressed', String(on));
        });
        const btn = dd.querySelector('.dropbtn');
        const label = item.dataset.value === 'all' ? (group === 'category' ? 'Catégories' : 'Statut') : item.textContent;
        btn.textContent = label + ' ▾';
        setOpen(dd, false);
        dd.classList.add('hover-off');       // la souris est encore dessus : on ne rouvre pas au survol tant qu'elle n'est pas sortie
        if (keepFocus) btn.focus({ preventScroll: true });
        apply();
    }

    dropdowns.forEach(dd => {
        const btn = dd.querySelector('.dropbtn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = !dd.classList.contains('is-open');
            closeAll(dd);
            setOpen(dd, open);
        });
        dd.querySelectorAll('.filter-item').forEach(item =>
            item.addEventListener('click', (e) => { e.stopPropagation(); choose(dd, item, true); }));
        // flèches haut / bas : se déplacer dans la liste
        dd.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
            const items = [...dd.querySelectorAll('.filter-item')];
            e.preventDefault();
            if (!dd.classList.contains('is-open')) setOpen(dd, true);
            const i = items.indexOf(document.activeElement);
            const next = i === -1 ? items.findIndex(x => x.classList.contains('active'))
                                  : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
            items[next].focus();
        });
        // la souris quitte le menu : il se referme (même s'il a été ouvert au clic)
        dd.addEventListener('mouseleave', () => {
            dd.classList.remove('hover-off');
            if (window.matchMedia('(hover: hover)').matches) setOpen(dd, false);
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.projets-reset')) {
            dropdowns.forEach(dd => choose(dd, dd.querySelector('.filter-item[data-value="all"]'), false));
            return;
        }
        if (!e.target.closest('.dropdown')) closeAll();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const open = dropdowns.find(d => d.classList.contains('is-open'));
        if (open) { setOpen(open, false); open.querySelector('.dropbtn').focus(); }
    });
    // Tab hors d'un menu ouvert : il se referme
    document.addEventListener('focusin', (e) => {
        dropdowns.forEach(d => { if (d.classList.contains('is-open') && !d.contains(e.target)) setOpen(d, false); });
    });
})();
