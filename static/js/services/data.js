
import { getStaticPath } from '../utils/routing.js';

export async function fetchAllServants() {
    const staticPath = getStaticPath();
    const response = await fetch(`${staticPath}/static/data/main_page_servants.json`);
    if (!response.ok) throw new Error("No se pudo cargar servants");
    return await response.json();
}

export async function fetchUserServants() {
    return await window.clienteSupabase
        .from('user_servants')
        .select('servant_id, level, skill_1, skill_2, skill_3, np_level, bond_level');
}

export async function fetchUserServantIds() {
    return await window.clienteSupabase
        .from('user_servants')
        .select('servant_id');
}

export async function addServantToUser(servantData) {
    return await window.clienteSupabase.from('user_servants').insert([servantData]);
}
