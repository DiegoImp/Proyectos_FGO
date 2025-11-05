document.addEventListener("DOMContentLoaded", () => {
  const searchbar = document.getElementById("search-bar"); // tomamos la barra de busqueda
  const filterbutton = document.getElementById("button-filter"); //tomamos el boton de filtros
  const sidebar = document.getElementById("sidebar-filtro"); //tomamos el sidebar
  const botonesDeFiltro = document.querySelectorAll(
    ".filtro_class button, .filtro_rarity button, .filtro_NP button"
  );
  const servantLinks = document.querySelectorAll(".details_link");
  const resetButton = document.getElementById("reset-filter");

  const audioPlayer = document.getElementById("ost-player");
  const volumeSlider = document.getElementById("volume-slider");

  const soundControl = document.querySelector(".index_element--music");

  const volumeDisplay = document.getElementById("volume-display");
  // Definimos esta variable aquí para que esté disponible para todas las funciones
  let textoBusqueda = "";

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
    // tomamos los link
    servantLinks.forEach((link) => {
      const servantCard = link.querySelector(".servant_card");
      const nombre = servantCard.dataset.name;
      const rareza = servantCard.dataset.rarity;
      const clase = servantCard.dataset.class;
      const np = servantCard.dataset.np;

      const pasaNombre = nombre.includes(textoBusqueda);
      const pasaRareza =
        rarezasActivas.length === 0 || rarezasActivas.includes(rareza);
      const pasaClase =
        clasesActivas.length === 0 || clasesActivas.includes(clase);
      const pasaNp = NPActivos.length === 0 || NPActivos.includes(np);
      if (pasaNombre && pasaRareza && pasaClase && pasaNp) {
        link.style.display = "block";
      } else {
        link.style.display = "none";
      }
    });
  }
  searchbar.addEventListener("input", (evento) => {
    textoBusqueda = evento.target.value.toLowerCase().trim();
    aplicarFiltrosCombinados();
  });

  filterbutton.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-filtro-visible");
  });

  // --- LÓGICA PARA BOTONES DE FILTRO ---
  // 1. Seleccionamos TODOS los botones que están dentro de los contenedores de filtros

  // 2. Recorremos cada uno de los botones encontrados
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
  resetButton.addEventListener("click", () => {
    searchbar.value = "";
    textoBusqueda = "";
    botonesDeFiltro.forEach((boton) => {
      boton.classList.remove("active");
    });
    aplicarFiltrosCombinados();
  });

  function updateVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
  }
  function updateVolumeDisplay() {
    volumeDisplay.textContent = volumeSlider.value;
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

  // 6. Carga inicial: Pone todo en su sitio
  updateVolume();
  updateVolumeDisplay();
});
