import { deleteServantData } from '../services/data.js';

let isDeleteModeActive = false;

export function initDeleteMode() {
    // Initialization logic if needed
}

export function toggleDeleteMode() {
    if (isDeleteModeActive) {
        deactivateDeleteMode();
    } else {
        activateDeleteMode();
    }
}

export function deactivateDeleteMode() {
    if (!isDeleteModeActive) return;

    isDeleteModeActive = false;
    const deleteButton = document.getElementById('ms-delete-button');
    const servantCards = document.querySelectorAll('.servant_box_container');

    // Reset button appearance
    if (deleteButton) {
        deleteButton.classList.remove('active');
        deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i><span>Eliminar Servant</span>';
    }

    servantCards.forEach(card => {
        card.classList.remove('delete-mode-active');

        const overlay = card.querySelector('.box_details_overlay');
        if (overlay) overlay.classList.remove('disabled');

        card.removeEventListener('click', handleDeleteClick);
    });
}

function activateDeleteMode() {
    isDeleteModeActive = true;
    const deleteButton = document.getElementById('ms-delete-button');
    const servantCards = document.querySelectorAll('.servant_box_container');

    // Change button appearance
    if (deleteButton) {
        deleteButton.classList.add('active');
        deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Cancelar</span>';
    }

    servantCards.forEach(card => {
        card.classList.add('delete-mode-active');

        // Disable normal overlay
        const overlay = card.querySelector('.box_details_overlay');
        if (overlay) overlay.classList.add('disabled');

        card.addEventListener('click', handleDeleteClick);
    });
}

function handleDeleteClick(event) {
    event.stopPropagation();
    const card = event.currentTarget;

    const servantData = {
        id: card.dataset.servantId,
        name: card.dataset.name,
        class: card.dataset.class,
        face: card.dataset.face
    };

    showDeleteConfirmation(servantData, card);
}

function showDeleteConfirmation(servant, cardElement) {
    const modal = document.getElementById('delete-confirm-modal');
    if (!modal) return;

    // Populate modal
    const img = document.getElementById('delete-preview-img');
    const name = document.getElementById('delete-preview-name');
    const className = document.getElementById('delete-preview-class');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');

    if (img) img.src = servant.face;
    if (name) name.textContent = servant.name;

    // Handle Class Icon
    if (className) {
        className.innerHTML = ''; // Clear previous text
        const classIcon = document.createElement('img');
        classIcon.src = `../static/classes/${servant.class.toLowerCase()}.png`;
        classIcon.alt = servant.class;
        classIcon.className = 'delete_class_icon';
        className.appendChild(classIcon);
    }

    // Show modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    // Handle actions
    const handleConfirm = async () => {
        cleanup();
        try {
            const result = await deleteServantData(servant.id);
            if (!result.error) {
                // Animate removal
                cardElement.style.transition = 'all 0.5s ease';
                cardElement.style.opacity = '0';
                cardElement.style.transform = 'scale(0)';
                setTimeout(() => cardElement.remove(), 500);
            } else {
                alert('Error al eliminar: ' + result.error);
            }
        } catch (err) {
            console.error(err);
            alert('Error inesperado al eliminar.');
        }
    };

    const handleCancel = () => {
        cleanup();
    };

    function cleanup() {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    }

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);

    // Close on click outside
    modal.onclick = (e) => {
        if (e.target === modal) handleCancel();
    };
}
