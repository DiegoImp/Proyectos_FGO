import { getStaticPath } from '../utils/routing.js';
import { capitalizeWords } from '../utils/format.js';
import { fetchUserServantIds, addServantToUser } from '../services/data.js';
import { getCurrentAddButton } from '../controllers/pageController.js';

const staticPath = getStaticPath();

export function initModals() {
    const AuthButton = document.querySelector(".auth_button");
    const AuthModal = document.getElementById("auth-modal");
    const AuthCloseButton = document.getElementById("auth-close-button");
    const Overlay = document.getElementById("login-modal");
    const welcomeMessage = document.getElementById("welcome-message");
    const welcomeCloseButton = document.getElementById("welcome-close-button");

    const addServantModal = document.getElementById("add-servant-modal");
    const addServantCloseButton = document.getElementById("add-servant-close-button");

    function openAuthModal() {
        if (Overlay) Overlay.style.display = "flex";
    }

    function closeAuthModal() {
        if (Overlay) Overlay.style.display = "none";
    }

    function openAddServantModal() {
        if (addServantModal) addServantModal.style.display = "flex";
    }

    function closeAddServantModal() {
        if (addServantModal) addServantModal.style.display = "none";
    }

    if (AuthButton) AuthButton.addEventListener("click", openAuthModal);
    if (AuthCloseButton) AuthCloseButton.addEventListener("click", closeAuthModal);
    if (Overlay) {
        Overlay.addEventListener("click", (event) => {
            if (event.target === Overlay) closeAuthModal();
        });
    }

    if (addServantCloseButton) addServantCloseButton.addEventListener("click", closeAddServantModal);
    if (addServantModal) {
        addServantModal.addEventListener("click", (event) => {
            if (event.target === addServantModal) closeAddServantModal();
        });
    }

    if (welcomeMessage && welcomeCloseButton) {
        welcomeCloseButton.addEventListener('click', () => {
            closeAuthModal();
            welcomeMessage.classList.add('hidden');
            if (AuthModal) AuthModal.classList.remove('hidden');
            document.dispatchEvent(new CustomEvent('toggle-audio'));
        });
    }

    initAddServantForm();

    return {
        openAuthModal,
        closeAuthModal,
        openAddServantModal,
        closeAddServantModal
    };
}

function initAddServantForm() {
    const addForm = document.getElementById("add-servant-form");
    const addServantModal = document.getElementById("add-servant-modal");

    if (addForm) {
        addForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(addForm);

            const servantData = {
                servant_id: formData.get('servant_id'),
                level: formData.get('level'),
                np_level: formData.get('np_level'),
                bond_level: formData.get('bond_level'),
                skill_1: formData.get('skill_1'),
                skill_2: formData.get('skill_2'),
                skill_3: formData.get('skill_3'),
            };

            const { error } = await addServantToUser(servantData);

            if (error) {
                console.error('❌ Error al agregar servant:', error.message);
                const addError = document.getElementById('add-error');
                if (addError) {
                    addError.textContent = "Error al agregar el servant";
                    addError.classList.remove('hidden');
                }
            } else {
                const currentAddButton = getCurrentAddButton();
                if (currentAddButton) markAsAdded(currentAddButton);
                if (addServantModal) addServantModal.style.display = "none";
            }
        });
    }
}

export function populateAddServantModal(data) {
    const servantName = document.getElementById("servant-name");
    const servantFace = document.getElementById("servant-face");
    const servantClassIcon = document.getElementById("servant-class-icon");
    const servantID = document.getElementById("input-servant-id");
    const servantLevel = document.getElementById("input-level");
    const servantNPimg = document.getElementById("np-img-wrapper");
    const servantNP = document.getElementById("input-np");
    const servantBond = document.getElementById("input-bond");
    const servantSkillsWrapper = document.getElementById("skills-wrapper");

    if (!servantName) return;

    servantFace.src = data.face;
    servantName.textContent = capitalizeWords(data.name);

    const npImages = {
        "1": `${staticPath}/static/icons/main-page/np1.png`,
        "2": `${staticPath}/static/icons/main-page/np2.png`,
        "3": `${staticPath}/static/icons/main-page/np3.png`
    };
    servantNPimg.src = npImages[data.np] || npImages["1"];

    servantClassIcon.src = `${staticPath}/static/classes/${data.class}.png`;
    servantID.value = data.servantId;

    servantSkillsWrapper.innerHTML = '';
    const skills = JSON.parse(data.skills);

    skills.slice(0, 3).forEach((skill, index) => {
        const skillHTML = `
          <img src="${skill.icon}" alt="${skill.name}" class="skill_icon_preview">
          <label for="input-skill-${index + 1}" class="add_input_label">${capitalizeWords(skill.name)}</label>
          <input 
            id="input-skill-${index + 1}" 
            name="skill_${index + 1}" 
            type="number" 
            min="1" 
            max="10" 
            value="1" 
            required
            class="add_input"
          >
      `;
        servantSkillsWrapper.innerHTML += skillHTML;
    });

    servantLevel.value = 1;
    servantNP.value = 1;
    servantBond.value = 1;
}

export async function updateAddButtonsState() {
    const { data: servantList, error } = await fetchUserServantIds();

    if (error) {
        console.error("❌ Error al cargar inventario:", error.message);
        return;
    }

    const userAddedServantIds = new Set(
        servantList.map(servant => parseInt(servant.servant_id, 10))
    );

    const addButtons = document.querySelectorAll(".add_button");
    addButtons.forEach((button) => {
        const servantCard = button.closest('.servant_card');
        if (!servantCard) return;

        const servID = parseInt(servantCard.dataset.servantId, 10);

        if (userAddedServantIds.has(servID)) {
            markAsAdded(button);
        } else {
            markAsNotAdded(button);
        }
    });
}

export function markAsAdded(button) {
    if (!button) return;
    button.textContent = "Invocado";
    button.classList.remove("add_servant_button");
    button.classList.add("button_added");
    button.classList.remove("hidden");
    button.disabled = true;
}

export function markAsNotAdded(button) {
    if (!button) return;
    button.textContent = "Agregar";
    button.classList.add("add_servant_button");
    button.classList.remove("button_added");
    button.classList.remove("hidden");
    button.disabled = false;
}
