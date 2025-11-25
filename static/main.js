/**
 * ============================================================
 * MAIN.JS - FGO Dashboard
 * ============================================================
 * Archivo principal que coordina toda la lógica del frontend.
 * Usa ES6 Modules para imports y arquitectura modular.
 * ============================================================
 */

import { renderLayout } from './js/ui/layout.js';
import { initAuthUI, updateAuthStateUI } from './js/ui/authUI.js';
import { onAuthStateChange } from './js/services/auth.js';
import { cargarDatosDePagina } from './js/controllers/pageController.js';
import { initFilters } from './js/ui/filters.js';
import { initAudio } from './js/ui/audio.js';
import { initModals } from './js/ui/modals.js';
import { initCustomSelect } from './js/ui/customSelect.js';
import { initUpdateMode } from './js/ui/updateMode.js';
import { getStaticPath } from './js/utils/routing.js';

document.addEventListener("DOMContentLoaded", async () => {

  // 1. Ruta Base
  const staticPath = getStaticPath();
  console.log('📁 Ruta base detectada:', staticPath);

  // 2. Renderizar Layout (Sidebar, Navbar)
  renderLayout();

  // 3. Inicializar UI Components
  initFilters();
  initAudio();
  initModals();
  initAuthUI();

  // 3.1 Inicializar Custom Select integrado con filtros (solo en página mis-servants)
  if (document.getElementById('ms-custom-select')) {
    initCustomSelect((value, text) => {
      console.log(`🔄 Ordenar servants por: ${text} (${value})`);

      // Integrar con el filter manager
      if (window.servantFilterManager) {
        window.servantFilterManager.setSortBy(value);
      }
    });
  }

  // 3.2 Inicializar Update Mode (solo en página mis-servants)
  if (document.getElementById('ms-update-button')) {
    initUpdateMode();
  }

  // 4. Manejar Estado de Autenticación y Carga de Datos
  onAuthStateChange((evento, sesion) => {
    updateAuthStateUI(sesion);
    cargarDatosDePagina(sesion);
  });

});
