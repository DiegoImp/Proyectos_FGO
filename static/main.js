document.addEventListener("DOMContentLoaded", async () => {

  // Elementos para la barra de búsqueda
  let searchbar = document.getElementById("search-bar");
  let textoBusqueda = "";
  // Elementos para el sistema de filtros
  let filterbutton = document.getElementById("button-filter");
  let sidebar = document.getElementById("sidebar-filtro");
  let botonesDeFiltro = document.querySelectorAll(
    ".filtro_class button, .filtro_rarity button, .filtro_NP button"
  );
  let servantCard = document.querySelectorAll(".servant_card"); // Se re-asignará
  let resetButton = document.getElementById("reset-filter");

  // Elementos para el control de audio
  const audioPlayer = document.getElementById("ost-player");
  const volumeSlider = document.getElementById("volume-slider");
  const soundControl = document.querySelector(".index_element--music");
  const volumeDisplay = document.getElementById("volume-display");

  // Elementos para el modal de autenticación login
  const AuthButton = document.querySelector(".auth_button");
  const AuthCloseButton = document.getElementById("auth-close-button");
  const Overlay = document.getElementById("login-modal");
  const googleLoginButton = document.getElementById('google-login-button');
  const loginform = document.getElementById("login-form");
  // Elementos de usuario
  const UserProfile = document.getElementById("user-profile");
  const UserProfileName = document.getElementById("user-profile-name");
  let emailUsuarioActual = "";
  const UserIcon = document.getElementById("user-profile-icon");
  // Elementos del modal de autenticación registro
  const togglelogin = document.getElementById("auth-toggle-login");
  const toggleregister = document.getElementById("auth-toggle-register");
  const registerForm = document.getElementById("register-form");
  const authtitle = document.getElementById("auth-title");
  // Agregar Servants
  let addServantButtons = document.querySelectorAll(".add_button"); // Se re-asignará
  let currentAddButton = null; // <-- Variable para "recordar" el botón pulsado
  const addServantModal = document.getElementById("add-servant-modal");
  const addServantCloseButton = document.getElementById("add-servant-close-button");
  const addForm = document.getElementById("add-servant-form");
  // Elementos dentro del modal de agregar servant
  const servantName = document.getElementById("servant-name");
  const servantFace = document.getElementById("servant-face");
  const servantClassIcon = document.getElementById("servant-class-icon");
  const servantID = document.getElementById("input-servant-id");
  const servantLevel = document.getElementById("input-level");
  const servantNPimg = document.getElementById("np-img-wrapper");
  const servantNP = document.getElementById("input-np");
  const servantBond = document.getElementById("input-bond");
  const servantSkillsWrapper = document.getElementById("skills-wrapper");

  // Funciones para abrir/cerrar el modal de autenticación
  function openAuthModal() {
    Overlay.style.display = "flex";
  }
  function closeAuthModal() {
    Overlay.style.display = "none";
  }
  // Funciones para abrir/cerrar el modal de agregar servant
  function openAddServantModal() {
    addServantModal.style.display = "flex";
  }
  function closeAddServantModal() {
    addServantModal.style.display = "none";
  }
  function capitalizeWords(str) {
    if (!str) return '';
    // Divide el string en palabras, capitaliza la primera letra de cada una y las une.
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  function populateAddServantModal(data) {
    // --- 1. Llenar la vista previa ---
    servantFace.src = data.face;

    servantName.textContent = capitalizeWords(data.name);

    if (data.np === "1") {
      servantNPimg.src = "/static/icons/main-page/np1.png";
    } else if (data.np === "2") {
      servantNPimg.src = "/static/icons/main-page/np2.png";
    } else if (data.np === "3") {
      servantNPimg.src = "/static/icons/main-page/np3.png";
    }
    // Construimos la ruta en JavaScript, no con Jinja2
    servantClassIcon.src = `/static/classes/${data.class}.png`;

    // --- 2. Llenar el ID oculto (¡MUY IMPORTANTE!) ---
    servantID.value = data.servantId;

    // --- 3. Generar las Skills dinámicamente ---
    servantSkillsWrapper.innerHTML = ''; // Limpia el wrapper
    // 1. Parseamos el string JSON del data-attribute para convertirlo en un array de objetos
    const skills = JSON.parse(data.skills);

    // 2. Iteramos sobre el array de skills
    skills.slice(0, 3).forEach((skill, index) => {
      // Genera el HTML para cada fila de skill
      const skillHTML = `
                <img src="${skill.icon}" alt="${skill.name}" class="skill_icon_preview">
                <label for="input-skill-${index + 1}" class="add_input_label">
                    ${capitalizeWords(skill.name)}
                </label>
                <input id="input-skill-${index + 1}" name="skill_${index + 1}" type="number" class="add_input" min="1" max="10" value="1" required>
        `;
      servantSkillsWrapper.innerHTML += skillHTML;
    });

    // --- 4. Resetear los inputs principales ---
    servantLevel.value = 1;
    servantNP.value = 1;
    servantBond.value = 1;
  }
  async function addServantUI() {
    // 1. Obtener la lista de IDs de servants que el usuario ya posee.
    const { data: servantList, error } = await clienteSupabase
      .from('user_servants')
      .select('servant_id');
    if (error) {
      console.error("Error al cargar el inventario del usuario:", error.message);
      return;
    }
    //Creamos un Set para una búsqueda ultra-rápida de IDs.
    //Un Set es mucho más eficiente que un Array para comprobar si un elemento existe.
    const userAddedServantIds = new Set(
      servantList.map(servant => parseInt(servant.servant_id, 10))
    );
    addServantButtons = document.querySelectorAll(".add_button");
    addServantButtons.forEach((button) => {
      //Encontramos la tarjeta "padre" más cercana al botón.
      const servantCard = button.closest('.servant_card');
      if (!servantCard) return; // Si no se encuentra la tarjeta, saltamos este botón.
      //Leemos el ID desde la tarjeta, no desde el botón.
      const servID = parseInt(servantCard.dataset.servantId, 10);
      // ------------------------------------
      if (userAddedServantIds.has(servID)) {
        added(button);
      } else {
        notAdded(button);
      }
    });
  }
  function added(button) {
    button.textContent = "Invocado";
    button.classList.remove("add-servant-button");
    button.classList.add("button-added");
    button.classList.remove("hidden");
    button.disabled = true;
  }
  function notAdded(button) {
    button.textContent = "Agregar";
    button.classList.add("add-servant-button");
    button.classList.remove("button-added");
    button.classList.remove("hidden");
    button.disabled = false;
  }
  function aplicarFiltrosCombinados() {
    // Use cached servantCard NodeList from initial render
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

    // Iteramos sobre cada tarjeta individualmente
    servantCard.forEach((card) => {
      // Obtenemos los datos de la tarjeta actual (card)
      const nombre = card.dataset.name;
      const rareza = card.dataset.rarity;
      const clase = card.dataset.class;
      const np = card.dataset.np;

      // Comprobamos si la tarjeta cumple con todos los filtros
      const pasaNombre = nombre.includes(textoBusqueda);
      const pasaRareza =
        rarezasActivas.length === 0 || rarezasActivas.includes(rareza);
      const pasaClase =
        clasesActivas.length === 0 || clasesActivas.includes(clase);
      const pasaNp = NPActivos.length === 0 || NPActivos.includes(np);

      // Mostramos u ocultamos la tarjeta (card) según el resultado
      if (pasaNombre && pasaRareza && pasaClase && pasaNp) {
        card.style.display = "flex"; // Usamos 'flex' porque así está definida en el CSS
      } else {
        card.style.display = "none";
      }
    });
  }
  function updateVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
  }
  function updateVolumeDisplay() {
    volumeDisplay.textContent = volumeSlider.value;
  }
  function generarHTMLCarta(servant) {
    // Generar las estrellas de rareza
    let estrellasHTML = '';
    for (let i = 0; i < servant.rarity; i++) {
      estrellasHTML += '<span>★</span>';
    }

    // Convertir skills a JSON string seguro para el dataset
    // Nota: Nos aseguramos de que existan para evitar errores
    const skillsJSON = servant.skills ? JSON.stringify(servant.skills).replace(/"/g, '&quot;') : '[]';

    // Definir si mostramos el botón de agregar (Solo en index, o basado en lógica)
    // Por ahora lo ponemos siempre oculto y dejamos que addServantUI lo maneje
    const botonAgregar = (servant.type === 'normal' || servant.type === 'heroine')
      ? `<button class="add_button add-servant-button hidden">Agregar</button>`
      : '';


    return `
    <div class="servant_card" 
         data-class="${(servant.className || 'unknown').toLowerCase()}" 
         data-rarity="${servant.rarity}"
         data-name="${(servant.name || '').toLowerCase()}" 
         data-np="${servant.np.type}" 
         data-face="${servant.face}"
         data-type="${(servant.type || '').toLowerCase()}" 
         data-servant-id="${servant.id}"
         data-skills="${skillsJSON}">
         
      <a href="/servant/${servant.collectionNo}" class="details_link">
        <img src="${servant.face}" alt="Icono de ${servant.name}" class="face_main" loading="lazy" />
      </a>
      <img src="/static/classes/${(servant.className || 'unknown').toLowerCase()}.png"
           alt="${servant.className} class icon" class="class_icon_overlay">
           
      <div class="see_details_servant">
        <div class="rarity_card">${estrellasHTML}</div>
        <h3 class="text_container">${servant.name}</h3>
        ${botonAgregar}
      </div>
    </div>
    `;
  }
  /**
   * Inicializa los componentes de la UI y asigna los event listeners.
   * Esta función se llama una sola vez cuando el DOM está listo.
   */
  function inicializarComponentesUI() {
    // Asignar listeners
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

  /**
   * Inicializa los componentes que se crean dinámicamente, como las tarjetas de servants.
   * Debe llamarse CADA VEZ que se renderiza el contenedor de servants.
   */
  function inicializarComponentesDinamicos() {
    // Re-seleccionamos elementos que acaban de ser creados
    addServantButtons = document.querySelectorAll(".add_button");
    servantCard = document.querySelectorAll(".servant_card");

    if (addServantButtons) {
      addServantButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          currentAddButton = event.currentTarget;
          const servantCardElement = event.currentTarget.closest('.servant_card');
          const servantData = servantCardElement.dataset;
          populateAddServantModal(servantData);
          openAddServantModal();
        });
      });
    }
  }

  async function cargarDatosDePagina(session) {
    const servantsContainer = document.getElementById("servants-container");
    if (!servantsContainer) return;

    const STATIC_JSON_URL = '/static/data/main_page_servants.json';

    try {
      const response = await fetch(STATIC_JSON_URL);
      if (!response.ok) throw new Error("No se pudo cargar el JSON de servants");
      const allServants = await response.json();

      const path = window.location.pathname;

      if (path === '/' || path === '/index.html') {
        servantsContainer.innerHTML = allServants.map(s => generarHTMLCarta(s)).join('');
      } else if (path === '/mis-servants') {
        if (!session) { // Si no hay sesión, mostramos el mensaje.
          servantsContainer.innerHTML = '<p style="color:white; text-align:center;">Inicia sesión para ver tus servants.</p>';
          return;
        }

        const { data: userServants, error } = await clienteSupabase.from('user_servants').select('servant_id');
        if (error) throw error;

        if (!userServants || userServants.length === 0) {
          servantsContainer.innerHTML = '<p style="color:white; text-align:center;">Aún no has agregado ningún servant.</p>';
          return;
        }

        // 1. Creamos un "mapa" para buscar servants por ID de forma ultra-rápida.
        const servantMap = new Map(allServants.map(s => [s.id, s]));

        // 2. Usamos el mapa para construir la lista de servants del usuario con todos sus datos.
        const misServantsCompletos = userServants
          .map(userSvt => servantMap.get(userSvt.servant_id)) // Buscamos el servant completo por su ID.
          .filter(Boolean); // Eliminamos cualquier resultado nulo si un servant no se encontrara.

        // 3. Ahora sí, renderizamos las cartas con los datos completos.
        servantsContainer.innerHTML = misServantsCompletos.map(s => generarHTMLCarta(s)).join('');
      }

      inicializarComponentesDinamicos();
      // Llamar a esto DESPUÉS de que las cartas se hayan renderizado.


    } catch (err) {
      console.error("Error cargando servants:", err);
      if (servantsContainer) servantsContainer.innerHTML = `<p class="error-message">Error al cargar datos. Intenta recargar la página.</p>`;
    }
  }

  // GUARDIA --- LÓGICA PARA MANEJAR EL ESTADO DE AUTENTICACIÓN ---
  clienteSupabase.auth.onAuthStateChange((evento, sesion) => {
    if (sesion) {
      // ¡El usuario ESTÁ conectado!
      const nombreUsuario = sesion.user.email.split('@')[0];
      emailUsuarioActual = nombreUsuario;

      //Actualizar la UI con la información del usuario.
      UserProfileName.textContent = nombreUsuario;
      UserIcon.textContent = nombreUsuario.charAt(0).toUpperCase();

      //Alternar la visibilidad de los botones de autenticación y perfil.
      AuthButton.classList.add('hidden');
      UserProfile.classList.remove('hidden');
      closeAuthModal();
      addServantUI();
      // Carga el contenido de la página ahora que sabemos que el usuario está logueado.
      cargarDatosDePagina(sesion);
    } else {
      // El usuario NO está conectado
      AuthButton.classList.remove("hidden"); // 1. Muestra el botón de "Iniciar Sesión"
      UserProfile.classList.add("hidden"); // 2. Oculta el div de perfil de usuario

      // Carga el contenido de la página (que mostrará el mensaje de "inicia sesión" si es necesario).
      cargarDatosDePagina(null);
    }
  });
  // --- LOGICA PARA LOGIN CON GOOGLE ---

  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', async () => {
      // Limpiamos errores por si acaso
      document.getElementById('auth-error').classList.add('hidden');

      const { error } = await clienteSupabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        // Si hay un error (ej. pop-up bloqueado), lo mostramos
        document.getElementById('auth-error').textContent = error.message;
        document.getElementById('auth-error').classList.remove('hidden');
      }

      // ¡Y YA ESTÁ!
    });
  }
  // --- LÓGICA PARA LOG-IN ---
  if (loginform) {
    loginform.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const authError = document.getElementById('auth-error');

      authError.classList.add('hidden');
      // 'await' le dice a JS: "pausa aquí y espera la respuesta de Supabase"
      const { data, error } = await clienteSupabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        // ¡Error! Muestra el mensaje
        authError.textContent = "Usuario o contraseña incorrectos.";
      } else {
        // ¡Éxito! Cierra el modal

        closeAuthModal();
      }
    });
  }
  // --- LÓGICA PARA CERRAR SESIÓN ---
  if (UserProfile) {
    UserProfile.addEventListener("mouseover", () => {
      UserProfileName.textContent = "Cerrar Sesión";
    });
    UserProfile.addEventListener("mouseout", () => {
      UserProfileName.textContent = emailUsuarioActual;
    });
    UserProfile.addEventListener('click', async () => {
      // La función de Supabase para cerrar sesión
      const { error } = await clienteSupabase.auth.signOut();

      if (error) {
        console.error('Error al cerrar sesión:', error.message);
      }
    });
  }
  // --- LOGICA PARA REGISTRARSE ---
  if (registerForm) {
    registerForm.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const authError = document.getElementById('auth-error');
      authError.classList.add('hidden');
      // 'await' le dice a JS: "pausa aquí y espera la respuesta de Supabase"
      const { data, error } = await clienteSupabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        // ¡Error! Muestra el mensaje
        authError.textContent = error.message;
        authError.classList.remove('hidden');
      } else {
        // ¡Éxito! Cierra el modal

        authtitle.textContent = "¡Revisa tu email para confirmar!";
        registerForm.classList.add('hidden');
      }
    });
  }

  if (soundControl) {
    soundControl.addEventListener("click", (e) => {
      if (e.target.id === "volume-slider") {
        return; // Evita que el clic en el slider pause la música
      }
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    });
  }
  // 5. Evento principal: cuando mueves el slider
  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      updateVolume(); // Actualiza el audio
      updateVolumeDisplay(); // Actualiza el número
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
    AuthButton.addEventListener("click", () => {
      openAuthModal();
    });
  }

  if (AuthCloseButton) {
    AuthCloseButton.addEventListener("click", () => {
      closeAuthModal();
    });
  }
  if (Overlay) {
    Overlay.addEventListener("click", (event) => {
      if (event.target === Overlay) {
        closeAuthModal();
      }
    });
  }
  if (addServantCloseButton) {
    addServantCloseButton.addEventListener("click", () => {
      closeAddServantModal();
    });
  }
  if (addServantModal) {
    addServantModal.addEventListener("click", (event) => {
      if (event.target === addServantModal) {
        closeAddServantModal();
      }
    });
  }
  if (addForm) {
    addForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(addForm);
      const { data, error } = await clienteSupabase.from('user_servants').insert([{
        servant_id: formData.get('servant_id'),
        level: formData.get('level'),
        np_level: formData.get('np_level'),
        bond_level: formData.get('bond_level'),
        skill_1: formData.get('skill_1'),
        skill_2: formData.get('skill_2'),
        skill_3: formData.get('skill_3'),
      }]);
      if (error) {
        console.error('Error al agregar el servant:', error.message);
        document.getElementById('add-error').textContent = "Error al agregar el servant";
        document.getElementById('add-error').classList.remove('hidden');
      } else {
        if (currentAddButton) {
          added(currentAddButton);
        }
        closeAddServantModal();
      }
    });
  }


  // --- INICIALIZACIÓN DE LA PÁGINA ---
  updateVolume();
  updateVolumeDisplay();
  inicializarComponentesUI(); // <-- Inicializamos los componentes estáticos una sola vez.

});
