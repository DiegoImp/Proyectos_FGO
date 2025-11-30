
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
        .select('servant_id, level, skill_1, skill_2, skill_3, np_level, bond_level, is_favorite');
}

export async function fetchUserServantIds() {
    return await window.clienteSupabase
        .from('user_servants')
        .select('servant_id');
}

export async function addServantToUser(servantData) {
    return await window.clienteSupabase.from('user_servants').insert([servantData]);
}

export async function updateServantData(servantId, updates) {
    try {
        // Verificar que el usuario esté autenticado
        const { data: userData, error: userError } = await window.clienteSupabase.auth.getUser();

        if (userError || !userData?.user) {
            console.error('❌ Error de autenticación al actualizar servant:', userError?.message);
            return { data: null, error: userError || new Error('Usuario no autenticado') };
        }

        // Actualizar datos del servant (RLS garantiza que solo se actualicen datos del usuario actual)
        const { data, error } = await window.clienteSupabase
            .from('user_servants')
            .update(updates)
            .eq('servant_id', servantId)
            .eq('user_id', userData.user.id)
            .select();

        if (error) {
            console.error('❌ Error al actualizar servant en base de datos:', error.message);
            return { data: null, error };
        }

        if (!data || data.length === 0) {
            console.warn('⚠️ No se encontró el servant para actualizar');
            return { data: null, error: new Error('Servant no encontrado') };
        }

        console.log('✅ Servant actualizado correctamente:', servantId);
        return { data, error: null };

    } catch (err) {
        console.error('❌ Error inesperado al actualizar servant:', err);
        return { data: null, error: err };
    }
}

export async function deleteServantData(servantId) {
    try {
        // Verificar que el usuario esté autenticado
        const { data: userData, error: userError } = await window.clienteSupabase.auth.getUser();

        if (userError || !userData?.user) {
            console.error('❌ Error de autenticación al eliminar servant:', userError?.message);
            return { data: null, error: userError || new Error('Usuario no autenticado') };
        }

        // Eliminar servant (RLS garantiza que solo se eliminen datos del usuario actual)
        const { data, error } = await window.clienteSupabase
            .from('user_servants')
            .delete()
            .eq('servant_id', servantId)
            .eq('user_id', userData.user.id)
            .select();

        if (error) {
            console.error('❌ Error al eliminar servant de base de datos:', error.message);
            return { data: null, error };
        }

        if (!data || data.length === 0) {
            console.warn('⚠️ No se encontró el servant para eliminar');
            return { data: null, error: new Error('Servant no encontrado') };
        }

        console.log('✅ Servant eliminado correctamente:', servantId);
        return { data, error: null };

    } catch (err) {
        console.error('❌ Error inesperado al eliminar servant:', err);
        return { data: null, error: err };
    }
}
