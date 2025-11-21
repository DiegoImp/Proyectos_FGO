/**
 * ============================================================
 * ROUTING UTILITIES - Static Site Navigation
 * ============================================================
 */

export function getCurrentPage() {
    const path = window.location.pathname.replace(/\/$/, '');

    if (path === '' || path === '/index' || path.endsWith('/index.html')) return 'index';
    if (path.endsWith('/calculadora') || path.endsWith('/calculadora.html')) return 'calculadora';
    if (path.endsWith('/mis-servants') || path.endsWith('/mis-servants.html')) return 'mis-servants';
    if (path.endsWith('/fgodle') || path.endsWith('/fgodle.html')) return 'fgodle';
    if (path.endsWith('/tierlist') || path.endsWith('/tierlist.html')) return 'tierlist';

    return 'unknown';
}

export function updateActiveNavLink(currentPage) {
    document.querySelectorAll('.sidebar_index a').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar_index a[href*="${currentPage}"]`);
    if (activeLink) activeLink.classList.add('active');
}

export function navigateTo(page) {
    const routes = {
        'index': './index.html',
        'calculadora': './calculadora.html',
        'mis-servants': './mis-servants.html',
        'fgodle': './fgodle.html',
        'tierlist': './tierlist.html'
    };

    if (routes[page]) {
        window.location.href = routes[page];
    } else {
        console.error(`❌ Página no encontrada: ${page}`);
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
    return window.location.pathname.includes('/templates/') ? '../static' : './static';
}
