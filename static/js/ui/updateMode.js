/**
 * ============================================================
 * UPDATE MODE - Mis Servants
 * ============================================================
 * Handles the update button functionality for editing servants
 * ============================================================
 */

import { populateEditServantModal } from './modals.js';

let isUpdateModeActive = false;

export function initUpdateMode() {
    const updateButton = document.getElementById('ms-update-button');

    if (!updateButton) return;

    updateButton.addEventListener('click', () => {
        if (isUpdateModeActive) {
            deactivateUpdateMode();
        } else {
            activateUpdateMode();
        }
    });
}

function activateUpdateMode() {
    isUpdateModeActive = true;
    const updateButton = document.getElementById('ms-update-button');
    const servantCards = document.querySelectorAll('.servant_box_container');

    // Change button appearance
    if (updateButton) {
        updateButton.classList.add('active');
        updateButton.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Cancelar</span>';
    }

    servantCards.forEach(card => {
        const overlay = card.querySelector('.box_details_overlay');
        const servantBox = card.querySelector('.servant_box');

        // Disable normal overlay on hover
        if (overlay) {
            overlay.classList.add('disabled');
        }

        // Add border bottom to servant_box with theme color
        if (servantBox) {
            servantBox.style.borderBottom = '5px solid var(--servant-theme)';
            servantBox.style.borderRadius = '20px';
        }

        card.style.cursor = 'pointer';
        card.classList.add('update-mode-active');

        // Add click handler to open edit modal
        card.addEventListener('click', handleCardClickForEdit);
    });
}

function deactivateUpdateMode() {
    isUpdateModeActive = false;
    const updateButton = document.getElementById('ms-update-button');
    const servantCards = document.querySelectorAll('.servant_box_container');

    // Reset button appearance
    if (updateButton) {
        updateButton.classList.remove('active');
        updateButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i><span>Actualizar Datos</span>';
    }

    servantCards.forEach(card => {
        const overlay = card.querySelector('.box_details_overlay');
        const servantBox = card.querySelector('.servant_box');

        // Restore overlay
        if (overlay) {
            overlay.classList.remove('disabled');
        }

        // Remove inline styles from servant_box to restore CSS defaults
        if (servantBox) {
            servantBox.style.borderBottom = '';
            servantBox.style.borderRadius = '';
        }

        card.style.cursor = '';
        card.classList.remove('update-mode-active');

        // Remove event listeners
        card.removeEventListener('click', handleCardClickForEdit);
    });
}

function handleCardClickForEdit(event) {
    // Prevent event from bubbling
    event.stopPropagation();

    const card = event.currentTarget;

    // Extract servant data from data attributes
    const servantData = {
        servantId: card.dataset.servantId,
        name: card.dataset.name,
        face: card.dataset.face,
        class: card.dataset.class,
        rarity: card.dataset.rarity,
        npType: card.dataset.npType,
        level: card.dataset.level,
        npLevel: card.dataset.npLevel || '1',
        bondLevel: card.dataset.bondLevel || '0',
        skill1: card.getAttribute('data-skill-1') || '1',
        skill2: card.getAttribute('data-skill-2') || '1',
        skill3: card.getAttribute('data-skill-3') || '1',
        skills: card.dataset.skills
    };

    // Populate and open edit modal
    populateEditServantModal(servantData);

    // Open modal
    if (window.modalFunctions?.openEditServantModal) {
        window.modalFunctions.openEditServantModal();
    }
}
