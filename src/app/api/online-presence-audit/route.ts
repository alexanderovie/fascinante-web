// src/app/api/online-presence-audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
// Importa createServerClient directamente de @supabase/ssr para Route Handlers
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// --- Interfaces (copiadas del frontend para consistencia) ---
interface BusinessFormData {
  businessName: string;
  countryCode: string; // Este debería ser el código de 3 letras (ej. USA) para BrightLocal
  postalCode?: string;
  streetAddress?: string; // El frontend debe enviar streetAddressLine1 aquí
  city?: string;
  region?: string; // Nombre completo del estado/provincia
  phone?: string;
  website?: string;
  // googlePlaceId, etc. no son necesarios para el payload de BrightLocal 'Find Profile' directamente
  // pero pueden ser útiles si decides guardar el intento de auditoría.
}

interface DirectoryListingStatus {
  directoryId: string;
  directoryName: string;
  directoryUrl?: string;
  isListed: boolean;
  listingUrl?: string;
}

interface PresenceAuditResult {
  businessInfo: Partial<BusinessFormData>; // Usar Partial para que coincida con lo que el frontend envía
  summary: {
    totalDirectoriesChecked: number;
    foundIn: number;
    notFoundIn: number;
  };
  listings: DirectoryListingStatus[];
  errors?: string[];
}

interface BrightLocalDirectoryFromDB {
  id: string;
  name: string;
  generic_url?: string | null;
  supported_countries: string[];
  country_specific_urls?: Record<string, string> | null;
}

// --- Constantes ---
const BRIGHTLOCAL_API_KEY = process.env.BRIGHTLOCAL_API_KEY;
const BRIGHTLOCAL_FIND_PROFILE_ENDPOINT = 'https://api.brightlocal.com/data/v1/listings/find-profile';

export async function POST(request: NextRequest) {
  // Verificar si la API Key de BrightLocal está configurada
  if (!BRIGHTLOCAL_API_KEY) {
    console.error('Error: BRIGHTLOCAL_API_KEY no está configurada en el servidor.');
    return NextResponse.json({ errors: ['Server configuration error for external API Key.'] }, { status: 500 });
  }

  let businessData: BusinessFormData;
  try {
    businessData = await request.json();
  } catch (e) {
    console.error('Error parsing request body:', e);
    return NextResponse.json({ errors: ['Invalid request body.'] }, { status: 400 });
  }

  // Validar datos de entrada básicos (asegúrate que countryCode sea el de 3 letras aquí)
  if (!businessData.businessName || !businessData.countryCode || businessData.countryCode.length !== 3) {
    return NextResponse.json({ errors: ['Business name and a valid 3-letter country code are required.'] }, { status: 400 });
  }

  // --- INICIALIZACIÓN CORRECTA DEL CLIENTE SUPABASE PARA ROUTE HANDLER ---
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Para leer directorios, la anon_key es usualmente suficiente si los permisos están bien.
    // Si necesitas service_role por alguna razón, asegúrate que esté definida.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // No es común necesitar 'set' en un GET o en este POST que no maneja sesión de usuario
        },
        remove(name: string, options: CookieOptions) {
          // No es común necesitar 'remove' aquí
        },
      },
    }
  );
  // --- FIN DE INICIALIZACIÓN CORRECTA ---

  try {
    console.log(`[API OnlinePresenceAudit] Iniciando auditoría para: ${businessData.businessName}, País: ${businessData.countryCode}`);
    console.log(`[API OnlinePresenceAudit] Datos recibidos del frontend:`, businessData);

    // Prepara el cuerpo de la solicitud para BrightLocal "Find Profile"
    // Consulta la documentación para los campos exactos de "Find Profile"
    const brightLocalPayload: any = {
      'business-name': businessData.businessName,
      country: businessData.countryCode, // Ya debería ser 3 letras
    };
    if (businessData.postalCode) brightLocalPayload.postcode = businessData.postalCode;
    // El endpoint "Find Profile" puede ser más simple y solo necesitar nombre, país y quizás código postal/teléfono.
    // El payload que tenías antes era para "Create Location". Ajusta según el endpoint que uses.
    // Si "Find Profile" necesita "address", "city", "region", añádelos.
    // Por ejemplo, si Find Profile usa "address.address1", "address.city", etc.:
    if (businessData.streetAddress) brightLocalPayload.address = businessData.streetAddress; // O un objeto address
    if (businessData.city) brightLocalPayload.city = businessData.city; // O dentro de address
    if (businessData.phone) brightLocalPayload.phone = businessData.phone;


    let foundListingsFromBL: Array<{ directory: string; url?: string; [key: string]: any }> = [];

    try {
      console.log('[API OnlinePresenceAudit] Enviando solicitud a BrightLocal Find Profile:', BRIGHTLOCAL_FIND_PROFILE_ENDPOINT);
      console.log('[API OnlinePresenceAudit] Payload para BrightLocal Find Profile:', brightLocalPayload);

      const brightLocalResponse = await axios.post(BRIGHTLOCAL_FIND_PROFILE_ENDPOINT, brightLocalPayload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': BRIGHTLOCAL_API_KEY,
        },
      });
      
      console.log('[API OnlinePresenceAudit] Respuesta de BrightLocal (Find Profile) recibida, status:', brightLocalResponse.status);
      // NECESITAS ADAPTAR ESTO A LA RESPUESTA REAL DE "FIND PROFILE"
      // La estructura de respuesta de "Find Profile" puede ser diferente a la de "Fetch Profile"
      // Ejemplo MUY ASUMIDO:
      if (brightLocalResponse.data && brightLocalResponse.data.success && brightLocalResponse.data.results) {
        // 'find-profile' puede devolver un array de perfiles. Tomamos el primero.
        const profileMatch = brightLocalResponse.data.results[0];
        if (profileMatch && profileMatch.listings && Array.isArray(profileMatch.listings)) {
          foundListingsFromBL = profileMatch.listings; // Asume que cada item en listings tiene 'directory' y 'url'
        } else if (profileMatch && profileMatch.matches && Array.isArray(profileMatch.matches)) {
            // Otra estructura posible para 'find-profile'
            foundListingsFromBL = profileMatch.matches;
        }
      } else if (brightLocalResponse.data && Array.isArray(brightLocalResponse.data.listings)) {
        // Si el endpoint devolviera directamente un array de listings
        foundListingsFromBL = brightLocalResponse.data.listings;
      }
      console.log(`[API OnlinePresenceAudit] Listados encontrados en BrightLocal: ${foundListingsFromBL.length}`);

    } catch (blError: any) {
      console.error('[API OnlinePresenceAudit] Error llamando a la API de BrightLocal (Find Profile):', blError.response?.data || blError.message);
      // Considera cómo manejar esto. Por ahora, continuamos con 0 listados.
    }

    // PASO 2: Obtener todos nuestros directorios "maestros" desde Supabase
    console.log("[API OnlinePresenceAudit] Fetching directories from Supabase...");
    const { data: allOurDirectoriesDB, error: dbError } = await supabase // supabase es AHORA la instancia correcta
      .from('brightlocal_directories')
      .select('id, name, generic_url, supported_countries');

    if (dbError) {
      console.error("[API OnlinePresenceAudit] Supabase DB Error:", dbError);
      return NextResponse.json({ errors: [`Database error: ${dbError.message}`] }, { status: 500 });
    }
    if (!allOurDirectoriesDB) {
        console.error("[API OnlinePresenceAudit] No directories returned from Supabase, but no DB error.");
        return NextResponse.json({ errors: ['No master directory list found in database.'] }, { status: 404 });
    }
    console.log(`[API OnlinePresenceAudit] Fetched ${allOurDirectoriesDB.length} directories from Supabase.`);
    
    const masterDirectories: BrightLocalDirectoryFromDB[] = allOurDirectoriesDB;
    const relevantMasterDirectories = masterDirectories.filter(dir =>
        dir.supported_countries.includes(businessData.countryCode) ||
        dir.supported_countries.length === 0
    );
    console.log(`[API OnlinePresenceAudit] Directorios maestros relevantes para ${businessData.countryCode}: ${relevantMasterDirectories.length}`);

    // PASO 3: Comparar y construir el resultado final
    const listingsResult: DirectoryListingStatus[] = [];
    let foundCount = 0;

    for (const masterDir of relevantMasterDirectories) {
      // El campo que contiene el ID del directorio en la respuesta de BrightLocal
      // podría ser 'directory', 'directory_id', 'id', etc. ¡DEBES VERIFICARLO!
      const foundBLListing = foundListingsFromBL.find(blListing => blListing.directory === masterDir.id); // Asumiendo que es 'directory'
      const isListed = !!foundBLListing;

      if (isListed) {
        foundCount++;
      }

      listingsResult.push({
        directoryId: masterDir.id,
        directoryName: masterDir.name || masterDir.id,
        directoryUrl: masterDir.generic_url || undefined,
        isListed: isListed,
        listingUrl: foundBLListing?.url || undefined,
      });
    }

    const finalResult: PresenceAuditResult = {
      businessInfo: businessData,
      summary: {
        totalDirectoriesChecked: relevantMasterDirectories.length,
        foundIn: foundCount,
        notFoundIn: relevantMasterDirectories.length - foundCount,
      },
      listings: listingsResult,
    };
    console.log('[API OnlinePresenceAudit] Auditoría completada. Enviando resultados.');
    return NextResponse.json(finalResult);

  } catch (error: any) {
    console.error('[API OnlinePresenceAudit] General error:', error);
    return NextResponse.json({ errors: [error.message || 'An unexpected server error occurred.'] }, { status: 500 });
  }
}