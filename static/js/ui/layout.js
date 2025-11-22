import { getStaticPath, getCurrentPage } from '../utils/routing.js';

export function renderLayout() {
    const staticPath = getStaticPath();
    const currentPage = getCurrentPage();

    // 1. Sidebar
    const sidebarHTML = `
    <aside class="sidebar_index">
      <header class="index_header">Menu</header>
      <hr />
      <ul class="index_list">
        <li>
          <a href="${staticPath}/index.html" class="index_element ${currentPage === 'index' ? 'active' : ''}">
            <img src="${staticPath}/static/icons/base-page/search-icon.svg" class="sidebar_icon" alt="Icono Buscador" />
            <div class="sidebar_hide"><span class="index_text">Buscador</span></div>
          </a>
        </li>
        <li>
          <a href="${staticPath}/pages/calculadora.html" class="index_element ${currentPage === 'calculadora' ? 'active' : ''}">
            <img src="${staticPath}/static/icons/base-page/calculator-icon.svg" class="sidebar_icon" alt="Icono Calculadora" />
            <div class="sidebar_hide"><span class="index_text">Calculadora</span></div>
          </a>
        </li>
        <li>
          <a href="${staticPath}/pages/mis-servants.html" class="index_element ${currentPage === 'mis-servants' ? 'active' : ''}">
            <img src="${staticPath}/static/icons/base-page/servants-icon.svg" class="sidebar_icon sidebar_icon--servant" alt="Icono Mis Servants" />
            <div class="sidebar_hide"><span class="index_text index_text--servants">Mis Servants</span></div>
          </a>
        </li>
        <li>
          <a href="${staticPath}/pages/tierlist.html" class="index_element ${currentPage === 'tierlist' ? 'active' : ''}">
            <img src="${staticPath}/static/icons/base-page/tier-icon.svg" class="sidebar_icon sidebar_icon--tier" alt="Icono de Tier List" />
            <div class="sidebar_hide"><span class="index_text">Tier Lists</span></div>
          </a>
        </li>
        <li>
          <a href="${staticPath}/pages/fgodle.html" class="index_element ${currentPage === 'fgodle' ? 'active' : ''}">
            <img src="${staticPath}/static/icons/base-page/game-icon.svg" class="sidebar_icon sidebar_icon--game" alt="Icono de Fgodle" />
            <div class="sidebar_hide"><span class="index_text">Fgodle</span></div>
          </a>
        </li>
        <li>
          <div class="index_element index_element--music">
            <div class="sound-column-icon">
              <img src="${staticPath}/static/icons/base-page/sound-icon.svg" class="sidebar_icon sidebar_icon--music" alt="Icono de Música" />
              <span id="volume-display">20</span>
            </div>
            <div class="sidebar_hide sidebar_hide--music">
              <span class="index_text index_text--music">ON/OFF Music</span>
              <div class="range-wrap">
                <input type="range" id="volume-slider" min="0" max="100" value="20" class="range" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </aside>
    `;

    // 2. Auth Nav
    const authHTML = `
    <nav class="auth_container">
      <button id="auth-open-button" class="auth_button">
        <span>Iniciar Sesión</span>
        <span class="input_separator input_separator--user"></span>
        <img src="${staticPath}/static/icons/base-page/account-icon.svg" alt="Icono de cuenta de usuario" />
      </button>
      <div id="user-profile" class="auth_user hidden">
        <span id="user-profile-name"></span>
        <span id="user-input-separator" class="input_separator input_separator--user"></span>
        <div id="user-profile-icon" class="profile_icon"><span></span></div>
        <div class="user_menu">
          <span id="user-email"></span>
          <button id="logout-button" class="logout_button">
            <span>Cerrar Sesión</span>
            <img src="${staticPath}/static/icons/base-page/logout-icon.svg" alt="Icono de cerrar sesión" class="logout_icon" />
          </button>
        </div>
      </div>
    </nav>
    `;

    // 3. Modales (Auth + Add Servant)
    const modalsHTML = `
    <!-- Modal de Autenticación -->
    <div id="login-modal" class="modal_overlay">
      <div id="auth-modal">
        <button id="auth-close-button" class="modal_close">&times;</button>
        <h2 id="auth-title">Iniciar Sesión</h2>
        <hr class="login" />
        <form id="login-form" class="auth_form">
          <div class="login_input">
            <img src="${staticPath}/static/icons/base-page/email-icon.svg" alt="Icono de email" class="auth_icon" />
            <span class="input_separator">|</span>
            <input id="login-email" type="email" placeholder="Correo electrónico" class="auth_input" required />
          </div>
          <div class="login_input">
            <img src="${staticPath}/static/icons/base-page/password-icon.svg" alt="Icono de contraseña" class="auth_icon" />
            <span class="input_separator">|</span>
            <input id="login-password" type="password" placeholder="Contraseña" class="auth_input" required />
          </div>
          <button type="submit" class="auth_submit_button">Iniciar Sesión</button>
          <div class="auth_toggle_container">
            <span id="auth-toggle-text">¿No tienes cuenta?</span>
            <button id="auth-toggle-login" class="auth_toggle_button">Regístrate</button>
          </div>
        </form>
        <form id="register-form" class="auth_form hidden">
          <div class="login_input">
            <img src="${staticPath}/static/icons/base-page/email-icon.svg" alt="Icono de email" class="auth_icon" />
            <span class="input_separator">|</span>
            <input id="register-email" type="email" placeholder="Correo electrónico" class="auth_input" required />
          </div>
          <div class="login_input">
            <img src="${staticPath}/static/icons/base-page/password-icon.svg" alt="Icono de contraseña" class="auth_icon" />
            <span class="input_separator">|</span>
            <input id="register-password" type="password" placeholder="Contraseña" class="auth_input" required />
          </div>
          <button type="submit" class="auth_submit_button">Registrarse</button>
          <div class="auth_toggle_container">
            <span id="auth-toggle-text">¿Ya tienes una cuenta?</span>
            <button id="auth-toggle-register" class="auth_toggle_button">Inicia Sesión</button>
          </div>
        </form>
        <div class="auth_separator"><span>O</span></div>
        <button id="google-login-button" class="auth_google_button"><span>Iniciar sesión con Google</span></button>
        <p id="auth-error" class="auth_error hidden"></p>
      </div>
      <div id="welcome-message" class="hidden">
        <h2>¡Bienvenido de nuevo, Master!</h2>
        <p style="color: white">Has iniciado sesión correctamente.</p>
        <div id="web-guide">
          <h2>Actividades:</h2>
          <ul>
            <li>Añade servants desde la página principal de búsqueda.</li>
            <li>Ver tus servants y sus stats en <span style="color: #f7b731">Mis Servants</span>.</li>
          </ul>
          <button id="welcome-close-button" class="auth_submit_button">Comenzar</button>
        </div>
      </div>
    </div>

    <!-- Modal de agregar servant -->
    <div id="add-servant-modal" class="modal_overlay">
      <div id="add-window">
        <button id="add-servant-close-button" class="modal_close">&times;</button>
        <h2 id="add-title">Agregar Servant</h2>
        <hr>
        <div id="servant-preview" class="servant_preview">
          <img id="servant-face" src="" alt="Servant Face" class="face_main">
          <div id="preview-details">
            <h2 id="servant-name" class="servant_name">Nombre del Servant</h2>
            <img id="servant-class-icon" src="" alt="Servant Class Icon" class="servant_icon">
          </div>
        </div>
        <hr>
        <form id="add-servant-form" class="add_form">
          <input type="hidden" id="input-servant-id" name="servant_id">
          <div id="level-img-wrapper" class="level_img">Lv</div>
          <label for="input-level" class="add_input_label">Nivel Actual (1-120)</label>
          <input id="input-level" type="number" class="add_input" name="level" min="1" max="120" value="1" required>
          <img id="np-img-wrapper" class="np_img"></img>
          <label for="input-np" class="add_input_label">Nivel de Noble Phantasm (1-5)</label>
          <input id="input-np" type="number" class="add_input" name="np_level" min="1" max="5" value="1" required>
          <img id="bond-img-wrapper" class="bond_img" src="${staticPath}/static/icons/main-page/bondxp.png"></img>
          <label for="input-bond" class="add_input_label">Nivel de Vínculo (0-15)</label>
          <input id="input-bond" type="number" class="add_input" name="bond_level" min="0" max="15" value="0" required>
          <hr>
          <div id="skills-wrapper" class="clase_skills_wrapper"></div>
          <button type="submit" class="auth_submit_button clase_submit_add">Guardar Servant</button>
        </form>
        <p id="add-error" class="auth_error hidden"></p>
      </div>
    </div>
    `;

    // 4. Audio
    const audioHTML = `
    <audio id="ost-player" loop>
      <source src="${staticPath}/static/audio/mi-ost-de-fgo.mp3" type="audio/mpeg" />
    </audio>
    `;

    // Inyectar en el DOM
    document.body.insertAdjacentHTML('afterbegin', authHTML);
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    document.body.insertAdjacentHTML('beforeend', modalsHTML);
    document.body.insertAdjacentHTML('beforeend', audioHTML);
}
