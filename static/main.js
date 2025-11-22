/**
 * ============================================================
 * MAIN.JS - FGO Dashboard
 * ============================================================
 * Archivo principal que coordina toda la lógica del frontend.
 * Usa ES6 Modules para imports y arquitectura modular.
 * ============================================================
 */

// ================================================
// IMPORTS
// ================================================
import { renderServants, renderMessage } from './js/modules/uiRenderer.js';
import { CONFIG } from './js/config.js';
import { getCurrentPage, getStaticPath } from './js/utils/routing.js';

document.addEventListener("DOMContentLoaded", async () => {

  // ================================================
  // RUTA BASE DINÁMICA
  // ================================================
  const staticPath = getStaticPath();
  console.log('📁 Ruta base detectada:', staticPath);

  // ================================================
  // ELEMENTOS DOM - FILTROS Y BÚSQUEDA
  // ================================================
  let searchbar = document.getElementById("search-bar");
  let textoBusqueda = "";
  let filterbutton = document.getElementById("button-filter");
  let sidebar = document.getElementById("sidebar-filtro");
  let botonesDeFiltro = document.querySelectorAll(
    ".filtro_class button, .filtro_rarity button, .filtro_NP button"
  );
  let servantCard = document.querySelectorAll(".servant_card");
  let resetButton = document.getElementById("reset-filter");

  // ================================================
  // ELEMENTOS DOM - AUDIO
  // ================================================
  const audioPlayer = document.getElementById("ost-player");
  const volumeSlider = document.getElementById("volume-slider");
  const soundControl = document.querySelector(".index_element--music");
  const volumeDisplay = document.getElementById("volume-display");

  // ================================================
  // ELEMENTOS DOM - AUTENTICACIÓN
  // ================================================
  const AuthButton = document.querySelector(".auth_button");
  const AuthModal = document.getElementById("auth-modal");
  const AuthCloseButton = document.getElementById("auth-close-button");
  const Overlay = document.getElementById("login-modal");
  const loginform = document.getElementById("login-form");
  const welcomeMessage = document.getElementById("welcome-message");
  const welcomeCloseButton = document.getElementById("welcome-close-button");
  const UserProfile = document.getElementById("user-profile");
  const UserProfileName = document.getElementById("user-profile-name");
  const UserIcon = document.getElementById("user-profile-icon");
  const Usermenuemail = document.getElementById("user-email");
  const LogoutButton = document.getElementById("logout-button");
  const togglelogin = document.getElementById("auth-toggle-login");
  const toggleregister = document.getElementById("auth-toggle-register");
  const registerForm = document.getElementById("register-form");
  const authtitle = document.getElementById("auth-title");

  // ================================================
  // ELEMENTOS DOM - AGREGAR SERVANT
  // ================================================
  let currentAddButton = null;
  const addServantModal = document.getElementById("add-servant-modal");
  const addServantCloseButton = document.getElementById("add-servant-close-button");
  const addForm = document.getElementById("add-servant-form");
  const servantName = document.getElementById("servant-name");
  const servantFace = document.getElementById("servant-face");
  const servantClassIcon = document.getElementById("servant-class-icon");
  const servantID = document.getElementById("input-servant-id");
  const servantLevel = document.getElementById("input-level");
  const servantNPimg = document.getElementById("np-img-wrapper");
  const servantNP = document.getElementById("input-np");
  const servantBond = document.getElementById("input-bond");
  const servantSkillsWrapper = document.getElementById("skills-wrapper");

  // ================================================
  // CANVAS GLOBAL PARA MEDICIONES DE TEXTO
  // ================================================
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // ================================================
  // FUNCIONES HELPER - MODALES
  // ================================================
  function openAuthModal() {
    Overlay.style.display = "flex";
  }

  function closeAuthModal() {
    Overlay.style.display = "none";
  }

  function openAddServantModal() {
    addServantModal.style.display = "flex";
  }

  function closeAddServantModal() {
    addServantModal.style.display = "none";
  }

  // ================================================
  // FUNCIONES HELPER - FORMATEO
  // ================================================
  function capitalizeWords(str) {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // ================================================
  // FUNCIONES HELPER - MODAL AGREGAR SERVANT
  // ================================================
  function populateAddServantModal(data) {
    servantFace.src = data.face;
    servantName.textContent = capitalizeWords(data.name);

    const npImages = {
      "1": `${staticPath}/icons/main-page/np1.png`,
      "2": `${staticPath}/icons/main-page/np2.png`,
      "3": `${staticPath}/icons/main-page/np3.png`
    };
    servantNPimg.src = npImages[data.np] || npImages["1"];

    servantClassIcon.src = `${staticPath}/classes/${data.class}.png`;
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

  async function addServantUI() {
    const { data: servantList, error } = await window.clienteSupabase
      .from('user_servants')
      .select('servant_id');

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

  function markAsAdded(button) {
    if (!button) return;
    button.textContent = "Invocado";
    button.classList.remove("add-servant-button");
    button.classList.add("button-added");
    button.classList.remove("hidden");
    button.disabled = true;
  }

  function markAsNotAdded(button) {
    if (!button) return;
    button.textContent = "Agregar";
    button.classList.add("add-servant-button");
    button.classList.remove("button-added");
    button.classList.remove("hidden");
    button.disabled = false;
  }
  function aplicarFiltrosCombinados() {
    // ✅ Re-seleccionar tarjetas cada vez (por si se re-renderizaron)
    servantCard = document.querySelectorAll(".servant_card");

    const botonesClaseActivos = document.querySelectorAll(
      ".filtro_class button.active"
    );
    const botonesRarezaActivos = document.querySelectorAll(
      ".filtro_rarity button.active"
    );
    const botonesNPActivos = document.querySelectorAll(
      ".filtro_NP button.active"
    );
    const clasesActivas = Array.from(botonesClaseActivos).map((boton) =>
      boton.dataset.value.toLowerCase()
    );
    const rarezasActivas = Array.from(botonesRarezaActivos).map(
      (boton) => boton.dataset.value
    );
    const NPActivos = Array.from(botonesNPActivos).map(
      (boton) => boton.dataset.value
    );

    servantCard.forEach((card) => {
      const { name: nombre, rarity: rareza, class: clase, np } = card.dataset;

      const pasaNombre = nombre.includes(textoBusqueda);
      const pasaRareza = rarezasActivas.length === 0 || rarezasActivas.includes(rareza);
      const pasaClase = clasesActivas.length === 0 || clasesActivas.includes(clase);
      const pasaNp = NPActivos.length === 0 || NPActivos.includes(np);

      card.style.display = (pasaNombre && pasaRareza && pasaClase && pasaNp) ? "flex" : "none";
    });
  }

  // ================================================
  // FUNCIONES HELPER - AUDIO
  // ================================================
  function updateVolume() {
    if (audioPlayer) audioPlayer.volume = volumeSlider.value / 100;
  }

  function updateVolumeDisplay() {
    if (volumeDisplay) volumeDisplay.textContent = volumeSlider.value;
  }

  // ================================================
  // FUNCIONES HELPER - MIS SERVANTS
  // ================================================
  function getAscensionLevel(rarity, currentLevel) {
    const caps = {
      5: [50, 60, 70, 80],
      4: [40, 50, 60, 70],
      3: [30, 40, 50, 60],
      2: [25, 35, 45, 55],
      1: [20, 30, 40, 50],
      0: [25, 35, 45, 55]
    };

    const limits = caps[rarity];
    if (!limits) return 0;

    if (currentLevel <= limits[0]) return 0;
    if (currentLevel <= limits[1]) return 1;
    if (currentLevel <= limits[2]) return 2;
    if (currentLevel <= limits[3]) return 3;
    return 4;
  }

  function getTextWidthCanvas(text, fontSize = "13.6px", fontWeight = "500", fontFamily = "Roboto, sans-serif") {
    context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    return context.measureText(text).width;
  }

  function getScrollClass(textWidth, containerWidth) {
    if (textWidth <= containerWidth) return "";

    // Calcular el exceso como porcentaje del contenedor
    const overflow = textWidth - containerWidth;
    const overflowPercent = (overflow / containerWidth) * 100;

    // Umbrales basados en porcentaje de exceso
    if (overflowPercent <= 50) return "scroll_short";      // Hasta 50% más largo
    if (overflowPercent <= 120) return "scroll_medium";    // Hasta 120% más largo
    if (overflowPercent <= 230) return "scroll_long";      // Hasta 230% más largo
    return "scroll_extreme";                               // Más de 230% más largo
  }

  function generarHTMLmis_servants(servant) {
    // Generar las estrellas de rareza
    let estrellasHTML = '';
    if (servant.rarity === 0 && servant.type !== 'enemyCollectionDetail') {
      estrellasHTML = '<span class="rarity-0">★</span>';
    } else {
      for (let i = 0; i < servant.rarity; i++) {
        estrellasHTML += '<span>★</span>';
      }
    }
    const skillsJSON = JSON.stringify(servant.skills || [])
      .replace(/"/g, '&quot;');

    let skillsHTML = '';
    (servant.skills || []).slice(0, 3).forEach((skill, index) => {
      // Las clases de scroll se aplicarán dinámicamente después del render
      skillsHTML += `
              <div class="skill_row">
                <img src="${skill.icon}" alt="${skill.name}" class="skill_icon_preview">
                <div class="skill_name" title="${skill.name}">
                  <span id="input-skill-${index + 1}" class="skill_name_text">
                      ${capitalizeWords(skill.name)}
                  </span>
                </div>
                <p class="skill-level">Nivel: ${servant[`skill_${index + 1}`] || 'N/A'}</p>
              </div>
        `;
    });

    let npTypeDisplay = '';
    if (servant.np.type === '2') {
      npTypeDisplay = 'Buster';
    } else if (servant.np.type === '1') {
      npTypeDisplay = 'Arts';
    } else if (servant.np.type === '3') {
      npTypeDisplay = 'Quick';
    }

    // La clase de scroll del NP se aplicará dinámicamente después del render
    let ascensionLevel = getAscensionLevel(servant.rarity, servant.level);
    servant.face = servant.face[ascensionLevel.toString()] || servant.face['1'];

    // Icono de bond dinámico
    const bondLevel = servant.bond_level || 0;
    const bondIconNumber = bondLevel > 10 ? 11 : bondLevel;
    const bondIconHTML = `<img src="${staticPath}/icons/mis-servants/img_bondsgage_${bondIconNumber}.png" alt="Bond ${bondLevel}" class="bond_level_icon">`;
    const bondMaxLevel = bondLevel > 10 ? 15 : 10;

    return `
    <div class="servant_box_container" data-np="${servant.np.type}">
      <div class="servant_box" 
         data-class="${(servant.className || 'unknown').toLowerCase()}" 
         data-rarity="${servant.rarity}" 
         data-name="${(servant.name || '').toLowerCase()}" 
         data-face="${servant.face}" 
         data-type="${(servant.type || '').toLowerCase()}" 
         data-np="${servant.np}"
         data-servant-id="${servant.id}" 
         data-skills="${skillsJSON}">
      <div class="box_name">
        <span>${servant.name}</span>
        <div class="box_stats">
          <span>ATK: 1200</span>
          <span>HP: 1200</span>
        </div>
      </div>
      <img src="${staticPath}/classes/${(servant.className || 'unknown').toLowerCase()}.png" class="box_class_icon">
      <div class="card_rareza">
        <span class="rarity_card">
        ${estrellasHTML}
        </span>
        <span>Nivel: ${servant.level}</span>
      </div>
      <img src="${servant.face}" alt="Icono de ${servant.name}" class="box-imagen">
      </div>
      <div class="box_details_overlay">
      <div class="box_details_content">
        <div class="skills_details">
        <h3>Active Skills</h3>
        ${skillsHTML}
        </div>
        <div class="INFO_details">
        <h3>Servant Info</h3>
        <div class="NP_info">
          <!-- Fila Superior: Título y Tipo de Carta -->
          <div class="np_top_row">
          <span class="np_title">NOBLE PHANTASM</span>
          <!-- Aquí iría dinámicamente: Buster, Arts o Quick -->
          <span class="np_card_type">${npTypeDisplay}</span>
          </div>
          <!-- Fila Central: Nombre del NP -->
          <div class="np_name" title="${servant.np.name}">
            <span class="np_name_text">${servant.np.name}</span>
          </div>
          <!-- Fila Inferior: Nivel -->
          <div class="np_level_row">
          <span class="np_lvl_label">Nivel:</span>
          <span class="np_lvl_value" id="np-lvl-value">${servant.np_level}</span>
          </div>
        </div>
        <div class="Bond_info">
          <div class="bond_info_details">
          <span class="bond_label">Bond Level:</span>
          ${bondIconHTML}
          <div class="bond_value_wrapper">
            <span class="bond_value" id="bond-value">${servant.bond_level}</span><span class="bond_max" id="bond-max">/${bondMaxLevel}</span>
          </div>
          </div>
        </div>
        </div>
      </div>
      <div class="redirect_buttons">
        <button class="btn-custom btn-calc">
        <i class="fas fa-calculator"></i> Calculadora
        </button>
        <button class="btn-custom btn-detail">
        Más detalles <i class="fas fa-arrow-right text-xs"></i>
        </button>
      </div>
      </div>
    </div>
    `;

  }

  // ================================================
  // INICIALIZACIÓN DE COMPONENTES
  // ================================================
  function inicializarComponentesUI() {
    if (searchbar) {
      searchbar.addEventListener("input", (evento) => {
        textoBusqueda = evento.target.value.toLowerCase().trim();
        aplicarFiltrosCombinados();
      });
    }

    if (filterbutton) {
      filterbutton.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar-filtro-visible");
      });
    }

    if (botonesDeFiltro) {
      botonesDeFiltro.forEach((boton) => {
        boton.addEventListener("click", () => {
          boton.classList.toggle("active");
          aplicarFiltrosCombinados();
        });
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        if (searchbar) searchbar.value = "";
        textoBusqueda = "";
        botonesDeFiltro.forEach((boton) => boton.classList.remove("active"));
        aplicarFiltrosCombinados();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  // ================================================
  // MEDICIÓN Y APLICACIÓN DE SCROLL POR COLUMNA
  // ================================================
  function aplicarScrollDinamicoPorColumna() {
    const currentPage = getCurrentPage();
    if (currentPage !== 'mis-servants') return;

    const allCards = document.querySelectorAll('.servant_box_container');
    if (allCards.length === 0) return;

    // Arrays para guardar anchos por columna [col0, col1, col2]
    const skillContainerWidths = [null, null, null];
    const npContainerWidths = [null, null, null];

    // Medir las primeras 3 cartas (una por columna)
    const maxMeasure = Math.min(3, allCards.length);
    for (let i = 0; i < maxMeasure; i++) {
      const card = allCards[i];
      const skillContainer = card.querySelector('.skill_name');
      const npContainer = card.querySelector('.np_name');

      if (skillContainer) {
        skillContainerWidths[i] = skillContainer.getBoundingClientRect().width;
      }
      if (npContainer) {
        npContainerWidths[i] = npContainer.getBoundingClientRect().width;
      }
    }

    // Aplicar clases a todas las cartas según su columna
    allCards.forEach((card, index) => {
      const columnIndex = index % 3;
      const skillContainerWidth = skillContainerWidths[columnIndex];
      const npContainerWidth = npContainerWidths[columnIndex];

      // Aplicar clases a skills
      if (skillContainerWidth) {
        const skillTexts = card.querySelectorAll('.skill_name_text');
        skillTexts.forEach(skillText => {
          const textWidth = skillText.scrollWidth;
          const scrollClass = getScrollClass(textWidth, skillContainerWidth);

          // Remover clases anteriores
          skillText.classList.remove('scroll_short', 'scroll_medium', 'scroll_long', 'scroll_extreme');
          if (scrollClass) skillText.classList.add(scrollClass);
        });
      }

      // Aplicar clases a NP
      if (npContainerWidth) {
        const npText = card.querySelector('.np_name_text');
        if (npText) {
          const textWidth = npText.scrollWidth;
          const scrollClass = getScrollClass(textWidth, npContainerWidth);

          // Remover clases anteriores
          npText.classList.remove('scroll_short', 'scroll_medium', 'scroll_long', 'scroll_extreme');
          if (scrollClass) npText.classList.add(scrollClass);
        }
      }
    });
  }

  function inicializarComponentesDinamicos() {
    servantCard = document.querySelectorAll(".servant_card");

    const servantsContainer = document.getElementById("servants-container");
    if (servantsContainer && !servantsContainer.dataset.listenerAttached) {
      servantsContainer.addEventListener("click", (event) => {
        const button = event.target.closest('.add-servant-button');
        if (!button) return;

        currentAddButton = button;
        const servantCardElement = button.closest('.servant_card');
        if (!servantCardElement) return;

        populateAddServantModal(servantCardElement.dataset);
        openAddServantModal();
      });

      servantsContainer.dataset.listenerAttached = "true";
    }

    // Aplicar scroll dinámico después de renderizar
    aplicarScrollDinamicoPorColumna();
  }

  // ================================================
  // CARGA DE DATOS POR PÁGINA
  // ================================================
  async function cargarDatosDePagina(session) {
    const servantsContainer = document.getElementById("servants-container");
    if (!servantsContainer) return;

    const currentPage = getCurrentPage();

    try {
      const response = await fetch(`${staticPath}/data/main_page_servants.json`);
      if (!response.ok) throw new Error("No se pudo cargar servants");
      const allServants = await response.json();

      if (currentPage === 'index') {
        renderServants(allServants, servantsContainer);
      } else if (currentPage === 'mis-servants') {
        if (!session) {
          renderMessage(servantsContainer, 'Inicia sesión para ver tus servants.');
          return;
        }

        const { data: userServants, error } = await window.clienteSupabase
          .from('user_servants')
          .select('servant_id');

        if (error) throw error;

        if (!userServants || userServants.length === 0) {
          renderMessage(servantsContainer, 'Aún no has agregado ningún servant.');
          return;
        }

        const servantMap = new Map(allServants.map(s => [s.id, s]));

        const { data: userServantsData } = await window.clienteSupabase
          .from('user_servants')
          .select('servant_id, level, skill_1, skill_2, skill_3, np_level, bond_level');

        const misServantsCompletos = userServantsData.map(userSvt => ({
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

  // ================================================
  // AUTENTICACIÓN - ESTADO Y EVENTOS
  // ================================================
  window.clienteSupabase.auth.onAuthStateChange((evento, sesion) => {
    if (sesion) {
      const nombreUsuario = sesion.user.email.split('@')[0];
      window.currentUserEmail = nombreUsuario;

      if (UserProfileName) UserProfileName.textContent = nombreUsuario;
      if (UserIcon) UserIcon.textContent = nombreUsuario.charAt(0).toUpperCase();
      if (AuthButton) AuthButton.classList.add('hidden');
      if (UserProfile) UserProfile.classList.remove('hidden');

      addServantUI();
      cargarDatosDePagina(sesion);
    } else {
      if (AuthButton) AuthButton.classList.remove("hidden");
      if (UserProfile) UserProfile.classList.add("hidden");
      cargarDatosDePagina(null);
    }
  });

  if (loginform) {
    loginform.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const authError = document.getElementById('auth-error');

      authError.classList.add('hidden');

      const { data, error } = await window.clienteSupabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        authError.textContent = "Usuario o contraseña incorrectos.";
        authError.classList.remove('hidden');
      } else {
        welcomeMessage.classList.remove('hidden');
        AuthModal.classList.add('hidden');
      }
    });
  }

  const googleLoginButton = document.getElementById('google-login-button');
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', async () => {
      const { data, error } = await window.clienteSupabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });

      if (error) {
        const authError = document.getElementById('auth-error');
        authError.textContent = 'Error al iniciar sesión con Google.';
        authError.classList.remove('hidden');
        console.error('Error Google OAuth:', error);
      }
    });
  }

  if (welcomeMessage && welcomeCloseButton) {
    welcomeCloseButton.addEventListener('click', () => {
      closeAuthModal();
      welcomeMessage.classList.add('hidden');
      AuthModal.classList.remove('hidden');
      toggleAudio();
    });
  }

  if (UserProfile) {
    UserProfile.addEventListener("mouseover", () => {
      if (UserProfileName) UserProfileName.textContent = "Master Info";
      if (UserIcon) UserIcon.classList.add("hidden");
      if (Usermenuemail) Usermenuemail.textContent = window.currentUserEmail || '';
    });

    UserProfile.addEventListener("mouseout", () => {
      if (UserProfileName) UserProfileName.textContent = window.currentUserEmail || '';
      if (UserIcon) UserIcon.classList.remove("hidden");
    });

    if (LogoutButton) {
      LogoutButton.addEventListener('click', async () => {
        const { error } = await window.clienteSupabase.auth.signOut();
        if (error) console.error('❌ Error al cerrar sesión:', error.message);
      });
    }
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const authError = document.getElementById('auth-error');
      authError.classList.add('hidden');

      const { data, error } = await window.clienteSupabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        authError.textContent = error.message;
        authError.classList.remove('hidden');
      } else {
        authtitle.textContent = "¡Revisa tu email para confirmar!";
        registerForm.classList.add('hidden');
      }
    });
  }

  function toggleAudio() {
    if (!audioPlayer) return;
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
  }

  if (soundControl) {
    soundControl.addEventListener("click", (e) => {
      if (e.target.id === "volume-slider") return;
      toggleAudio();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      updateVolume();
      updateVolumeDisplay();
    });
  }

  if (togglelogin) {
    togglelogin.addEventListener("click", (event) => {
      event.preventDefault();
      registerForm.classList.remove("hidden");
      loginform.classList.add("hidden");
      authtitle.textContent = "Registrarse";
    });
  }

  if (toggleregister) {
    toggleregister.addEventListener("click", (event) => {
      event.preventDefault();
      registerForm.classList.add("hidden");
      loginform.classList.remove("hidden");
      authtitle.textContent = "Iniciar Sesión";
    });
  }

  if (AuthButton) {
    AuthButton.addEventListener("click", openAuthModal);
  }

  if (AuthCloseButton) {
    AuthCloseButton.addEventListener("click", closeAuthModal);
  }

  if (Overlay) {
    Overlay.addEventListener("click", (event) => {
      if (event.target === Overlay) closeAuthModal();
    });
  }

  if (addServantCloseButton) {
    addServantCloseButton.addEventListener("click", closeAddServantModal);
  }

  if (addServantModal) {
    addServantModal.addEventListener("click", (event) => {
      if (event.target === addServantModal) closeAddServantModal();
    });
  }

  if (addForm) {
    addForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(addForm);

      const { data, error } = await window.clienteSupabase.from('user_servants').insert([{
        servant_id: formData.get('servant_id'),
        level: formData.get('level'),
        np_level: formData.get('np_level'),
        bond_level: formData.get('bond_level'),
        skill_1: formData.get('skill_1'),
        skill_2: formData.get('skill_2'),
        skill_3: formData.get('skill_3'),
      }]);

      if (error) {
        console.error('❌ Error al agregar servant:', error.message);
        const addError = document.getElementById('add-error');
        if (addError) {
          addError.textContent = "Error al agregar el servant";
          addError.classList.remove('hidden');
        }
      } else {
        if (currentAddButton) markAsAdded(currentAddButton);
        closeAddServantModal();
      }
    });
  }

  // ================================================
  // INICIALIZACIÓN FINAL
  // ================================================
  updateVolume();
  updateVolumeDisplay();
  inicializarComponentesUI();

});
