document.addEventListener("DOMContentLoaded", () => {
  const searchbar = document.getElementById("search-bar"); // tomamos la barra de busqueda
  const servantLinks = document.querySelectorAll(".details_link"); // tomamos los link
  const filterbutton = document.getElementById("button-filter"); //tomamos el boton de filtros
  const sidebar = document.getElementById("sidebar"); //tomamos el sidebar

  filterbutton.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-visible");
  });

  searchbar.addEventListener("input", () => {
    // esperamos un input en la barra
    const textoBusqueda = searchbar.value.toLowerCase(); // extraemos la cadena de caracteres en lower case

    servantLinks.forEach((link) => {
      const servantCard = link.querySelector(".servant_card");
      const nombreDeLaTarjeta = servantCard.dataset.name;

      if (nombreDeLaTarjeta.includes(textoBusqueda)) {
        link.style.display = "block";
      } else {
        link.style.display = "none";
      }
    });
  });
  // --- LÓGICA PARA BOTONES DE FILTRO ---
  // 1. Seleccionamos TODOS los botones que están dentro de los contenedores de filtros
  const botonesDeFiltro = document.querySelectorAll(
    ".filtro_class button, .filtro_rarity button, .filtro_NP button"
  );

  // 2. Recorremos cada uno de los botones encontrados
  botonesDeFiltro.forEach((boton) => {
    // 3. A cada botón, le añadimos un "escuchador" de clics
    boton.addEventListener("click", () => {
      // 4. classList.toggle('active') hace la magia:
      //    - Si el botón NO tiene la clase 'active', se la añade.
      //    - Si el botón SÍ tiene la clase 'active', se la quita.
      boton.classList.toggle("active");
    });
  });
});
