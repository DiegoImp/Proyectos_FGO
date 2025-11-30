
import { login, register, googleLogin, logout } from '../services/auth.js';
import { cargarDatosDePagina } from '../controllers/pageController.js';
import { updateAddButtonsState } from './modals.js';

export function initAuthUI() {
    const loginform = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const googleLoginButton = document.getElementById('google-login-button');
    const togglelogin = document.getElementById("auth-toggle-login");
    const toggleregister = document.getElementById("auth-toggle-register");
    const authtitle = document.getElementById("auth-title");
    const AuthModal = document.getElementById("auth-modal");
    const welcomeMessage = document.getElementById("welcome-message");

    const UserProfile = document.getElementById("user-profile");
    const UserProfileName = document.getElementById("user-profile-name");
    const UserIcon = document.getElementById("user-profile-icon");
    const Usermenuemail = document.getElementById("user-email");
    const LogoutButton = document.getElementById("logout-button");
    const AuthButton = document.querySelector(".auth_button");

    if (loginform) {
        loginform.addEventListener("submit", async (evento) => {
            evento.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const authError = document.getElementById('auth-error');

            authError.classList.add('hidden');

            const { error } = await login(email, password);

            if (error) {
                authError.textContent = "Usuario o contraseña incorrectos.";
                authError.classList.remove('hidden');
            } else {
                // Re-query elements to ensure we have current DOM references
                const currentAuthModal = document.getElementById("auth-modal");
                const currentWelcomeMessage = document.getElementById("welcome-message");

                if (currentWelcomeMessage) currentWelcomeMessage.classList.remove('hidden');
                if (currentAuthModal) currentAuthModal.classList.add('hidden');
            }
        });
    }

    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', async () => {
            const { error } = await googleLogin();
            if (error) {
                const authError = document.getElementById('auth-error');
                authError.textContent = 'Error al iniciar sesión con Google.';
                authError.classList.remove('hidden');
                console.error('Error Google OAuth:', error);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (evento) => {
            evento.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const authError = document.getElementById('auth-error');
            authError.classList.add('hidden');

            const { error } = await register(email, password);

            if (error) {
                authError.textContent = error.message;
                authError.classList.remove('hidden');
            } else {
                authtitle.textContent = "¡Revisa tu email para confirmar!";
                registerForm.classList.add('hidden');
            }
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
                const { error } = await logout();
                if (error) console.error('❌ Error al cerrar sesión:', error.message);
            });
        }
    }
}

export function updateAuthStateUI(session) {
    const UserProfile = document.getElementById("user-profile");
    const UserProfileName = document.getElementById("user-profile-name");
    const UserIcon = document.getElementById("user-profile-icon");
    const AuthButton = document.querySelector(".auth_button");

    if (session) {
        const nombreUsuario = session.user.email.split('@')[0];
        window.currentUserEmail = nombreUsuario;

        if (UserProfileName) UserProfileName.textContent = nombreUsuario;
        if (UserIcon) UserIcon.textContent = nombreUsuario.charAt(0).toUpperCase();
        if (AuthButton) AuthButton.classList.add('hidden');
        if (UserProfile) UserProfile.classList.remove('hidden');

        updateAddButtonsState();
    } else {
        if (AuthButton) AuthButton.classList.remove("hidden");
        if (UserProfile) UserProfile.classList.add("hidden");
    }
}
