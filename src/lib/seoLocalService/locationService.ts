// src/lib/seoLocalService/locationService.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import brightLocalApiClient from './client'; // Nuestro cliente Axios configurado
import {
  BrightLocalCreateLocationPayload,
  BrightLocalCreateLocationResponse,
  ClientLocationSupabaseRow,
  // --- INICIO: Tipos añadidos para categorías ---
  BrightLocalGetBusinessCategoriesResponse,
  BrightLocalBusinessCategoryItem,
  BrightLocalBusinessCategorySupabaseRow,
  // --- FIN: Tipos añadidos para categorías ---
} from './types';

// Inicializar el cliente de Supabase para operaciones del lado del servidor.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient;

if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
} else {
  console.warn(
    'Las variables de entorno de Supabase (URL o Service Role Key) no están configuradas. Las operaciones de base de datos fallarán.'
  );
  // Crear un cliente "dummy" o manejar el error de forma que no rompa la app al importar el módulo
  // Esto es solo un placeholder para evitar errores en tiempo de importación si las keys no están.
  // En un entorno real, querrías asegurar que estas keys siempre estén presentes o manejar el error de forma más robusta.
  supabaseAdmin = {
    from: () => ({
      select: async () => ({ data: null, error: { message: 'Supabase client not initialized' } }),
      insert: async () => ({ data: null, error: { message: 'Supabase client not initialized' } }),
      update: async () => ({ data: null, error: { message: 'Supabase client not initialized' } }),
      delete: async () => ({ data: null, error: { message: 'Supabase client not initialized' } }),
      upsert: async () => ({ data: null, error: { message: 'Supabase client not initialized' } }),
    }),
    // Añade otros métodos de Supabase que uses si es necesario para el dummy client
  } as unknown as SupabaseClient;
}


/**
 * Crea una nueva ubicación en la API de BrightLocal.
 */
export async function createLocationInBrightLocal(
  payload: BrightLocalCreateLocationPayload
): Promise<BrightLocalCreateLocationResponse> {
  try {
    const response = await brightLocalApiClient.post<BrightLocalCreateLocationResponse>(
      '/manage/v1/locations',
      payload
    );
    return { success: true, ...response.data };
  } catch (error: any) {
    console.error('Error al crear la ubicación en BrightLocal:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error desconocido al contactar BrightLocal',
      location_id: -1, // O un valor que indique fallo
      ...(error.response?.data || {}),
    };
  }
}

/**
 * Guarda o actualiza (upsert) una ubicación en la tabla 'client_locations' de Supabase.
 */
export async function upsertSupabaseLocation(
  locationData: Partial<ClientLocationSupabaseRow> & { brightlocal_location_reference: string }
): Promise<ClientLocationSupabaseRow | null> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase no está configurado. No se puede guardar la ubicación.");
    return null;
  }

  const dataToUpsert = {
    ...locationData,
    additional_urls: locationData.additional_urls ? JSON.stringify(locationData.additional_urls) : null,
    opening_hours: locationData.opening_hours ? JSON.stringify(locationData.opening_hours) : null,
    social_profiles: locationData.social_profiles ? JSON.stringify(locationData.social_profiles) : null,
    images_data: locationData.images_data ? JSON.stringify(locationData.images_data) : null,
    licenses_info: locationData.licenses_info ? JSON.stringify(locationData.licenses_info) : null,
    white_label_settings: locationData.white_label_settings ? JSON.stringify(locationData.white_label_settings) : null,
  };

  if (dataToUpsert.id === undefined || dataToUpsert.id === null) {
    delete dataToUpsert.id;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('client_locations')
      .upsert(dataToUpsert as any, {
        onConflict: 'brightlocal_location_reference',
      })
      .select()
      .single();

    if (error) {
      console.error('Error al guardar/actualizar la ubicación en Supabase:', error);
      throw error;
    }
    return data as ClientLocationSupabaseRow;
  } catch (error) {
    return null;
  }
}


// --- INICIO: Funciones añadidas para categorías de negocios ---

/**
 * Obtiene las categorías de negocios de la API de BrightLocal para un país específico.
 */
export async function getBusinessCategoriesFromBrightLocal(
  countryCode: string
): Promise<BrightLocalGetBusinessCategoriesResponse> {
  if (!countryCode || countryCode.length !== 3) {
    const errorMessage = 'Código de país inválido. Debe ser un código ISO 3.';
    console.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
      total_count: 0,
      items: [],
    };
  }

  try {
    const response = await brightLocalApiClient.get<BrightLocalGetBusinessCategoriesResponse>(
      `/manage/v1/business-categories/${countryCode.toUpperCase()}`
    );

    const totalCount = typeof response.data.total_count === 'string'
      ? parseInt(response.data.total_count, 10)
      : response.data.total_count || 0; // Asegurar que sea un número

    return { success: true, ...response.data, total_count: totalCount };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || `Error desconocido al contactar BrightLocal para categorías de ${countryCode}`;
    console.error(`Error al obtener categorías de BrightLocal para ${countryCode}:`, error.response?.data || error.message);
    return {
      success: false,
      message: errorMessage,
      total_count: 0,
      items: [],
      ...(error.response?.data || {}),
    };
  }
}

/**
 * Guarda o actualiza (upsert) las categorías de negocios en la tabla 'brightlocal_business_categories' de Supabase.
 */
export async function upsertBusinessCategoriesInSupabase(
  categories: BrightLocalBusinessCategoryItem[],
  countryCode: string
): Promise<BrightLocalBusinessCategorySupabaseRow[] | null> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase no está configurado. No se pueden guardar las categorías.");
    return null;
  }
  if (!categories || categories.length === 0) {
    return []; // Nada que hacer
  }

  const categoriesToUpsert: BrightLocalBusinessCategorySupabaseRow[] = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    country_code: countryCode.toUpperCase(),
    last_synced_at: new Date().toISOString(),
    // created_at se manejará por el DEFAULT de la DB en la primera inserción
  }));

  try {
    const { data, error } = await supabaseAdmin
      .from('brightlocal_business_categories')
      .upsert(categoriesToUpsert, {
        onConflict: 'id', // El ID de BrightLocal es la PK y el campo de conflicto
        // ignoreDuplicates: false // default es true para upsert, si quieres error en duplicados sin actualizar, pon false
      })
      .select();

    if (error) {
      console.error('Error al guardar/actualizar categorías en Supabase:', error);
      throw error;
    }

    return data as BrightLocalBusinessCategorySupabaseRow[];
  } catch (error) {
    return null;
  }
}
// --- FIN: Funciones añadidas para categorías de negocios ---