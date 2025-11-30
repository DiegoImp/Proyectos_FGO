/**
 * ============================================================
 * FILTERS.JS - Sistema de Filtros y Ordenamiento
 * ============================================================
 * Sistema modular para filtrar y ordenar servants.
 * Referencias MDN:
 * - Element.dataset: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
 * - Array.filter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 * - Array.sort: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 * ============================================================
 */

/**
 * Clase para gestionar filtros y ordenamiento de servants
 */
class ServantFilterManager {
    constructor() {
        // Elementos del DOM
        this.container = document.getElementById("servants-container");
        this.searchInput = document.getElementById("search-servant-input");
        this.filterButton = document.getElementById("ms-filter-button");
        this.favoritesToggle = document.getElementById("ms-favorites-toggle");
        this.filtersPanel = document.querySelector(".ms_filters");
        this.utilityContainer = document.querySelector(".utility_mis_servants_container");

        // Botones de filtro
        this.rarityButtons = document.querySelectorAll(".ms_rarity");
        this.classButtons = document.querySelectorAll(".ms_class");
        this.npButtons = document.querySelectorAll(".ms_np");

        // Estado del filtro
        this.state = {
            searchText: "",
            activeRarities: [],
            activeClasses: [],
            activeNPs: [],
            sortBy: "level", // Por defecto ordenar por nivel
            isFiltersOpen: false,
            showOnlyFavorites: false
        };

        // Cache de servants
        this.servants = [];
    }

    /**
     * Inicializa los event listeners
     */
    init() {
        this.setupFilterToggle();
        this.setupFavoritesToggle();
        this.setupSearchInput();
        this.setupFilterButtons();

        // Note: Initial sort is applied after servants are loaded in pageController
    }

    /**
     * Configura el toggle del panel de filtros
     */
    setupFilterToggle() {
        if (this.filterButton && this.filtersPanel) {
            this.filterButton.addEventListener("click", (e) => {
                e.stopPropagation();
                this.state.isFiltersOpen = !this.state.isFiltersOpen;

                if (this.state.isFiltersOpen) {
                    this.filtersPanel.classList.add("open");
                    this.utilityContainer.classList.add("filters-open");
                    this.filterButton.classList.add("active");
                } else {
                    this.filtersPanel.classList.remove("open");
                    this.utilityContainer.classList.remove("filters-open");
                    this.filterButton.classList.remove("active");

                    // Resetear todos los filtros al cerrar el panel
                    this.resetFilters();
                }
            });
        }
    }

    /**
     * Configura el toggle de favoritos
     */
    setupFavoritesToggle() {
        if (this.favoritesToggle) {
            this.favoritesToggle.addEventListener("click", () => {
                this.state.showOnlyFavorites = !this.state.showOnlyFavorites;

                // Toggle visual state
                if (this.state.showOnlyFavorites) {
                    this.favoritesToggle.classList.remove("inactive");
                    this.favoritesToggle.classList.add("active");
                    this.favoritesToggle.title = "Mostrar todos los servants";
                } else {
                    this.favoritesToggle.classList.remove("active");
                    this.favoritesToggle.classList.add("inactive");
                    this.favoritesToggle.title = "Mostrar solo favoritos";
                }

                this.applyFiltersAndSort();
            });

            // Set initial state to inactive
            this.favoritesToggle.classList.add("inactive");
        }
    }

    /**
     * Configura el input de búsqueda
     */
    setupSearchInput() {
        if (this.searchInput) {
            this.searchInput.addEventListener("input", (e) => {
                this.state.searchText = e.target.value.toLowerCase().trim();
                this.applyFiltersAndSort();
            });
        }
    }

    /**
     * Configura los botones de filtro
     */
    setupFilterButtons() {
        // Botones de rareza
        this.rarityButtons.forEach(button => {
            button.addEventListener("click", () => {
                button.classList.toggle("active");
                this.updateActiveFilters();
                this.applyFiltersAndSort();
            });
        });

        // Botones de clase
        this.classButtons.forEach(button => {
            button.addEventListener("click", () => {
                button.classList.toggle("active");
                this.updateActiveFilters();
                this.applyFiltersAndSort();
            });
        });

        // Botones de Noble Phantasm
        this.npButtons.forEach(button => {
            button.addEventListener("click", () => {
                button.classList.toggle("active");
                this.updateActiveFilters();
                this.applyFiltersAndSort();
            });
        });
    }

    /**
     * Actualiza los filtros activos basándose en los botones
     * Usa MDN Element.dataset para acceder a data-attributes
     */
    updateActiveFilters() {
        this.state.activeRarities = Array.from(this.rarityButtons)
            .filter(btn => btn.classList.contains("active"))
            .map(btn => btn.dataset.value);

        this.state.activeClasses = Array.from(this.classButtons)
            .filter(btn => btn.classList.contains("active"))
            .map(btn => btn.dataset.value.toLowerCase());

        this.state.activeNPs = Array.from(this.npButtons)
            .filter(btn => btn.classList.contains("active"))
            .map(btn => btn.dataset.value);
    }

    /**
     * Actualiza la lista de servants desde el DOM
     */
    updateServantsList() {
        const servantElements = document.querySelectorAll(".servant_box_container");
        this.servants = Array.from(servantElements).map(element => ({
            element: element,
            dataset: element.dataset,
            name: (element.dataset.name || "").toLowerCase(),
            rarity: element.dataset.rarity || "",
            class: (element.dataset.class || "").toLowerCase(),
            npType: element.dataset.npType || "",
            level: parseInt(element.dataset.level) || 0,
            atk: parseInt(element.dataset.atk) || 0,
            hp: parseInt(element.dataset.hp) || 0,
            favorite: element.dataset.favorite === 'true'
        }));
    }

    /**
     * Filtra los servants según los criterios activos
     * Usa MDN Array.filter para filtrado eficiente
     * @param {Array} servants - Array de objetos servant
     * @returns {Array} - Servants filtrados
     */
    filterServants(servants) {
        return servants.filter(servant => {
            // Filtro de favoritos (si está activo, solo mostrar favoritos)
            if (this.state.showOnlyFavorites && !servant.favorite) {
                return false;
            }

            // Filtro de búsqueda por nombre (compara desde el inicio del string)
            const matchesSearch = this.state.searchText === "" ||
                servant.name.startsWith(this.state.searchText);

            // Filtro de rareza
            const matchesRarity = this.state.activeRarities.length === 0 ||
                this.state.activeRarities.includes(servant.rarity);

            // Filtro de clase
            const matchesClass = this.state.activeClasses.length === 0 ||
                this.state.activeClasses.includes(servant.class);

            // Filtro de Noble Phantasm
            const matchesNP = this.state.activeNPs.length === 0 ||
                this.state.activeNPs.includes(servant.npType);

            // Retornar true solo si pasa todos los filtros
            return matchesSearch && matchesRarity && matchesClass && matchesNP;
        });
    }

    /**
     * Ordena los servants según el criterio actual
     * Usa MDN Array.sort para ordenamiento
     * @param {Array} servants - Array de servants a ordenar
     * @returns {Array} - Servants ordenados
     */
    sortServants(servants) {
        const sortedServants = [...servants]; // Crear copia para no mutar original

        sortedServants.sort((a, b) => {
            // Priority 1: Favorites always come first
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;

            // Priority 2: Apply selected sort criteria
            switch (this.state.sortBy) {
                case "level":
                    return b.level - a.level; // Descendente

                case "atk":
                    return b.atk - a.atk; // Descendente

                case "hp":
                    return b.hp - a.hp; // Descendente

                case "rarity":
                    // Ordenar por rareza (descendente), luego por nombre
                    const rarityDiff = parseInt(b.rarity) - parseInt(a.rarity);
                    return rarityDiff !== 0 ? rarityDiff : a.name.localeCompare(b.name);

                case "class":
                    // Ordenar alfabéticamente por clase
                    return a.class.localeCompare(b.class);

                case "np":
                    // Ordenar por tipo de NP (Arts=1, Buster=2, Quick=3)
                    return a.npType.localeCompare(b.npType);

                default:
                    return 0;
            }
        });

        return sortedServants;
    }

    /**
     * Aplica filtros y ordenamiento, luego actualiza el DOM
     * Esta es la función principal que coordina todo
     */
    applyFiltersAndSort() {
        // 1. Actualizar lista de servants desde el DOM
        this.updateServantsList();

        // 2. Aplicar filtros
        const filteredServants = this.filterServants(this.servants);

        // 3. Aplicar ordenamiento
        const sortedServants = this.sortServants(filteredServants);

        // 4. Ocultar todos los servants
        this.servants.forEach(servant => {
            servant.element.style.display = "none";
        });

        // 5. Mostrar solo los servants filtrados y ordenados
        sortedServants.forEach((servant, index) => {
            servant.element.style.display = "flex";
            // Aplicar orden visual
            servant.element.style.order = index;
        });

        // 6. Log para debugging (opcional)
        console.log(`📊 Filtros aplicados: ${sortedServants.length}/${this.servants.length} servants mostrados`);
    }

    /**
     * Cambia el criterio de ordenamiento
     * @param {string} sortBy - Criterio de ordenamiento (level, atk, hp, rarity, class, np)
     */
    setSortBy(sortBy) {
        this.state.sortBy = sortBy;
        this.applyFiltersAndSort();
    }

    /**
     * Resetea todos los filtros
     */
    resetFilters() {
        // Limpiar búsqueda
        if (this.searchInput) {
            this.searchInput.value = "";
        }
        this.state.searchText = "";

        // Desactivar todos los botones de filtro
        [...this.rarityButtons, ...this.classButtons, ...this.npButtons].forEach(btn => {
            btn.classList.remove("active");
        });

        // Limpiar filtros activos
        this.state.activeRarities = [];
        this.state.activeClasses = [];
        this.state.activeNPs = [];

        // Aplicar cambios
        this.applyFiltersAndSort();
    }
}

/**
 * Instancia global del filtro manager
 */
let filterManager = null;

/**
 * Inicializa los filtros de la página mis-servants
 */
function initMisServantsFilters() {
    // Crear instancia del filter manager
    filterManager = new ServantFilterManager();
    filterManager.init();

    // Exponer globalmente para que customSelect pueda usarlo
    window.servantFilterManager = filterManager;

    // Log de inicialización
    console.log('✅ Sistema de filtros y ordenamiento inicializado');
    console.log('📋 Opciones de ordenamiento: level, atk, hp, rarity, class, np');
}

/**
 * ============================================================
 * EJEMPLO DE USO DEL API
 * ============================================================
 * 
 * // Obtener el filter manager
 * const manager = window.servantFilterManager;
 * 
 * // Cambiar ordenamiento programáticamente
 * manager.setSortBy('atk');  // Ordenar por ATK
 * manager.setSortBy('hp');   // Ordenar por HP
 * manager.setSortBy('rarity'); // Ordenar por rareza
 * 
 * // Resetear todos los filtros
 * manager.resetFilters();
 * 
 * // Forzar actualización (útil después de cargar datos nuevos)
 * manager.applyFiltersAndSort();
 * 
 * ============================================================
 */

/**
 * Inicializa los filtros de la página principal (index)
 */
function initMainPageFilters() {
    const searchbar = document.getElementById("search-bar");
    const filterbutton = document.getElementById("button-filter");
    const sidebar = document.getElementById("sidebar-filtro");
    const botonesDeFiltro = document.querySelectorAll(
        ".filtro_class button, .filtro_rarity button, .filtro_NP button"
    );
    const resetButton = document.getElementById("reset-filter");
    let textoBusqueda = "";

    function aplicarFiltrosCombinados() {
        const servantCards = document.querySelectorAll(".servant_card");

        const botonesClaseActivos = document.querySelectorAll(".filtro_class button.active");
        const botonesRarezaActivos = document.querySelectorAll(".filtro_rarity button.active");
        const botonesNPActivos = document.querySelectorAll(".filtro_NP button.active");

        const clasesActivas = Array.from(botonesClaseActivos).map((boton) => boton.dataset.value.toLowerCase());
        const rarezasActivas = Array.from(botonesRarezaActivos).map((boton) => boton.dataset.value);
        const NPActivos = Array.from(botonesNPActivos).map((boton) => boton.dataset.value);

        servantCards.forEach((card) => {
            const { name: nombre, rarity: rareza, class: clase, np } = card.dataset;

            const pasaNombre = nombre.startsWith(textoBusqueda);
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
            sidebar.classList.toggle("sidebar_filtro_visible");
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
 * Función principal que inicializa los filtros según la página
 */
export function initFilters() {
    // Detectar qué página estamos usando
    if (document.querySelector(".mis_servants_page")) {
        initMisServantsFilters();
    } else {
        initMainPageFilters();
    }
}
