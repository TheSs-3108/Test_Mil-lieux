// Filtres de la page Projets (catégorie + statut)
let activeCategory = 'all';
let activeStatus = 'all';

function applyFilters() {
    document.querySelectorAll('.project-card').forEach(card => {
        const okCat = activeCategory === 'all' || card.dataset.category === activeCategory;
        const okStatus = activeStatus === 'all' || card.dataset.status === activeStatus;
        card.classList.toggle('hidden', !(okCat && okStatus));
    });
}

function setFilter(group, element) {
    document.querySelectorAll(`.dropdown-${group} .filter-item`).forEach(i => i.classList.remove('active'));
    element.classList.add('active');
    document.querySelector(`.dropdown-${group} .dropbtn`).innerText = element.innerText + ' ▾';
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); // referme le menu
}

function filterCategory(category, element) {
    activeCategory = category;
    setFilter('category', element);
    applyFilters();
}

function filterStatus(status, element) {
    activeStatus = status;
    setFilter('status', element);
    applyFilters();
}
