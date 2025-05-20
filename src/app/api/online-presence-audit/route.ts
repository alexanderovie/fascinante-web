// src/app/api/online-presence-audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Asumo que esta es la ruta a tu cliente Supabase para servidor
import axios from 'axios';

// --- Interfaces (copiadas del frontend para consistencia) ---
interface BusinessFormData {
  businessName: string;
  countryCode: string;
  postalCode?: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  phone?: string;
  website?: string;
}

interface DirectoryListingStatus {
  directoryId: string;
  directoryName: string;
  directoryUrl?: string;
  isListed: boolean;
  listingUrl?: string;
  // napData?: any; // Descomenta si BrightLocal te da esta info por directorio
}

interface PresenceAuditResult {
  businessInfo: Partial<BusinessFormData>;
  summary: {
    totalDirectoriesChecked: number;
    foundIn: number;
    notFoundIn: number;
  };
  listings: DirectoryListingStatus[];
  errors?: string[];
}

interface BrightLocalDirectoryFromDB {
  id: string; // Corresponde a directoryId
  name: string; // Corresponde a directoryName
  generic_url?: string | null; // Corresponde a directoryUrl
  supported_countries: string[];
  country_specific_urls?: Record<string, string> | null;
}

// --- Constantes ---
const BRIGHTLOCAL_API_KEY = process.env.BRIGHTLOCAL_API_KEY;
// IMPORTANTE: Reemplaza esta URL con el endpoint correcto de BrightLocal para "Find/Fetch Profile"
const BRIGHTLOCAL_FETCH_PROFILE_ENDPOINT = 'https://api.brightlocal.com/data/v1/listings/find-profile'; // O '/fetch-profile'

export async function POST(request: NextRequest) {
  const supabase = createClient(); // Crea el cliente Supabase para uso en el servidor

  // Verificar si la API Key de BrightLocal está configurada
  if (!BRIGHTLOCAL_API_KEY) {
    console.error('Error: BRIGHTLOCAL_API_KEY no está configurada en el servidor.');
    return NextResponse.json({ errors: ['Server configuration error for BrightLocal API.'] }, { status: 500 });
  }

  let businessData: BusinessFormData;
  try {
    businessData = await request.json();
  } catch (e) {
    console.error('Error parsing request body:', e);
    return NextResponse.json({ errors: ['Invalid request body.'] }, { status: 400 });
  }

  // Validar datos de entrada básicos
  if (!businessData.businessName || !businessData.countryCode) {
    return NextResponse.json({ errors: ['Business name and country code are required.'] }, { status: 400 });
  }

  try {
    // PASO 1: Llamar a la API de BrightLocal para encontrar los listados del negocio
    // *****************************************************************************
    // *** ¡¡¡NECESITAS IMPLEMENTAR ESTA PARTE CON LA API REAL DE BRIGHTLOCAL!!! ***
    // *****************************************************************************
    // Consulta la documentación de BrightLocal para los parámetros exactos de "Find Profile" o "Fetch Profile".
    // https://developer.brightlocal.com/docs/data-apis/listings-api-v1o20k5c6zlwu4-find-profile
    // https://developer.brightlocal.com/docs/data-apis/p0pygznx7999y-fetch-profile
    
    console.log(`[API Backend] Iniciando auditoría para: ${businessData.businessName}, País: ${businessData.countryCode}`);
    console.log(`[API Backend] Datos recibidos:`, businessData);

    // Prepara el cuerpo de la solicitud para BrightLocal
    const brightLocalPayload: any = {
        // api_key: BRIGHTLOCAL_API_KEY, // Algunas APIs lo quieren en el cuerpo, otras solo como header
        'business-name': businessData.businessName,
        country: businessData.countryCode,
    };
    if (businessData.postalCode) brightLocalPayload.postcode = businessData.postalCode;
    if (businessData.streetAddress) brightLocalPayload.address = businessData.streetAddress; // O street_address
    if (businessData.city) brightLocalPayload.city = businessData.city;
    if (businessData.region) brightLocalPayload.region = businessData.region; // o state
    if (businessData.phone) brightLocalPayload.phone = businessData.phone;
    if (businessData.website) brightLocalPayload.website = businessData.website;

    let foundListingsFromBL: Array<{ directory_id: string; url?: string; /* otros campos de BL */ }> = [];

    try {
        console.log('[API Backend] Enviando solicitud a BrightLocal endpoint:', BRIGHTLOCAL_FETCH_PROFILE_ENDPOINT);
        console.log('[API Backend] Payload para BrightLocal:', brightLocalPayload);

        const brightLocalResponse = await axios.post(BRIGHTLOCAL_FETCH_PROFILE_ENDPOINT, brightLocalPayload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', // Asegúrate de que sea el Content-Type correcto
                'x-api-key': BRIGHTLOCAL_API_KEY,
            },
        });
        
        console.log('[API Backend] Respuesta de BrightLocal recibida, status:', brightLocalResponse.status);
        // console.log('[API Backend] Datos de BrightLocal:', brightLocalResponse.data); // Cuidado con loguear datos sensibles o muy grandes

        // El formato exacto de `brightLocalResponse.data` y cómo extraer los listados
        // dependerá del endpoint específico que uses ('find-profile' o 'fetch-profile')
        // y la estructura de su respuesta.
        // Ejemplo ASUMIDO (NECESITAS VERIFICAR ESTO CON LA DOCUMENTACIÓN DE BRIGHTLOCAL):
        if (brightLocalResponse.data && brightLocalResponse.data.results && Array.isArray(brightLocalResponse.data.results)) {
             // Si 'find-profile' devuelve múltiples posibles perfiles
            const profile = brightLocalResponse.data.results[0]; // Asumimos el primer resultado es el más relevante
            if (profile && profile.listings && Array.isArray(profile.listings)) {
                 foundListingsFromBL = profile.listings.map((listing: any) => ({
                    directory_id: listing.directory, // o listing.directory_id, o como se llame
                    url: listing.url,
                    // ... mapea otros campos relevantes de `listing`
                }));
            } else if (brightLocalResponse.data.listings && Array.isArray(brightLocalResponse.data.listings)) {
                // Si 'fetch-profile' devuelve los listados directamente
                 foundListingsFromBL = brightLocalResponse.data.listings.map((listing: any) => ({
                    directory_id: listing.directory,
                    url: listing.url,
                }));
            }
        } else if (brightLocalResponse.data.listings && Array.isArray(brightLocalResponse.data.listings)){
            // Otra estructura posible si los listados están en la raíz
             foundListingsFromBL = brightLocalResponse.data.listings.map((listing: any) => ({
                directory_id: listing.directory, // o como se llame el campo del ID del directorio
                url: listing.url
            }));
        }
         console.log(`[API Backend] Listados encontrados en BrightLocal: ${foundListingsFromBL.length}`);

    } catch (blError: any) {
        console.error('[API Backend] Error llamando a la API de BrightLocal:', blError.response?.data || blError.message);
        // No fallar aquí necesariamente, podríamos continuar con 0 listados encontrados
        // y mostrar al usuario que no se pudo conectar con BrightLocal o no se encontró el perfil.
        // O puedes optar por devolver un error al frontend:
        // return NextResponse.json({ errors: [`Error communicating with BrightLocal: ${blError.message}`] }, { status: 502 }); // Bad Gateway
    }


    // PASO 2: Obtener todos nuestros directorios "maestros" desde Supabase
    const { data: allOurDirectoriesDB, error: dbError } = await supabase
      .from('brightlocal_directories') // Nombre de tu tabla de directorios
      .select('id, name, generic_url, supported_countries'); // Campos que necesitas

    if (dbError) {
      console.error("[API Backend] Error al obtener directorios de Supabase:", dbError);
      throw new Error('Could not fetch directory list from our database.');
    }
    if (!allOurDirectoriesDB || allOurDirectoriesDB.length === 0) {
      console.error("[API Backend] No se encontraron directorios maestros en la base de datos.");
      throw new Error('Master directory list not found in our database.');
    }
    
    // Convertir a la interfaz esperada y filtrar por país
    const masterDirectories: BrightLocalDirectoryFromDB[] = allOurDirectoriesDB as BrightLocalDirectoryFromDB[];
    const relevantMasterDirectories = masterDirectories.filter(dir =>
        dir.supported_countries.includes(businessData.countryCode) || // Si el país está en la lista de soportados
        dir.supported_countries.length === 0 // O si la lista de soportados está vacía (asumimos global)
    );
    console.log(`[API Backend] Directorios maestros relevantes para ${businessData.countryCode}: ${relevantMasterDirectories.length}`);


    // PASO 3: Comparar y construir el resultado final
    const listingsResult: DirectoryListingStatus[] = [];
    let foundCount = 0;

    for (const masterDir of relevantMasterDirectories) {
      const foundBLListing = foundListingsFromBL.find(blListing => blListing.directory_id === masterDir.id);
      const isListed = !!foundBLListing;

      if (isListed) {
        foundCount++;
      }

      listingsResult.push({
        directoryId: masterDir.id,
        directoryName: masterDir.name || masterDir.id, // Usar nombre si existe, sino el ID
        directoryUrl: masterDir.generic_url || undefined,
        isListed: isListed,
        listingUrl: foundBLListing?.url || undefined,
        // napData: foundBLListing?.nap_data, // Si obtienes NAP de BrightLocal
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
    console.log('[API Backend] Auditoría completada. Enviando resultados.');
    return NextResponse.json(finalResult);

  } catch (error: any) {
    console.error('[API Backend] Error general en la API de auditoría de presencia:', error);
    return NextResponse.json({ errors: [error.message || 'An unexpected server error occurred.'] }, { status: 500 });
  }
}