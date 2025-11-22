/**
 * ============================================================
 * ROUTING UTILITIES - GitHub Pages Navigation
 * ============================================================
 */

export function getCurrentPage() {
    const path = window.location.pathname.replace(/\/$/, '');
    const filename = path.split('/').pop() || 'index.html';

    if (filename === '' || filename === 'index.html') return 'index';
    if (filename === 'calculadora.html') return 'calculadora';
    if (filename === 'mis-servants.html') return 'mis-servants';
    if (filename === 'fgodle.html') return 'fgodle';
    if (filename === 'tierlist.html') return 'tierlist';

    return 'index';
}

export function updateActiveNavLink(currentPage) {
    document.querySelectorAll('.sidebar_index a').forEach(link => link.classList.remove('active'));
    
    const pageToFile = {
        'index': 'index.html',
        'calculadora': 'calculadora.html',
        'mis-servants': 'mis-servants.html',
        'fgodle': 'fgodle.html',
        'tierlist': 'tierlist.html'
    };
    
    const targetFile = pageToFile[currentPage];
    const activeLink = document.querySelector(`.sidebar_index a[href$="${targetFile}"]`);
    if (activeLink) activeLink.classList.add('active');
}

export function navigateTo(page) {
    const routes = {
        'index': 'index.html',
        'calculadora': 'calculadora.html',
        'mis-servants': 'mis-servants.html',
        'fgodle': 'fgodle.html',
        'tierlist': 'tierlist.html'
    };

    if (routes[page]) {
        window.location.href = routes[page];
    } else {
        console.error(`Pagina no encontrada: ${page}`);
    }
}

export function requiresAuth(page) {
    return ['mis-servants', 'calculadora'].includes(page);
}

export function getPageTitle(page) {
    const titles = {
        'index': 'Buscador de Servants',
        'calculadora': 'Calculadora de Recursos',
        'mis-servants': 'Mis Servants',
        'fgodle': 'FGOdle - Adivina el Servant',
        'tierlist': 'Tier List de Servants'
    };

    return titles[page] || 'F/GO Dashboard';
}

export function getStaticPath() {
    return 'static';
}