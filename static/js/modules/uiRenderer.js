/**
 * ============================================================
 * UI RENDERER - Pure DOM Creation (No innerHTML)
 * ============================================================
 */

function createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });

    if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    } else if (typeof children === 'string') {
        element.textContent = children;
    } else if (children instanceof HTMLElement) {
        element.appendChild(children);
    }

    return element;
}

function createRarityStars(rarity, servantType) {
    // Caso especial: Servants 0★ que NO sean enemigos
    if (rarity === 0 && servantType !== 'enemyCollectionDetail') {
        return [createElement('span', { className: 'rarity-0' }, '★')];
    }
    return Array(rarity).fill(null).map(() => createElement('span', {}, '★'));
}

function createServantCard(servant) {
    const card = createElement('div', {
        className: 'servant_card',
        dataset: {
            class: (servant.className || 'unknown').toLowerCase(),
            rarity: servant.rarity || 0,
            name: (servant.name || '').toLowerCase(),
            np: servant.np?.type || 1,
            face: servant.face?.["1"] || '',
            type: (servant.type || '').toLowerCase(),
            servantId: servant.id || '',
            skills: JSON.stringify(servant.skills || [])
        }
    });

    const link = createElement('a', {
        href: `/servant/${servant.collectionNo}`,
        className: 'details_link'
    });

    const faceImg = createElement('img', {
        src: servant.face?.["1"] || '',
        alt: `Icono de ${servant.name}`,
        className: 'face_main',
        loading: 'lazy',
        decoding: 'async'
    });
    link.appendChild(faceImg);

    const classIcon = createElement('img', {
        src: `static/classes/${(servant.className || 'unknown').toLowerCase()}.png`,
        alt: `${servant.className} class icon`,
        className: 'class_icon_overlay',
        loading: 'lazy',
        decoding: 'async'
    });

    const detailsContainer = createElement('div', { className: 'see_details_servant' });
    const rarityDiv = createElement('div', { className: 'rarity_card' });
    createRarityStars(servant.rarity || 0, servant.type).forEach(star => rarityDiv.appendChild(star));

    const nameH3 = createElement('h3', { className: 'text_container' }, servant.name || 'Unknown Servant');

    let addButton = null;
    if (servant.type === 'normal' || servant.type === 'heroine') {
        addButton = createElement('button', {
            className: 'add_button add-servant-button hidden'
        }, 'Agregar');
    }

    detailsContainer.appendChild(rarityDiv);
    detailsContainer.appendChild(nameH3);
    if (addButton) detailsContainer.appendChild(addButton);

    card.appendChild(link);
    card.appendChild(classIcon);
    card.appendChild(detailsContainer);

    return card;
}

export function renderServants(servants, container) {
    if (!container) {
        console.error('❌ Container no encontrado');
        return;
    }

    container.innerHTML = '';

    if (!servants || servants.length === 0) {
        renderMessage(container, 'No se encontraron servants.');
        return;
    }

    const fragment = document.createDocumentFragment();
    servants.forEach(servant => fragment.appendChild(createServantCard(servant)));
    container.appendChild(fragment);
}

export function renderMessage(container, message, type = 'loading') {
    if (!container) return;
    const className = type === 'error' ? 'error_message' : 'loading-message';
    container.innerHTML = `<p class="${className}">${message}</p>`;
}
