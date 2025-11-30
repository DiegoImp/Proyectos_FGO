
import { getCurrentPage } from '../utils/routing.js';
import { fetchAllServants, fetchUserServants, updateServantData } from '../services/data.js';
import { renderServants, renderMessage } from '../modules/uiRenderer.js';
import { generarHTMLmis_servants, aplicarScrollDinamicoPorColumna } from '../ui/cards.js';
import { populateAddServantModal } from '../ui/modals.js';
import { toggleUpdateMode, deactivateUpdateMode } from '../ui/updateMode.js';
import { toggleDeleteMode, deactivateDeleteMode } from '../ui/deleteMode.js';

let currentAddButton = null;

function inicializarControladoresDeModo() {
    const updateBtn = document.getElementById('ms-update-button');
    const deleteBtn = document.getElementById('ms-delete-button');

    if (updateBtn) {
        updateBtn.onclick = (e) => {
            e.stopPropagation();
            deactivateDeleteMode();
            toggleUpdateMode();
        };
    }

    if (deleteBtn) {
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deactivateUpdateMode();
            toggleDeleteMode();
        };
    }
}

function inicializarComponentesDinamicos() {
    const servantsContainer = document.getElementById("servants-container");
    const addServantModal = document.getElementById("add-servant-modal");

    if (servantsContainer && !servantsContainer.dataset.listenerAttached) {
        servantsContainer.addEventListener("click", (event) => {
            const button = event.target.closest('.add_servant_button');
            if (!button) return;

            currentAddButton = button;
            const servantCardElement = button.closest('.servant_card');
            if (!servantCardElement) return;

            populateAddServantModal(servantCardElement.dataset);
            if (addServantModal) addServantModal.style.display = "flex";
        });

        servantsContainer.dataset.listenerAttached = "true";
    }

    // Aplicar scroll dinámico después de renderizar
    aplicarScrollDinamicoPorColumna();
}

export async function cargarDatosDePagina(session) {
    const servantsContainer = document.getElementById("servants-container");
    if (!servantsContainer) return;

    const currentPage = getCurrentPage();

    try {
        const allServants = await fetchAllServants();

        if (currentPage === 'index') {
            renderServants(allServants, servantsContainer);
        } else if (currentPage === 'mis-servants') {
            if (!session) {
                renderMessage(servantsContainer, 'Inicia sesión para ver tus servants.');
                return;
            }

            const { data: userServants, error } = await fetchUserServants();

            if (error) throw error;

            if (!userServants || userServants.length === 0) {
                renderMessage(servantsContainer, 'Aún no has agregado ningún servant.');
                return;
            }

            const servantMap = new Map(allServants.map(s => [s.id, s]));

            const misServantsCompletos = userServants.map(userSvt => ({
                ...servantMap.get(userSvt.servant_id),
                ...userSvt
            }));

            // Generate HTML for all servants (async)
            const htmlPromises = misServantsCompletos.map(s => generarHTMLmis_servants(s));
            const htmlArray = await Promise.all(htmlPromises);
            servantsContainer.innerHTML = htmlArray.join('');

            inicializarControladoresDeModo();
            inicializarFavoritosListeners();

            // Apply initial sort by level after servants are loaded
            if (window.servantFilterManager) {
                window.servantFilterManager.applyFiltersAndSort();
            }
        }

        inicializarComponentesDinamicos();
    } catch (err) {
        console.error("❌ Error cargando servants:", err);
        if (servantsContainer) {
            renderMessage(servantsContainer, 'Error al cargar datos. Intenta recargar la página.', 'error');
        }
    }
}

/**
 * Initialize favorite toggle listeners using event delegation
 */
function inicializarFavoritosListeners() {
    const servantsContainer = document.getElementById("servants-container");
    if (!servantsContainer) return;

    // Prevent duplicate listeners
    if (servantsContainer.dataset.favoritesListenerAttached) return;
    servantsContainer.dataset.favoritesListenerAttached = "true";

    servantsContainer.addEventListener('click', async (e) => {
        const favoriteIcon = e.target.closest('.favorite_icon');
        if (!favoriteIcon) return;

        e.stopPropagation();

        const servantId = parseInt(favoriteIcon.dataset.servantId);
        const container = favoriteIcon.closest('.servant_box_container');
        if (!container) return;

        const currentFavoriteState = container.dataset.favorite === 'true';
        const newFavoriteState = !currentFavoriteState;

        // Optimistic UI update
        favoriteIcon.classList.toggle('active', newFavoriteState);
        container.dataset.favorite = newFavoriteState;

        // Update in Supabase
        const { error } = await updateServantData(servantId, { is_favorite: newFavoriteState });

        if (error) {
            console.error('❌ Error updating favorite status:', error);
            // Revert UI on error
            favoriteIcon.classList.toggle('active', !newFavoriteState);
            container.dataset.favorite = !newFavoriteState;
        } else {
            console.log(`✅ Favorite status updated for servant ${servantId}: ${newFavoriteState}`);

            // Reapply filters and sorting to move favorites to top
            if (window.servantFilterManager) {
                window.servantFilterManager.applyFiltersAndSort();
            }
        }
    });
}

export function getCurrentAddButton() {
    return currentAddButton;
}
