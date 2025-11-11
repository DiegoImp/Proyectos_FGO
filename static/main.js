document.addEventListener("DOMContentLoaded", () => {

  // Elementos para la barra de búsqueda
  const searchbar = document.getElementById("search-bar");
  let textoBusqueda = "";
  // Elementos para el sistema de filtros
  const filterbutton = document.getElementById("button-filter");
  const sidebar = document.getElementById("sidebar-filtro");
  const botonesDeFiltro = document.querySelectorAll(
    ".filtro_class button, .filtro_rarity button, .filtro_NP button"
  );
  const servantCard = document.querySelectorAll(".servant_card");
  const resetButton = document.getElementById("reset-filter");

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
  const addServantButtons = document.querySelectorAll(".add_button");
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
      servantNPimg.src = "/static/icons/np1.png";
    } else if (data.np === "2") {
      servantNPimg.src = "/static/icons/np2.png";
    } else if (data.np === "3") {
      servantNPimg.src = "/static/icons/np3.png";
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

  function aplicarFiltrosCombinados() {
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

  // --- LÓGICA PARA MANEJAR EL ESTADO DE AUTENTICACIÓN ---
  clienteSupabase.auth.onAuthStateChange((evento, sesion) => {

    if (sesion) {
      // ¡El usuario ESTÁ conectado!

      AuthButton.classList.add("hidden"); // 1. Oculta el botón de "Iniciar Sesión" (id="auth-open-button")
      UserProfile.classList.remove("hidden"); // 2. Muestra el div de perfil de usuario (id="user-profile")
      UserProfileName.textContent = sesion.user.email.split('@')[0]; // 3. (Bonus) Toma el email del usuario (sesion.user.email) y

      // 1. Selecciona el nuevo div (junto a los otros)
      try {
        // A. Obtén el email y la primera letra
        const emailUsuario = sesion.user.email.split('@')[0];
        emailUsuarioActual = emailUsuario;
        const primeraLetra = emailUsuario.charAt(0).toUpperCase();

        // B. Asigna los valores (basado en tu HTML)
        UserIcon.textContent = primeraLetra;     // Pone la letra en el círculo

        // C. Muestra el perfil, oculta el botón
        UserProfile.classList.remove('hidden');
        AuthButton.classList.add('hidden');

        // D. ¡CIERRA EL MODAL!
        // Esta es la línea que movimos. Ahora se ejecuta al final.


      } catch (e) {
        console.error("Error actualizando la UI del perfil:", e);
      }

    } else {
      // El usuario NO está conectado
      // (Esto se activa si no hay sesión, o después de hacer logout)


      // --- TU LÓGICA AQUÍ ---
      AuthButton.classList.remove("hidden"); // 1. Muestra el botón de "Iniciar Sesión"
      UserProfile.classList.add("hidden"); // 2. Oculta el div de perfil de usuario
    }
  });
  // --- LOGICA PARA LOGIN CON GOOGLE ---

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
  // --- LÓGICA PARA LOG-IN ---
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
  // --- LÓGICA PARA CERRAR SESIÓN ---
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
    } else {


    }
  });
  // --- LOGICA PARA REGISTRARSE ---
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
  // --- LÓGICA PARA BARRA DE BÚSQUEDA ---
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

  // --- LÓGICA PARA BOTONES DE FILTRO ---
  // 1. Seleccionamos TODOS los botones que están dentro de los contenedores de filtros

  // 2. Recorremos cada uno de los botones encontrados
  if (botonesDeFiltro) {
    botonesDeFiltro.forEach((boton) => {
      // 3. A cada botón, le añadimos un "escuchador" de clics
      boton.addEventListener("click", () => {
        // 4. classList.toggle('active') hace la magia:
        //    - Si el botón NO tiene la clase 'active', se la añade.
        //    - Si el botón SÍ tiene la clase 'active', se la quita.
        boton.classList.toggle("active");
        aplicarFiltrosCombinados();
      });
    });
  }
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      searchbar.value = "";
      textoBusqueda = "";
      botonesDeFiltro.forEach((boton) => {
        boton.classList.remove("active");
      });
      aplicarFiltrosCombinados();
    });
  }


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
  // 5. Evento principal: cuando mueves el slider
  volumeSlider.addEventListener("input", () => {
    updateVolume(); // Actualiza el audio
    updateVolumeDisplay(); // Actualiza el número
  });
  togglelogin.addEventListener("click", (event) => {
    event.preventDefault();
    registerForm.classList.remove("hidden");
    loginform.classList.add("hidden");
    authtitle.textContent = "Registrarse";
  });
  toggleregister.addEventListener("click", (event) => {
    event.preventDefault();
    registerForm.classList.add("hidden");
    loginform.classList.remove("hidden");
    authtitle.textContent = "Iniciar Sesión";
  });
  AuthButton.addEventListener("click", () => {
    openAuthModal();
  });

  AuthCloseButton.addEventListener("click", () => {
    closeAuthModal();
  });
  Overlay.addEventListener("click", (event) => {
    // 'event.target' es el elemento exacto donde hiciste clic.
    // Comprobamos si donde hiciste clic (event.target)
    // es el overlay MISMO, y no uno de sus hijos (como el modal).
    if (event.target === Overlay) {
      closeAuthModal(); // Llama a la misma función de cierre
    }
  });
  addServantCloseButton.addEventListener("click", () => {
    closeAddServantModal();
  });
  addServantButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // 1. Encuentra la tarjeta padre del botón que se ha pulsado
      const servantCardElement = event.currentTarget.closest('.servant_card');
      // 2. Lee el dataset de la tarjeta, no del botón
      const servantData = servantCardElement.dataset;
      populateAddServantModal(servantData);

      openAddServantModal();
    });
  });
  addServantModal.addEventListener("click", (event) => {
    // 'event.target' es el elemento exacto donde hiciste clic.
    // Comprobamos si donde hiciste clic (event.target)
    // es el overlay MISMO, y no uno de sus hijos (como el modal).
    if (event.target === addServantModal) {
      closeAddServantModal(); // Llama a la misma función de cierre
    }
  });
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
      // ¡Éxito! Cierra el modal
      closeAddServantModal();
    }
  });

  // 6. Carga inicial: Pone todo en su sitio
  updateVolume();
  updateVolumeDisplay();
});
