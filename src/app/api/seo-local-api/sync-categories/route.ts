import { NextRequest, NextResponse } from 'next/server';
import {
  getBusinessCategoriesFromBrightLocal,
  upsertBusinessCategoriesInSupabase,
} from '@/lib/seoLocalService/locationService'; // O categoryService si lo separaste

// Puedes añadir la opción dynamic para asegurar que sea dinámico, aunque GET por defecto suele serlo.
export const dynamic = 'force-dynamic';

// Este endpoint podría ser un GET si el país se pasa como query param,
// o un POST si se envía en el body. Usemos GET con query param por simplicidad.
// Ejemplo de llamada: /api/seo-local-api/sync-categories?country=USA
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countryCode = searchParams.get('country');

  if (!countryCode) {
    return NextResponse.json({ error: 'Parámetro "country" (código ISO 3) es requerido.' }, { status: 400 });
  }

  if (countryCode.length !== 3) {
      return NextResponse.json({ error: 'El parámetro "country" debe ser un código ISO 3 válido (ej. USA, CAN).' }, { status: 400 });
  }

  try {
    // 1. Obtener categorías de BrightLocal
    const brightLocalResponse = await getBusinessCategoriesFromBrightLocal(countryCode.toUpperCase());

    if (!brightLocalResponse.success || !brightLocalResponse.items) {
      return NextResponse.json(
        { error: 'Falló la obtención de categorías del proveedor externo.', details: brightLocalResponse.message },
        { status: 502 }
      );
    }

    if (brightLocalResponse.items.length === 0) {
      return NextResponse.json(
        { message: `No se encontraron categorías para el país ${countryCode.toUpperCase()}.`, syncedCount: 0 },
        { status: 200 }
      );
    }

    // 2. Guardar/Actualizar categorías en Supabase
    const savedCategories = await upsertBusinessCategoriesInSupabase(brightLocalResponse.items, countryCode.toUpperCase());

    if (savedCategories === null) {
      // Error al guardar, pero las obtuvimos de BrightLocal.
      // Podrías decidir qué hacer aquí. ¿Devolver las de BrightLocal igualmente?
      return NextResponse.json(
        { error: 'Categorías obtenidas pero falló la sincronización interna. Intenta de nuevo más tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `Sincronización de categorías para ${countryCode.toUpperCase()} completada.`,
        sourceTotal: brightLocalResponse.total_count,
        syncedCount: savedCategories.length,
        categories: savedCategories, // Opcional: devolver las categorías sincronizadas
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error(`Error general en GET /api/seo-local-api/sync-categories?country=${countryCode}:`, error);
    return NextResponse.json({ error: 'Error interno del servidor.', details: error.message }, { status: 500 });
  }
}