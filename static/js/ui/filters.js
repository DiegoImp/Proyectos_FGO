
export function initFilters() {
    const searchbar = document.getElementById("search-bar");
    const filterbutton = document.getElementById("button-filter");
    const sidebar = document.getElementById("sidebar-filtro");
    const botonesDeFiltro = document.querySelectorAll(
        ".filtro_class button, .filtro_rarity button, .filtro_NP button"
    );
    const resetButton = document.getElementById("reset-filter");
    let textoBusqueda = "";

    function aplicarFiltrosCombinados() {
        // Re-seleccionar tarjetas cada vez (por si se re-renderizaron)
        const servantCards = document.querySelectorAll(".servant_card");

        const botonesClaseActivos = document.querySelectorAll(".filtro_class button.active");
        const botonesRarezaActivos = document.querySelectorAll(".filtro_rarity button.active");
        const botonesNPActivos = document.querySelectorAll(".filtro_NP button.active");

        const clasesActivas = Array.from(botonesClaseActivos).map((boton) => boton.dataset.value.toLowerCase());
        const rarezasActivas = Array.from(botonesRarezaActivos).map((boton) => boton.dataset.value);
        const NPActivos = Array.from(botonesNPActivos).map((boton) => boton.dataset.value);

        servantCards.forEach((card) => {
            const { name: nombre, rarity: rareza, class: clase, np } = card.dataset;

            const pasaNombre = nombre.includes(textoBusqueda);
            const pasaRareza = rarezasActivas.length === 0 || rarezasActivas.includes(rareza);
            const pasaClase = clasesActivas.length === 0 || clasesActivas.includes(clase);
            const pasaNp = NPActivos.length === 0 || NPActivos.includes(np);

            card.style.display = (pasaNombre && pasaRareza && pasaClase && pasaNp) ? "flex" : "none";
        });
    }

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
