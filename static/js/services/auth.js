
import { CONFIG } from '../config.js';

export async function login(email, password) {
    return await window.clienteSupabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
}

export async function register(email, password) {
    return await window.clienteSupabase.auth.signUp({
        email: email,
        password: password,
    });
}

export async function logout() {
    return await window.clienteSupabase.auth.signOut();
}

export async function googleLogin() {
    return await window.clienteSupabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname
        }
    });
}

export function onAuthStateChange(callback) {
    return window.clienteSupabase.auth.onAuthStateChange(callback);
}
