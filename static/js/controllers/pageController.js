
import { getCurrentPage } from '../utils/routing.js';
import { fetchAllServants, fetchUserServants } from '../services/data.js';
import { renderServants, renderMessage } from '../modules/uiRenderer.js';
import { generarHTMLmis_servants, aplicarScrollDinamicoPorColumna } from '../ui/cards.js';
import { populateAddServantModal } from '../ui/modals.js';

let currentAddButton = null;

function inicializarComponentesDinamicos() {
    const servantsContainer = document.getElementById("servants-container");
    const addServantModal = document.getElementById("add-servant-modal");

    if (servantsContainer && !servantsContainer.dataset.listenerAttached) {
        servantsContainer.addEventListener("click", (event) => {
            const button = event.target.closest('.add-servant-button');
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

            servantsContainer.innerHTML = misServantsCompletos
                .map(s => generarHTMLmis_servants(s))
                .join('');
        }

        inicializarComponentesDinamicos();
    } catch (err) {
        console.error("❌ Error cargando servants:", err);
        if (servantsContainer) {
            renderMessage(servantsContainer, 'Error al cargar datos. Intenta recargar la página.', 'error');
        }
    }
}

export function getCurrentAddButton() {
    return currentAddButton;
}
